import { ThreadType } from "@/constants/extension-constant"
import { API_ENDPOINT, HttpMethod } from "@/constants/response-constant"
import { sendRequest } from "@/lib/utils"
import { ICreateThreadResponse, IMessage, IThreadHistoryResponse, IThreadsResponse } from "@/types/ai"
import { IHeader } from "@/types/auth"
import { User } from "next-auth"

export interface CreateThreadParams {
    user: User;
    payload: {
        id: string;
        title: string;
        threadType?: ThreadType;
    };
}

export interface GetThreadsParams {
    user: User;
    payload: {
        cursor?: string;
        maxPerPage?: string;
    };
}

export interface GetThreadHistoryParams {
    user: User;
    payload: {
        threadId: string;
    };
}

export interface DeleteThreadParams {
    user: User;
    payload: {
        threadId: string;
    };
}

export const createThread = async (params: CreateThreadParams): Promise<ICreateThreadResponse> => {
    try {
        if (!params.user.id) throw new Error("Missing 'userId'");
        if (!params.payload.id) throw new Error("Missing 'threadId'");
        if (!params.payload.title) throw new Error("Missing 'title'");

        const headers: IHeader = {
            "x-user-id": params.user.id,
            "x-user-role": params.user.role,
        };

        const response: IResponse<ICreateThreadResponse> = await sendRequest({
            url: `${API_ENDPOINT}/ai/thread/${params.user.id}/create`,
            method: HttpMethod.POST,
            body: params.payload,
            headers: headers
        });

        return response.data as ICreateThreadResponse;
    } catch (error) {
        console.error("Error create thread: ", error);
        throw error;
    }
}

export const getThreads = async (params: GetThreadsParams): Promise<IThreadsResponse> => {
    try {
        if (!params.user.id) throw new Error("Missing 'userId'");

        const headers: IHeader = {
            "x-user-id": params.user.id,
            "x-user-role": params.user.role,
        };

        const response: IResponse<IThreadsResponse> = await sendRequest({
            url: `${API_ENDPOINT}/ai/thread/${params.user.id}/get-all`,
            method: HttpMethod.GET,
            headers: headers
        });

        return response.data as IThreadsResponse;
    } catch (error) {
        console.error("Error get threads: ", error);
        throw error;
    }
}

export const getThreadHistory = async (params: GetThreadHistoryParams): Promise<IThreadHistoryResponse> => {
    try {
        if (!params.user.id) throw new Error("Missing 'userId'");
        if (!params.payload.threadId) throw new Error("Missing 'threadId'");
        
        console.log("User ID: ", params.user.id);
        console.log("Thread ID: ", params.payload.threadId);

        const headers: IHeader = {
            "x-user-id": params.user.id,
            "x-user-role": params.user.role,
        };

        const response: IResponse<IThreadHistoryResponse> = await sendRequest({
            url: `${API_ENDPOINT}/ai/thread/${params.user.id}/${params.payload.threadId}/get-history`,
            method: HttpMethod.GET,
            headers: headers,
            nextOption: { cache: "no-store" }
        });

        return response.data as IThreadHistoryResponse;
    } catch (error) {
        console.error("Error get history thread: ", error);
        throw error;
    }
}

export const updateThread = async (params: CreateThreadParams): Promise<ICreateThreadResponse> => {
    try {
        if (!params.user.id) throw new Error("Missing 'userId'");
        if (!params.payload.id) throw new Error("Missing 'threadId'");
        if (!params.payload.title) throw new Error("Missing 'title'");

        const headers: IHeader = {
            "x-user-id": params.user.id,
            "x-user-role": params.user.role,
        };

        const response: IResponse<ICreateThreadResponse> = await sendRequest({
            url: `${API_ENDPOINT}/ai/thread/${params.user.id}/${params.payload.id}/update`,
            method: HttpMethod.PATCH,
            body: params.payload,
            headers: headers
        });

        return response.data as ICreateThreadResponse;
    } catch (error) {
        console.error("Error update thread: ", error);
        throw error;
    }
}

export const deleteThread = async (params: DeleteThreadParams): Promise<void> => {
    try {
        if (!params.user.id) throw new Error("Missing 'userId'");
        if (!params.payload.threadId) throw new Error("Missing 'threadId'");

        const headers: IHeader = {
            "x-user-id": params.user.id,
            "x-user-role": params.user.role,
        };

        await sendRequest({
            url: `${API_ENDPOINT}/ai/thread/${params.user.id}/${params.payload.threadId}/delete`,
            method: HttpMethod.DELETE,
            headers: headers
        });
    } catch (error) {
        console.error("Error delete thread: ", error);
        throw error;
    }
}