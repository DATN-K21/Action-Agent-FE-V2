import { create } from "zustand";
import { generateUUID } from "@/lib/utils";
import { AgentName, ChatStatus, MessageRole } from "@/constants/ai-constant";
import { ICreateThreadResponse, IMessage } from "@/types/ai";
import { User } from "next-auth";
import { ChatParams, sendMessage } from "@/services/chat-service";
import { createThread } from "@/services/thread-service";


interface ChatState {
    messages: IMessage[];
    input: string;
    status: ChatStatus;
    threadId: string;
    setMessages: (messages: IMessage[]) => void;
    setInput: (text: string) => void;
    setThreadId: (threadId: string) => void;
    createThread: (user: User, threadId: string) => Promise<void>;
    append: (message: IMessage) => void;
    handleStreamChat: (user: User) => Promise<void>;
    stop: () => void;
    reload: () => void;
}

const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    input: "",
    status: ChatStatus.READY,
    threadId: "",

    setMessages: (messages) => set({ messages }),
    setInput: (text) => set({ input: text }),
    setThreadId: (threadId) => set({ threadId }),

    // Create a new chat thread
    createThread: async (user: User, threadId: string) => {
        try {
            const response: ICreateThreadResponse = await createThread({ user: user, payload: { id: threadId, title: "New Chat" } });
            set({ threadId: response.id });
        } catch (error) {
            console.error("Error creating thread: ", error);
            throw error;
        }
    },

    // Add a new message to the chat
    append: (message) =>
        set((state) => ({
            messages: [...state.messages, { ...message }],
        })),

    // Handle send message SSE
    handleStreamChat: async (user: User) => {
        const { input, threadId, append, setInput } = get();

        if (!input.trim()) return;

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
            const params: ChatParams = {
                user,
                threadId,
                agentName: AgentName.CHAT,
                payload: { input: input, recursionLimit: 5 },
            };

            // Call sendMessage service to initiate streaming response
            const reader = await sendMessage(params);
            set({ status: ChatStatus.STREAMING });

            const decoder = new TextDecoder();

            let accumulatedText = "";
            let aiMessage: IMessage = {
                id: generateUUID(),
                role: MessageRole.AI,
                content: "",
            };

            append(aiMessage); // Show AI message placeholder immediately

            while (true) {
                // Read stream data chunk-by-chunk
                const { done, value } = await reader.read();
                if (done) break; // Stop when stream ends

                // Check if chat status has changed, stop streaming if not "streaming"
                if (get().status !== ChatStatus.STREAMING) {
                    reader.cancel();
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                accumulatedText += chunk;

                // Split data into lines based on SSE format
                const lines = accumulatedText.split("\n");
                accumulatedText = lines.pop() || "";

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const jsonString = line.substring(6).trim();
                            const data = JSON.parse(jsonString);

                            if (data?.length > 0) {
                                const messageData = data[0].content;
                                set((state) => {
                                    const updatedMessages = [...state.messages];
                                    const lastIndex = updatedMessages.length - 1;

                                    if (lastIndex >= 0 && updatedMessages[lastIndex].role === MessageRole.AI) {
                                        updatedMessages[lastIndex] = {
                                            ...updatedMessages[lastIndex],
                                            content: messageData,
                                        };
                                    }

                                    return { messages: updatedMessages };
                                });
                            }
                        } catch (error) {
                            console.error('Error parsing SSE data:', error);
                        }
                    }
                }
            }

            // Set status to "ready" after AI response completes
            set({ status: ChatStatus.READY });
        } catch (error) {
            console.log("An error occurred, please try again!");
            set({ status: ChatStatus.ERROR }); // Update chat status to "error"
        }
    },


    // Stop chat
    stop: () => {
        set({ status: ChatStatus.READY });
    },

    // Reload chat
    reload: () => {
        set({ messages: [], status: ChatStatus.READY, threadId: "" });
        console.log("Chat reloaded");
    },
}));

export default useChatStore;
