import { create } from "zustand";
import { generateUUID } from "@/lib/utils";
import { AgentName, ChatStatus, MessageRole } from "@/constants/ai-constant";
import { IChatResponse, ICreateThreadResponse, IMessage } from "@/types/ai";
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
    handleSubmit: (user: User) => Promise<void>;
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

    // Handle send message
    handleSubmit: async (user: User) => {
        const { input, threadId, append, setInput } = get();

        if (!input.trim()) return;
        const userMessage: IMessage = {
            id: generateUUID(),
            role: MessageRole.HUMAN,
            content: input,
        };

        // Append user message to the chat
        append(userMessage);
        setInput("");
        set({ status: ChatStatus.SUBMITTED });

        try {
            const params: ChatParams = {
                user,
                threadId,
                agentName: AgentName.CHAT,
                payload: { input: input, recursionLimit: 5 },
            };

            const response: IChatResponse = await sendMessage(params);

            append({ id: generateUUID(), role: MessageRole.AI, content: response.output });

            // mutate("/api/history");
            set({ status: ChatStatus.READY });
        } catch (error) {
            console.log("An error occurred, please try again!");
            set({ status: ChatStatus.ERROR });
        }
    },

    // Stop chat
    stop: () => {
        set({ status: ChatStatus.READY });
        console.log("Chat stopped");
    },

    // Reload chat
    reload: () => {
        set({ messages: [], status: ChatStatus.READY, threadId: "" });
        console.log("Chat reloaded");
    },
}));

export default useChatStore;
