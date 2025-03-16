import { AgentName } from "@/constants/ai-constant"
import { API_ENDPOINT } from "@/constants/response-constant"
import { sendRequest } from "@/lib/utils"
import { IChatRequest, IChatResponse } from "@/types/ai"
import { IHeader } from "@/types/auth"
import { User } from "next-auth"

export interface ChatParams {
    user: User;
    threadId: string;
    agentName: AgentName;
    payload: IChatRequest;
}

export const sendMessage = async (params: ChatParams): Promise<IChatResponse> => {
    try {
        if (!params.user.id) throw new Error("Missing 'userId'");
        if (!params.threadId) throw new Error("Missing 'threadId'");
        if (!params.agentName) throw new Error("Missing 'agentName'");

        const headers: IHeader = {
            "x-user-id": params.user.id,
            "x-user-role": params.user.role,
        };

        const response: IResponse<IChatResponse> = await sendRequest({
            url: `${API_ENDPOINT}/ai/agent/chat/${params.user.id}/${params.threadId}/${params.agentName}`,
            method: 'POST',
            body: params.payload,
            headers: headers
        });

        return response.data as IChatResponse;
    } catch (error) {
        console.error("Error sending message: ", error);
        throw error;
    }
}