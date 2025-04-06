import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { generateUUID } from '@/lib/utils';
import { AgentType, ChatStatus, MessageRole } from '@/constants/ai-constant';
import { ICreateThreadResponse, IMessage } from '@/types/ai';
import { User } from 'next-auth';
import {
  InterruptStreamParams,
  StreamAgentParams,
  StreamExtensionParams,
  interruptStream,
  streamAgent,
  streamExtension,
} from '@/services/stream-service';
import { createThread } from '@/services/thread-service';
import { useThreadStore } from '@/store/thread-store';
import { ExtensionType, ThreadType } from '@/constants/extension-constant';

type ChatState = {
  agent: AgentType;
  extension: ExtensionType;
  messages: IMessage[];
  humanInput: string;
  status: ChatStatus;
  threadId: string;
};

type ChatActions = {
  setAgent: (agent: AgentType) => void;
  setExtension: (extension: ExtensionType) => void;
  setMessages: (messages: IMessage[]) => void;
  setHumanInput: (text: string) => void;
  setThreadId: (threadId: string) => void;
  setStatus: (status: ChatStatus) => void;
  createThread: (user: User, threadId: string, title?: string, type?: ThreadType) => Promise<void>;
  appendMessage: (message: IMessage) => void;
  handleStreamAgent: (user: User) => Promise<void>;
  handleStreamExtension: (user: User) => Promise<void>;
  handleStreamInterrupt: (user: User, toolcalls: any[]) => Promise<void>;
  stopStream: () => void;
  reloadChat: () => void;
};

type ChatStore = ChatState & ChatActions;

// The `immer` middleware is used to simplify immutable state updates by allowing direct mutation of the draft state.
const useChatStore = create<ChatStore>()(
  devtools(
    immer((set, get) => ({
      agent: AgentType.CHAT,
      extension: ExtensionType.DEFAULT,
      messages: [],
      humanInput: '',
      status: ChatStatus.READY,
      threadId: '',

      setAgent: (agent) => set({ agent: agent }),
      setExtension: (extension) => set({ extension: extension }),
      setMessages: (messages) => set({ messages }),
      setHumanInput: (text) => set({ humanInput: text }),
      setThreadId: (threadId) => set({ threadId }),
      setStatus: (status) => set({ status }),

      // Create a new chat thread
      // `title`: The title of the thread, defaults to 'New Chat' if not provided.
      // `type`: The type of the thread, defaults to `ThreadType.DEFAULT` if not provided.
      createThread: async (
        user: User,
        threadId: string,
        title: string = 'New Chat',
        type: ThreadType = ThreadType.DEFAULT,
      ) => {
        try {
          const response: ICreateThreadResponse = await createThread({
            user: user,
            payload: { id: threadId, title, threadType: type },
          });
          set({ threadId: response.id });

          const addThread = useThreadStore.getState().addThread;
          addThread(response);
        } catch (error) {
          throw error;
        }
      },

      // Add a new message to the chat
      appendMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, { ...message }],
        })),

      // Handle stream agent SSE
      handleStreamAgent: async (user: User) => {
        const { agent, humanInput, threadId, appendMessage, setHumanInput } = get();

        if (!humanInput.trim()) return;

        appendMessage({ id: generateUUID(), role: MessageRole.HUMAN, content: humanInput });
        appendMessage({ id: generateUUID(), role: MessageRole.AI, content: '' });

        set({ status: ChatStatus.SUBMITTED });
        setHumanInput('');

        try {
          const params: StreamAgentParams = {
            user,
            threadId,
            agentName: agent,
            payload: { input: humanInput, recursionLimit: 5 },
          };

          const reader = await streamAgent(params);
          const decoder = new TextDecoder();
          let accumulatedText = '';

          set({ status: ChatStatus.STREAMING });

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            if (get().status !== ChatStatus.STREAMING) {
              reader.cancel();
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            accumulatedText += chunk;

            const lines = accumulatedText.split('\n');
            accumulatedText = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const jsonString = line.substring(6).trim();
                  const data = JSON.parse(jsonString);

                  if (data?.length > 0) {
                    const messageData = data[0].content;

                    if (messageData) {
                      set((state) => {
                        const lastIndex = state.messages.length - 1;
                        if (lastIndex >= 0 && state.messages[lastIndex].role === MessageRole.AI) {
                          state.messages[lastIndex].content = messageData;
                        }
                      });
                    }
                  }
                } catch (error) {
                  console.error(
                    'Error parsing SSE data in handleStreamAgent:',
                    error,
                    'Raw data:',
                    line,
                  );
                }
              }
            }
          }

          set({ status: ChatStatus.READY });
        } catch (error) {
          console.error('Error in handleStreamAgent:', error);
          set({ status: ChatStatus.ERROR });
        }
      },

      // Handle stream extension SSE
      handleStreamExtension: async (user: User) => {
        const { extension, humanInput, threadId, appendMessage, setHumanInput } = get();

        if (!humanInput.trim()) return;

        appendMessage({ id: generateUUID(), role: MessageRole.HUMAN, content: humanInput });
        appendMessage({ id: generateUUID(), role: MessageRole.AI, content: '' });

        set({ status: ChatStatus.SUBMITTED });
        setHumanInput('');

        try {
          const params: StreamExtensionParams = {
            user,
            threadId,
            extensionName: extension,
            payload: { input: humanInput, recursionLimit: 5 },
          };

          const reader = await streamExtension(params);

          const decoder = new TextDecoder();
          let accumulatedText = '';

          set({ status: ChatStatus.STREAMING });

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            if (get().status !== ChatStatus.STREAMING) {
              reader.cancel();
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            accumulatedText += chunk;

            const lines = accumulatedText.split('\n');
            accumulatedText = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const jsonString = line.substring(6).trim();
                  const data = JSON.parse(jsonString);

                  set((state) => {
                    const lastIndex = state.messages.length - 1;
                    if (lastIndex < 0 || state.messages[lastIndex].role !== MessageRole.AI) return;

                    if (data.interrupted) {
                      state.messages[lastIndex] = {
                        ...state.messages[lastIndex],
                        content: 'You need to confirm this action.',
                        interrupted: true,
                        toolcalls: data.output,
                      };
                    } else if (data.output) {
                      state.messages[lastIndex].content = data.output;
                    }
                  });
                } catch (error) {
                  console.error(
                    'Error parsing SSE data in handleStreamExtension:',
                    error,
                    'Raw data:',
                    line,
                  );
                }
              }
            }
          }

          set({ status: ChatStatus.READY });
        } catch (error) {
          console.error('Error in handleStreamExtension:', error);
          set({ status: ChatStatus.ERROR });
          throw error;
        }
      },

      handleStreamInterrupt: async (user: User, toolCalls: any[]) => {
        set({ status: ChatStatus.SUBMITTED });
        const { extension, threadId, appendMessage } = get();
        appendMessage({ id: generateUUID(), role: MessageRole.AI, content: '' });

        try {
          const params: InterruptStreamParams = {
            user,
            threadId,
            extensionName: extension,
            payload: { toolCalls: toolCalls },
          };

          const reader = await interruptStream(params);
          set({ status: ChatStatus.STREAMING });

          const decoder = new TextDecoder();

          let accumulatedText = '';

          while (true) {
            // Read stream data chunk-by-chunk
            const { done, value } = await reader.read();
            if (done) break;

            // Check if chat status has changed, stop streaming if not "streaming"
            if (get().status !== ChatStatus.STREAMING) {
              reader.cancel();
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            accumulatedText += chunk;

            // Split data into lines based on SSE format
            const lines = accumulatedText.split('\n');
            accumulatedText = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const jsonString = line.substring(6).trim();
                  const data = JSON.parse(jsonString);

                  set((state) => {
                    const lastIndex = state.messages.length - 1;
                    if (lastIndex < 0 || state.messages[lastIndex].role !== MessageRole.AI) return;

                    if (data.interrupted) {
                      state.messages[lastIndex] = {
                        ...state.messages[lastIndex],
                        content: 'You need to confirm this action.',
                        interrupted: true,
                        toolcalls: data.output,
                      };
                    } else if (data.output) {
                      state.messages[lastIndex].content = data.output;
                    }
                  });
                } catch (error) {
                  console.error(
                    'Error parsing SSE data in handleStreamInterrupt:',
                    error,
                    'Raw data:',
                    line,
                  );
                }
              }
            }
          }

          set({ status: ChatStatus.READY });
        } catch (error) {
          console.error('Error in handleStreamInterrupt:', error);
          set({ status: ChatStatus.ERROR });
          throw error;
        }
      },

      // Stop chat
      stopStream: () => {
        set({ status: ChatStatus.READY });
        set((state) => {
          if (
            state.messages.length > 0 &&
            state.messages[state.messages.length - 1].role === MessageRole.AI
          ) {
            state.messages.pop();
          }
        });
      },

      // Reload chat
      reloadChat: () => {
        set({
          agent: AgentType.CHAT,
          messages: [],
          status: ChatStatus.READY,
          threadId: '',
          humanInput: '',
          extension: ExtensionType.DEFAULT,
        });
      },
    })),
  ),
);

export default useChatStore;
