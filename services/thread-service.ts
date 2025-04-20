import { ThreadType } from '@/constants/extension-constant';
import { AI_ENDPOINT, HttpMethod } from '@/constants/response-constant';
import { createUserAuthHeaders, sendRequest } from '@/lib/utils';
import { ICreateThreadResponse, IThreadHistoryResponse, IThreadsResponse } from '@/types/ai';
import { User } from 'next-auth';

export interface CreateThreadParams {
  user: User;
  payload: {
    // id: string;
    title: string;
    threadType: ThreadType;
  };
}

export interface RenameThreadParams {
  user: User;
  payload: {
    id: string;
    title: string;
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

export interface UploadFileParams {
  user: User;
  threadId: string;
  payload: {
    file: File;
  };
}

export interface UploadFileResponse {
  userId: string;
  threadId: string;
  isSuccess: boolean;
  output: string;
}

export const getThreads = async (params: GetThreadsParams): Promise<IThreadsResponse> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);
    const query = params.payload?.cursor
      ? `?cursor=${encodeURIComponent(params.payload.cursor)}`
      : '';

    const response: IResponse<IThreadsResponse> = await sendRequest({
      url: `${AI_ENDPOINT}/thread/${params.user.id}/get-all${query}`,
      method: HttpMethod.GET,
      headers: headers,
    });

    return response.data as IThreadsResponse;
  } catch (error) {
    console.error('Error get threads: ', error);
    throw error;
  }
};

export const createThread = async (params: CreateThreadParams): Promise<ICreateThreadResponse> => {
  try {
    if (!params.payload.title) throw new Error("Missing 'title'");
    if (!params.payload.threadType) throw new Error("Missing 'threadType'");

    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<ICreateThreadResponse> = await sendRequest({
      url: `${AI_ENDPOINT}/thread/${params.user.id}/create`,
      method: HttpMethod.POST,
      body: params.payload,
      headers: headers,
    });

    return response.data as ICreateThreadResponse;
  } catch (error) {
    console.error('Error create thread: ', error);
    throw error;
  }
};

export const getThreadHistory = async (
  params: GetThreadHistoryParams,
): Promise<IThreadHistoryResponse> => {
  try {
    if (!params.payload.threadId) throw new Error("Missing 'threadId'");

    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IThreadHistoryResponse> = await sendRequest({
      url: `${AI_ENDPOINT}/thread/${params.user.id}/${params.payload.threadId}/get-history`,
      method: HttpMethod.GET,
      headers: headers,
    });

    return response.data as IThreadHistoryResponse;
  } catch (error) {
    console.error('Error get history thread: ', error);
    throw error;
  }
};

export const updateThread = async (params: RenameThreadParams): Promise<ICreateThreadResponse> => {
  try {
    if (!params.payload.id) throw new Error("Missing 'threadId'");
    if (!params.payload.title) throw new Error("Missing 'title'");

    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<ICreateThreadResponse> = await sendRequest({
      url: `${AI_ENDPOINT}/thread/${params.user.id}/${params.payload.id}/update`,
      method: HttpMethod.PATCH,
      body: params.payload,
      headers: headers,
    });

    return response.data as ICreateThreadResponse;
  } catch (error) {
    console.error('Error update thread: ', error);
    throw error;
  }
};

export const deleteThread = async (params: DeleteThreadParams): Promise<void> => {
  try {
    if (!params.payload.threadId) throw new Error("Missing 'threadId'");

    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    await sendRequest({
      url: `${AI_ENDPOINT}/thread/${params.user.id}/${params.payload.threadId}/delete`,
      method: HttpMethod.DELETE,
      headers: headers,
    });
  } catch (error) {
    console.error('Error delete thread: ', error);
    throw error;
  }
};

export const handleUploadFile = async (params: UploadFileParams): Promise<UploadFileResponse> => {
  try {
    if (!params.threadId) throw new Error("Missing 'threadId'");
    if (!params.payload.file) throw new Error("Missing 'file'");

    const headers: Record<string, string> = createUserAuthHeaders(params.user);
    const formData = new FormData();
    formData.append('file', params.payload.file);

    const response: IResponse<UploadFileResponse> = await sendRequest({
      url: `${AI_ENDPOINT}/thread/${params.user.id}/${params.threadId}/upload`,
      method: HttpMethod.POST,
      body: formData,
      headers: headers,
    });

    return response.data as UploadFileResponse;
  } catch (error) {
    console.error('Error upload file: ', error);
    throw error;
  }
};
