import { create } from "zustand";
import { generateUUID } from "@/lib/utils";
import { AgentName, ChatStatus, MessageRole } from "@/constants/ai-constant";
import { ICreateThreadResponse, IMessage } from "@/types/ai";
import { User } from "next-auth";
import { ChatParams, sendMessage } from "@/services/chat-service";
import { createThread } from "@/services/thread-service";
import { useThreadStore } from '@/store/thread-store';
import { ExtensionSocketService } from "@/services/socketio-service";
import { IStreamEmitData, IStreamOnData } from "@/types/stream";
import { Extension } from "@/constants/data";
import { ThreadType } from "@/constants/extension-constant";


interface ChatState {
    agent: AgentName;
    messages: IMessage[];
    input: string;
    status: ChatStatus;
    threadId: string;
    setAgent: (agent: AgentName) => void;
    setMessages: (messages: IMessage[]) => void;
    setInput: (text: string) => void;
    setThreadId: (threadId: string) => void;
    createThread: (user: User, threadId: string, title?: string, type?: ThreadType) => Promise<void>;
    pop: () => void;
    append: (message: IMessage) => void;
    handleStreamChat: (user: User) => Promise<void>;
    handleStreamExtensionChat: (user: User, extension: Extension) => Promise<void>;
    stop: () => void;
    reload: () => void;
}

interface StreamResponseParams {
    user: User,
    threadId: string,
    extension: Extension,
    messages: IMessage[],
    set: any,
}

const useChatStore = create<ChatState>((set, get) => ({
  agent: AgentName.CHAT,
  messages: [],
  input: '',
  status: ChatStatus.READY,
  threadId: '',

  setAgent: (agent) => set({ agent: agent }),
  setMessages: (messages) => set({ messages }),
  setInput: (text) => set({ input: text }),
  setThreadId: (threadId) => set({ threadId }),

    // Create a new chat thread
    createThread: async (user: User, threadId: string, title: string = "New Chat", type: ThreadType = ThreadType.DEFAULT) => {
        try {
            const response: ICreateThreadResponse = await createThread({ user: user, payload: { id: threadId, title, threadType: type } });
            set({ threadId: response.id });

            const addThread = useThreadStore.getState().addThread;
            addThread(response);
        } catch (error) {
            throw error;
        }
    },

    // Add a new message to the chat
    append: (message) =>
        set((state) => ({
            messages: [...state.messages, { ...message }],
        })),
    
    pop: () =>
        set((state) => {
            const updatedMessages = [...state.messages];
            updatedMessages.pop();
            return { messages: updatedMessages };
        }
    ),

  // Handle send message SSE
  handleStreamChat: async (user: User) => {
    const { agent, input, threadId, append, setInput } = get()

    if (!input.trim()) return

    set({ status: ChatStatus.SUBMITTED })

    // Create a user message and add it to the chat
    const userMessage: IMessage = {
      id: generateUUID(),
      role: MessageRole.HUMAN,
      content: input,
    }

    append(userMessage)
    setInput('')

    try {
      const params: ChatParams = {
        user,
        threadId,
        agentName: agent,
        payload: { input: input, recursionLimit: 5 },
      }

      // Call sendMessage service to initiate streaming response
      const reader = await sendMessage(params)
      set({ status: ChatStatus.STREAMING })

      const decoder = new TextDecoder()

      let accumulatedText = ''
      let aiMessage: IMessage = {
        id: generateUUID(),
        role: MessageRole.AI,
        content: '',
      }

      append(aiMessage) // Show AI message placeholder immediately

      while (true) {
        // Read stream data chunk-by-chunk
        const { done, value } = await reader.read()
        if (done) break // Stop when stream ends

        // Check if chat status has changed, stop streaming if not "streaming"
        if (get().status !== ChatStatus.STREAMING) {
          reader.cancel()
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        accumulatedText += chunk

        // Split data into lines based on SSE format
        const lines = accumulatedText.split('\n')
        accumulatedText = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonString = line.substring(6).trim()
              const data = JSON.parse(jsonString)

              if (data?.length > 0) {
                const messageData = data[0].content

                if (messageData) {
                  set((state) => {
                    const updatedMessages = [...state.messages]
                    const lastIndex = updatedMessages.length - 1

                    if (
                      lastIndex >= 0 &&
                      updatedMessages[lastIndex].role === MessageRole.AI
                    ) {
                      updatedMessages[lastIndex] = {
                        ...updatedMessages[lastIndex],
                        content: messageData,
                      }
                    }

                    return { messages: updatedMessages }
                  })
                }
              }
            } catch (error) {
              console.error('Error parsing SSE data:', error)
            }
          }
        }
      }

            // Set status to "ready" after AI response completes
            set({ status: ChatStatus.READY });
        } catch (error) {
            set({ status: ChatStatus.ERROR });
            throw error;
        }
    },
  // Handle send message SSE for extension
  handleStreamExtensionChat: async (user: User, extension: Extension) => { 
    const { input, threadId, append, pop, setInput, messages } = get();    
    if (!input.trim()) {
        return;
    };

    set({ status: ChatStatus.SUBMITTED });
    // Create a user message and add it to the chat
    const userMessage: IMessage = {
        id: generateUUID(),
        role: MessageRole.HUMAN,
        content: input,
    };

    append(userMessage);
    setInput("");

    try {
        const params: IStreamEmitData = {
            user_id: user.id!,
            thread_id: threadId,
            extension_name: extension.key!,
            input: input,
        };

        // Emit stream event to the server
        ExtensionSocketService.emitStream(params);
        let outputToolCalls: any[] = [];
        let streamInterruptOutput = "";

        let isEmptyAiMessageAdded = false;
        

        const streamResponseHandler = (data: IStreamOnData) => {
            // Check for interrupted response
            if (data.interrupted === true) {
                if (isEmptyAiMessageAdded === false) {
                    let aiMessage: IMessage = {
                        id: generateUUID(),
                        role: MessageRole.AI,
                        content: "",
                    };            
                    append(aiMessage); // Show AI message placeholder immediately
                    isEmptyAiMessageAdded = true;
                }

                if (data.output && data.output.length > 0) {
                    outputToolCalls = data.output;
                } else if (data.streaming === false) {
                    // Remove the last message - empty AI message
                    pop();

                    const payload = {
                        user_id: user.id!,
                        thread_id: threadId,
                        extension_name: extension.key!,
                        execute: true,
                        tool_calls: outputToolCalls,
                    };
                    set({ status: ChatStatus.SUBMITTED });

                    ExtensionSocketService.emitStreamInterrupt(payload);

                    // Remove this listener
                    outputToolCalls = [];
                    ExtensionSocketService.offStreamResponse(streamResponseHandler);
                    return;
                }
            } else {
                // Otherwise, handle the normal response
                set({ status: ChatStatus.STREAMING });
                if (isEmptyAiMessageAdded === false) {
                    let aiMessage: IMessage = {
                        id: generateUUID(),
                        role: MessageRole.AI,
                        content: "",
                    };            
                    append(aiMessage); // Show AI message placeholder immediately
                    isEmptyAiMessageAdded = true;
                }
                
                const updatedMessages: IMessage[] = messages.map(x => x);
                const lastIndex = updatedMessages.length - 1;
                if (lastIndex >= 0 && updatedMessages[lastIndex].role === MessageRole.AI) {
                    let responseContent = data.output.toString() ?? "";
                    updatedMessages[lastIndex] = {
                        ...updatedMessages[lastIndex],
                        content: responseContent,
                    };
                }
        
                set({ messages: updatedMessages });
            }
        };

        // Listen for stream responses
        ExtensionSocketService.onStreamResponse(streamResponseHandler);
        
        const streamInterruptHandler = (data: IStreamOnData) => { 
            set({ status: ChatStatus.STREAMING });
            if (data.interrupted === true || data.streaming === false) {
                // Remove this listener
                streamInterruptOutput = "";
                ExtensionSocketService.offStreamInterrupt(streamInterruptHandler);
            }

            if (data.output) {
                streamInterruptOutput = data.output.toString();
                const updatedMessages: IMessage[] = messages.map(x => x);
                const lastIndex = updatedMessages.length - 1;

                if (lastIndex >= 0 && updatedMessages[lastIndex].role === MessageRole.AI) {
                    updatedMessages[lastIndex] = {
                        ...updatedMessages[lastIndex],
                        content: streamInterruptOutput,
                    };
                }

                set({ messages: updatedMessages });
            }
        }

        // Incase of stream interrupt
        ExtensionSocketService.onStreamInterrupt(streamInterruptHandler);

        // Set status to "ready" after AI response completes
        set({ status: ChatStatus.READY });
    } catch (error) {
        set({ status: ChatStatus.ERROR });
        throw error;
    }
},

  // Stop chat
  stop: () => {
    set({ status: ChatStatus.READY })
  },

  // Reload chat
  reload: () => {
    set({ messages: [], status: ChatStatus.READY, threadId: '' })
  },
}))

export default useChatStore
