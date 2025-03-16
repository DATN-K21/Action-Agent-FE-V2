import { AgentName } from "@/constants/ai-constant"
import { API_ENDPOINT } from "@/constants/response-constant"
import { IChatRequest, IChatResponse } from "@/types/ai"
import { User } from "next-auth"

export interface ChatParams {
    user: User;
    threadId: string;
    agentName: AgentName;
    payload: IChatRequest;
}

export const sendMessage = async (params: ChatParams): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
    try {
        if (!params.user.id) throw new Error("Missing 'userId'");
        if (!params.threadId) throw new Error("Missing 'threadId'");
        if (!params.agentName) throw new Error("Missing 'agentName'");

        const headers: Record<string, string> = {
            "x-user-id": params.user.id,
            "x-user-role": params.user.role,
            "Content-Type": "application/json",
            "Accept": "application/json",
        };

        const response = await fetch(
            `${API_ENDPOINT}/ai/agent/stream/${params.user.id}/${params.threadId}/${params.agentName}`,
            {
                method: "POST",
                body: JSON.stringify(params.payload),
                headers: headers,
            }
        );

        if (!response.body) {
            throw new Error("No response body received!");
        }

        return response.body.getReader();
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};
