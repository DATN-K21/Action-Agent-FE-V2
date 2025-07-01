import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { AgentType, ChatStatus, MessageType } from '@/constants/ai-constant';
import { ICreateThreadResponse, IMessage } from '@/types/ai';
import { User } from 'next-auth';
import {
  InterruptStreamParams,
  StreamAgentParams,
  StreamExtensionParams,
  StreamTeamParams,
  interruptStream,
  streamAgent,
  streamExtension,
  streamTeam,
  chatMCPAgent,
  chatAssistant,
} from '@/services/stream-service';
import { createThread } from '@/services/thread-service';
import { useThreadStore } from '@/store/thread-store';
import { ExtensionType } from '@/constants/extension-constant';
import { assistants } from '@/constants/data';

type ChatState = {
  agent: AgentType;
  extension: ExtensionType;
  messages: IMessage[];
  humanInput: string;
  status: ChatStatus;
  selectedAssistant: any;
  threadId: string;
  teamId: string;
  isCreatingThread: boolean;
};

type ChatActions = {
  setAgent: (agent: AgentType) => void;
  setExtension: (extension: ExtensionType) => void;
  setMessages: (messages: IMessage[]) => void;
  setHumanInput: (text: string) => void;
  setSelectedAssistant: (assistantId: string) => void;
  setThreadId: (threadId: string) => void;
  setTeamId: (teamId: string) => void;
  setStatus: (status: ChatStatus) => void;
  createThread: (user: User, title: string, assistantId: string) => Promise<ICreateThreadResponse>;
  appendMessage: (message: IMessage) => void;
  handleStreamAgent: (user: User) => Promise<void>;
  handleStreamExtension: (user: User) => Promise<void>;
  handleStreamInterrupt: (user: User, toolcalls: any[]) => Promise<void>;
  handleStreamMCPAgent: (user: User) => Promise<void>;
  handleStreamAssistant: (user: User, assistantId: string) => Promise<void>;
  handleStreamTeam: (user: User, teamId: string) => Promise<void>;
  stopStream: () => void;
  reloadChat: () => void;
};

type ChatStore = ChatState & ChatActions;

const useChatStore = create<ChatStore>()(
  devtools(
    immer((set, get) => ({
      agent: AgentType.CHAT as AgentType,
      extension: ExtensionType.DEFAULT,
      messages: [] as IMessage[],
      humanInput: '',
      status: ChatStatus.READY,
      selectedAssistant: null,
      threadId: '',
      teamId: '',
      isCreatingThread: false,

      setAgent: (agent) => set({ agent: agent }),
      setExtension: (extension) => set({ extension: extension }),
      setMessages: (messages) => set({ messages }),
      setHumanInput: (text) => set({ humanInput: text }),
      setThreadId: (threadId) => set({ threadId }),
      setTeamId: (teamId) => set({ teamId }),
      setSelectedAssistant: (assistantId) => {
        const assistant = assistants.find((assistant: any) => assistant.id === assistantId);
        set({ selectedAssistant: assistant });
      },
      setStatus: (status) => set({ status }),

      // Create a new chat thread
      createThread: async (
        user: User,
        title: string,
        assistantId: string,
      ): Promise<ICreateThreadResponse> => {
        set({ isCreatingThread: true });

        try {
          const response: ICreateThreadResponse = await createThread({
            user: user,
            payload: { title, assistantId },
          });
          set({ threadId: response.id });

          const addThread = useThreadStore.getState().addThread;
          addThread(response);

          return response;
        } catch (error) {
          throw error;
        } finally {
          set({ isCreatingThread: false });
        }
      },

      // Add a new message to the chat
      appendMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, { ...message }],
        })),

      // Handle stream agent SSE
      handleStreamAgent: async (user: User) => {
        // const { agent, humanInput, threadId, appendMessage, setHumanInput } = get();
        // if (!humanInput.trim()) return;
        // appendMessage({ id: uuidv4(), type: MessageType.HUMAN, content: humanInput, name: '' });
        // appendMessage({ id: uuidv4(), type: MessageType.AI, content: '', name: '' });
        // set({ status: ChatStatus.SUBMITTED });
        // setHumanInput('');
        // try {
        //   const params: StreamAgentParams = {
        //     user,
        //     threadId,
        //     agentName: agent,
        //     payload: { input: humanInput, recursionLimit: 20 },
        //   };
        //   const reader = await streamAgent(params);
        //   const decoder = new TextDecoder();
        //   let accumulatedText = '';
        //   set({ status: ChatStatus.STREAMING });
        //   while (true) {
        //     const { value, done } = await reader.read();
        //     if (done) break;
        //     if (get().status !== ChatStatus.STREAMING) {
        //       reader.cancel();
        //       break;
        //     }
        //     const chunk = decoder.decode(value, { stream: true });
        //     accumulatedText += chunk;
        //     const lines = accumulatedText.split('\n');
        //     accumulatedText = lines.pop() || '';
        //     for (const line of lines) {
        //       if (line.startsWith('data: ')) {
        //         try {
        //           const jsonString = line.substring(6).trim();
        //           const data = JSON.parse(jsonString);
        //           if (data?.length > 0) {
        //             const messageData = data[0].content;
        //             if (messageData) {
        //               set((state) => {
        //                 const lastIndex = state.messages.length - 1;
        //                 if (lastIndex >= 0 && state.messages[lastIndex].type === MessageType.AI) {
        //                   state.messages[lastIndex].content = messageData;
        //                 }
        //               });
        //             }
        //           }
        //         } catch (error) {
        //           console.error(
        //             'Error parsing SSE data in handleStreamAgent:',
        //             error,
        //             'Raw data:',
        //             line,
        //           );
        //         }
        //       }
        //     }
        //   }
        //   set({ status: ChatStatus.READY });
        // } catch (error) {
        //   console.error('Error in handleStreamAgent:', error);
        //   set({ status: ChatStatus.ERROR });
        // }
      },

      // Handle stream extension SSE
      handleStreamExtension: async (user: User) => {
        // const { extension, humanInput, threadId, appendMessage, setHumanInput } = get();
        // if (!humanInput.trim()) return;
        // appendMessage({ id: uuidv4(), type: MessageType.HUMAN, content: humanInput, name: '' });
        // appendMessage({ id: uuidv4(), type: MessageType.AI, content: '', name: '' });
        // set({ status: ChatStatus.SUBMITTED });
        // setHumanInput('');
        // try {
        //   const params: StreamExtensionParams = {
        //     user,
        //     threadId,
        //     extensionName: extension,
        //     payload: { input: humanInput, recursionLimit: 20 },
        //   };
        //   const reader = await streamExtension(params);
        //   const decoder = new TextDecoder();
        //   let accumulatedText = '';
        //   set({ status: ChatStatus.STREAMING });
        //   while (true) {
        //     const { value, done } = await reader.read();
        //     if (done) break;
        //     if (get().status !== ChatStatus.STREAMING) {
        //       reader.cancel();
        //       break;
        //     }
        //     const chunk = decoder.decode(value, { stream: true });
        //     accumulatedText += chunk;
        //     const lines = accumulatedText.split('\n');
        //     accumulatedText = lines.pop() || '';
        //     for (const line of lines) {
        //       if (line.startsWith('data: ')) {
        //         try {
        //           const jsonString = line.substring(6).trim();
        //           const data = JSON.parse(jsonString);
        //           set((state) => {
        //             const lastIndex = state.messages.length - 1;
        //             if (lastIndex < 0 || state.messages[lastIndex].role !== MessageType.AI) return;
        //             if (data.interrupted) {
        //               state.messages[lastIndex] = {
        //                 ...state.messages[lastIndex],
        //                 content: 'You need to confirm this action.',
        //                 interrupted: true,
        //                 tool_calls: data.output,
        //               };
        //             } else if (data.output) {
        //               state.messages[lastIndex].content = data.output;
        //             }
        //           });
        //         } catch (error) {
        //           console.error(
        //             'Error parsing SSE data in handleStreamExtension:',
        //             error,
        //             'Raw data:',
        //             line,
        //           );
        //         }
        //       }
        //     }
        //   }
        //   set({ status: ChatStatus.READY });
        // } catch (error) {
        //   console.error('Error in handleStreamExtension:', error);
        //   set({ status: ChatStatus.ERROR });
        //   throw error;
        // }
      },

      handleStreamInterrupt: async (user: User, toolCalls: any[]) => {
        // set({ status: ChatStatus.SUBMITTED });
        // const { extension, threadId, appendMessage } = get();
        // appendMessage({ id: uuidv4(), type: MessageType.AI, content: '', name: '' });
        // try {
        //   const params: InterruptStreamParams = {
        //     user,
        //     threadId,
        //     extensionName: extension,
        //     payload: { toolCalls: toolCalls },
        //   };
        //   const reader = await interruptStream(params);
        //   set({ status: ChatStatus.STREAMING });
        //   const decoder = new TextDecoder();
        //   let accumulatedText = '';
        //   while (true) {
        //     // Read stream data chunk-by-chunk
        //     const { done, value } = await reader.read();
        //     if (done) break;
        //     // Check if chat status has changed, stop streaming if not "streaming"
        //     if (get().status !== ChatStatus.STREAMING) {
        //       reader.cancel();
        //       break;
        //     }
        //     const chunk = decoder.decode(value, { stream: true });
        //     accumulatedText += chunk;
        //     // Split data into lines based on SSE format
        //     const lines = accumulatedText.split('\n');
        //     accumulatedText = lines.pop() || '';
        //     for (const line of lines) {
        //       if (line.startsWith('data: ')) {
        //         try {
        //           const jsonString = line.substring(6).trim();
        //           const data = JSON.parse(jsonString);
        //           set((state) => {
        //             const lastIndex = state.messages.length - 1;
        //             if (lastIndex < 0 || state.messages[lastIndex].role !== MessageType.AI) return;
        //             if (data.interrupted) {
        //               state.messages[lastIndex] = {
        //                 ...state.messages[lastIndex],
        //                 content: 'You need to confirm this action.',
        //                 interrupted: true,
        //                 toolcalls: data.output,
        //               };
        //             } else if (data.output) {
        //               state.messages[lastIndex].content = data.output;
        //             }
        //           });
        //         } catch (error) {
        //           console.error(
        //             'Error parsing SSE data in handleStreamInterrupt:',
        //             error,
        //             'Raw data:',
        //             line,
        //           );
        //         }
        //       }
        //     }
        //   }
        //   set({ status: ChatStatus.READY });
        // } catch (error) {
        //   console.error('Error in handleStreamInterrupt:', error);
        //   set({ status: ChatStatus.ERROR });
        //   throw error;
        // }
      },

      // // Handle stream MCP agent
      // handleStreamMCPAgent: async (user: User) => {
      //   const { humanInput, threadId, appendMessage, setHumanInput } = get();

      //   if (!humanInput.trim()) return;

      //   appendMessage({ id: uuidv4(), role: MessageType.HUMAN, content: humanInput });
      //   appendMessage({ id: uuidv4(), role: MessageType.AI, content: '' });

      //   set({ status: ChatStatus.SUBMITTED });
      //   setHumanInput('');

      //   try {
      //     const params: StreamMCPAgentParams = {
      //       user,
      //       threadId,
      //       payload: { input: humanInput, recursionLimit: 20 },
      //     };

      //     const reader = await streamMCPAgent(params);
      //     const decoder = new TextDecoder();
      //     let accumulatedText = '';

      //     set({ status: ChatStatus.STREAMING });

      //     while (true) {
      //       const { value, done } = await reader.read();
      //       if (done) break;

      //       if (get().status !== ChatStatus.STREAMING) {
      //         reader.cancel();
      //         break;
      //       }

      //       const chunk = decoder.decode(value, { stream: true });
      //       accumulatedText += chunk;

      //       const lines = accumulatedText.split('\n');
      //       accumulatedText = lines.pop() || '';

      //       for (const line of lines) {
      //         if (line.startsWith('data: ')) {
      //           try {
      //             const jsonString = line.substring(6).trim();
      //             const data = JSON.parse(jsonString);

      //             if (data?.length > 0) {
      //               const messageData = data[0].content;

      //               if (messageData) {
      //                 set((state) => {
      //                   const lastIndex = state.messages.length - 1;
      //                   if (lastIndex >= 0 && state.messages[lastIndex].role === MessageType.AI) {
      //                     state.messages[lastIndex].content = messageData;
      //                   }
      //                 });
      //               }
      //             }
      //           } catch (error) {
      //             console.error(
      //               'Error parsing SSE data in handleStreamMCPAgent:',
      //               error,
      //               'Raw data:',
      //               line,
      //             );
      //           }
      //         }
      //       }
      //     }

      //     set({ status: ChatStatus.READY });
      //   } catch (error) {
      //     console.error('Error in handleStreamMCPAgent:', error);
      //     set({ status: ChatStatus.ERROR });
      //   }
      // },
      // Handle stream MCP agent
      handleStreamMCPAgent: async (user: User) => {
        // const { humanInput, threadId, appendMessage, setHumanInput } = get();
        // if (!humanInput.trim()) return;
        // appendMessage({ id: uuidv4(), type: MessageType.HUMAN, content: humanInput, name: '' });
        // appendMessage({ id: uuidv4(), type: MessageType.AI, content: '', name: '' });
        // set({ status: ChatStatus.SUBMITTED });
        // setHumanInput('');
        // try {
        //   set({ status: ChatStatus.SUBMITTED });
        //   const response = await chatMCPAgent({
        //     user,
        //     threadId,
        //     payload: {
        //       input: humanInput,
        //       recursionLimit: 20,
        //     },
        //   });
        //   // Update the AI message with the response content
        //   if (response && response.data) {
        //     set((state) => {
        //       const lastIndex = state.messages.length - 1;
        //       if (lastIndex >= 0 && state.messages[lastIndex].role === MessageType.AI) {
        //         state.messages[lastIndex].content =
        //           response.data.output || response.data.content || '';
        //       }
        //     });
        //   }
        //   set({ status: ChatStatus.READY });
        // } catch (error) {
        //   console.error('Error in handleMcpChat:', error);
        //   set({ status: ChatStatus.ERROR });
        // }
      },

      // Handle stream Assistant agent
      handleStreamAssistant: async (user: User, assistantId: string) => {
        // const { humanInput, threadId, appendMessage, setHumanInput } = get();
        // if (!humanInput.trim()) return;
        // appendMessage({ id: uuidv4(), type: MessageType.HUMAN, content: humanInput, name: '' });
        // appendMessage({ id: uuidv4(), type: MessageType.AI, content: '', name: '' });
        // set({ status: ChatStatus.SUBMITTED });
        // setHumanInput('');
        // try {
        //   set({ status: ChatStatus.SUBMITTED });
        //   const response = await chatAssistant({
        //     user,
        //     assistantId,
        //     threadId,
        //     payload: {
        //       input: humanInput,
        //       recursionLimit: 20,
        //     },
        //   });
        //   // Update the AI message with the response content
        //   if (response && response.data) {
        //     set((state) => {
        //       const lastIndex = state.messages.length - 1;
        //       if (lastIndex >= 0 && state.messages[lastIndex].role === MessageType.AI) {
        //         state.messages[lastIndex].content =
        //           response.data.output || response.data.content || '';
        //       }
        //     });
        //   }
        //   set({ status: ChatStatus.READY });
        // } catch (error) {
        //   console.error('Error in handleAssistantChat:', error);
        //   set({ status: ChatStatus.ERROR });
        // }
      },

      // Handle stream Team agent
      handleStreamTeam: async (user: User, teamId: string) => {
        const { humanInput, threadId, appendMessage, setHumanInput } = get();

        if (!humanInput.trim()) return;

        appendMessage({
          id: crypto.randomUUID(),
          type: MessageType.HUMAN,
          content: humanInput,
          name: '',
        });
        appendMessage({
          id: crypto.randomUUID(),
          type: MessageType.AI,
          content: '',
          name: '',
        });

        set({ status: ChatStatus.SUBMITTED });
        setHumanInput('');

        try {
          const params: StreamTeamParams = {
            user,
            threadId,
            teamId,
            payload: {
              messages: [
                {
                  type: MessageType.HUMAN,
                  content: humanInput,
                },
              ],
            },
          };

          const reader = await streamTeam(params);
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
              if (line.trim()) {
                try {
                  const jsonString = line.substring(6).trim();
                  const data = JSON.parse(jsonString);

                  if (data.type === MessageType.AI && data.content) {
                    set((state) => {
                      const lastIndex = state.messages.length - 1;
                      if (lastIndex >= 0 && state.messages[lastIndex].type === MessageType.AI) {
                        state.messages[lastIndex] = {
                          ...state.messages[lastIndex],
                          id: data.id || state.messages[lastIndex].id,
                          name: data.name || state.messages[lastIndex].name,
                          content: (state.messages[lastIndex].content || '') + data.content,
                          imgdata: data.imgdata || state.messages[lastIndex].imgdata,
                          tool_calls: data.tool_calls || state.messages[lastIndex].tool_calls,
                          tool_output: data.tool_output || state.messages[lastIndex].tool_output,
                        };
                      }
                    });
                  }
                } catch (error) {
                  console.error(
                    'Error parsing stream data in handleStreamTeam:',
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
          console.error('Error in handleStreamTeam:', error);
          set({ status: ChatStatus.ERROR });
          throw error;
        }
      },

      // Stop chat
      stopStream: () => {
        set({ status: ChatStatus.READY });
      },

      // Reload chat
      reloadChat: () => {
        set({
          agent: AgentType.CHAT,
          messages: [],
          status: ChatStatus.READY,
          threadId: '',
          teamId: '',
          humanInput: '',
          extension: ExtensionType.DEFAULT,
        });
      },
    })),
  ),
);

export default useChatStore;
