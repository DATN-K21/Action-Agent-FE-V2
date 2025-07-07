import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ChatStatus, MessageType } from '@/constants/ai-constant';
import { ICreateThreadResponse, IMessage } from '@/types/ai';
import { User } from 'next-auth';
import { StreamTeamParams, streamTeam } from '@/services/stream-service';
import { createThread } from '@/services/thread-service';
import { useThreadStore } from '@/store/thread-store';
import { IAssistant } from '@/types/assistant';

interface ChatStore {
  assistant: IAssistant | null;
  messages: IMessage[];
  input: string;
  status: ChatStatus;
  threadId: string;
  teamId: string;
  isCreatingThread: boolean;
  setAssistant: (assistant: IAssistant) => void;
  setMessages: (messages: IMessage[]) => void;
  setInput: (input: string) => void;
  setThreadId: (threadId: string) => void;
  setTeamId: (teamId: string) => void;
  setStatus: (status: ChatStatus) => void;
  createThread: (user: User, title: string, assistantId: string) => Promise<ICreateThreadResponse>;
  appendMessage: (message: IMessage) => void;
  handleStreamTeam: (user: User) => Promise<void>;
  stopStream: () => void;
  reloadChat: () => void;
}

const useChatStore = create<ChatStore>()(
  immer((set, get) => ({
    assistant: null as IAssistant | null,
    messages: [] as IMessage[],
    input: '',
    status: ChatStatus.READY,
    threadId: '',
    teamId: '',
    isCreatingThread: false,
    setAssistant: (assistant) => set({ assistant }),
    setMessages: (messages) => set({ messages }),
    setInput: (input) => set({ input }),
    setThreadId: (threadId) => set({ threadId }),
    setTeamId: (teamId) => set({ teamId }),
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

    // Handle stream Team agent
    handleStreamTeam: async (user: User) => {
      const { input, threadId, teamId, appendMessage, setInput } = get();

      if (!input.trim()) return;

      appendMessage({
        id: crypto.randomUUID(),
        type: MessageType.HUMAN,
        content: input,
        name: '',
        imgdata: '',
        tool_calls: [],
        tool_output: null,
        documents: null,
        next: '',
      });

      set({ status: ChatStatus.SUBMITTED });
      setInput('');

      try {
        const params: StreamTeamParams = {
          user,
          threadId,
          teamId,
          payload: {
            messages: [
              {
                type: MessageType.HUMAN,
                content: input,
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

                if (data.content || data.tool_calls) {
                  set((state) => {
                    const lastIndex = state.messages.length - 1;

                    if (
                      lastIndex >= 0 &&
                      state.messages[lastIndex].id === data.id &&
                      state.messages[lastIndex].name === data.name
                    ) {
                      state.messages[lastIndex] = {
                        ...state.messages[lastIndex],
                        type: data.type,
                        content: (state.messages[lastIndex].content || '') + data.content,
                        name: data.name,
                        imgdata: data.imgdata,
                        tool_calls: data.tool_calls,
                        tool_output: data.tool_output,
                        documents: data.documents,
                        next: data.next,
                      };
                    } else {
                      state.messages.push({
                        id: data.id,
                        type: data.type,
                        content: data.content,
                        name: data.name,
                        imgdata: data.imgdata,
                        tool_calls: data.tool_calls,
                        tool_output: data.tool_output,
                        documents: data.documents,
                        next: data.next,
                      });
                    }

                    return state;
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
        assistant: null,
        messages: [],
        status: ChatStatus.READY,
        threadId: '',
        teamId: '',
        input: '',
      });
    },
  })),
);

export default useChatStore;
