import { AI_ENDPOINT_V1, VOICE_ENDPOINT, HttpMethod } from '@/constants/response-constant';
import { createUserAuthHeaders, sendRequest } from '@/lib/utils';
import {
  ICreateThreadResponse,
  IThread,
  IGetThreadHistoryResponse,
  IThreadsResponse as IGetThreadsResponse,
  IUpdateThreadResponse,
  IGetThreadResponse,
} from '@/types/ai';
import { User } from 'next-auth';

export interface CreateThreadParams {
  user: User;
  payload: {
    title: string;
    assistantId: string;
  };
}

export interface UpdateThreadParams {
  user: User;
  payload: {
    threadId: string;
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

export interface GenerateTitleParams {
  user: User;
  threadId: string;
}

export interface RecognizeVoiceParams {
  user: User;
  formData: FormData;
}

export const getThreads = async (params: GetThreadsParams): Promise<IGetThreadsResponse> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);
    const response: IResponse<IGetThreadsResponse> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/thread/get-all`,
      method: HttpMethod.GET,
      headers: headers,
      queryParams: params.payload,
    });

    return response.data as IGetThreadsResponse;
  } catch (error) {
    console.error('Error get threads: ', error);
    throw error;
  }
};

export const createThread = async (params: CreateThreadParams): Promise<ICreateThreadResponse> => {
  try {
    if (!params.payload.title) throw new Error("Missing 'title'");
    if (!params.payload.assistantId) throw new Error("Missing 'assistantId'");

    const headers: Record<string, string> = createUserAuthHeaders(params.user);
    const response: IResponse<ICreateThreadResponse> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/thread/create`,
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

export const getThread = async (params: GetThreadHistoryParams): Promise<IGetThreadResponse> => {
  try {
    if (!params.payload.threadId) throw new Error("Missing 'threadId'");

    const headers: Record<string, string> = createUserAuthHeaders(params.user);
    const response: IResponse<IGetThreadResponse> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/thread/${params.payload.threadId}/get-detail`,
      method: HttpMethod.GET,
      headers: headers,
    });

    return response.data as IGetThreadResponse;
  } catch (error) {
    console.error('Error get thread: ', error);
    throw error;
  }
};

export const getThreadHistory = async (
  params: GetThreadHistoryParams,
): Promise<IGetThreadHistoryResponse> => {
  try {
    if (!params.payload.threadId) throw new Error("Missing 'threadId'");

    const headers: Record<string, string> = createUserAuthHeaders(params.user);
    const response: IResponse<IGetThreadHistoryResponse> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/thread/${params.payload.threadId}/get-history`,
      method: HttpMethod.POST,
      headers: headers,
    });

    return response.data as IGetThreadHistoryResponse;
  } catch (error) {
    console.error('Error get history thread: ', error);
    throw error;
  }
};

export const updateThread = async (params: UpdateThreadParams): Promise<IUpdateThreadResponse> => {
  try {
    if (!params.payload.threadId) throw new Error("Missing 'threadId'");
    if (!params.payload.title) throw new Error("Missing 'title'");

    const headers: Record<string, string> = createUserAuthHeaders(params.user);
    const response: IResponse<IUpdateThreadResponse> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/thread/${params.payload.threadId}/update`,
      method: HttpMethod.PATCH,
      body: params.payload,
      headers: headers,
    });

    return response.data as IUpdateThreadResponse;
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
      url: `${AI_ENDPOINT_V1}/thread/${params.payload.threadId}/delete`,
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
      url: `${AI_ENDPOINT_V1}/thread/${params.user.id}/${params.threadId}/upload`,
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

export const generateTitle = async (params: GenerateTitleParams): Promise<IThread> => {
  try {
    if (!params.threadId) throw new Error("Missing 'threadId'");

    const headers: Record<string, string> = createUserAuthHeaders(params.user);
    const response: IResponse<IThread> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/thread/${params.threadId}/generate-title`,
      method: HttpMethod.POST,
      headers: headers,
    });

    return response.data as IThread;
  } catch (error) {
    console.error('Error generate title: ', error);
    throw error;
  }
};

export const recognizeVoice = async (params: RecognizeVoiceParams): Promise<object> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);
    const response: IResponse<object> = await sendRequest({
      url: `${VOICE_ENDPOINT}/recognize`,
      method: HttpMethod.POST,
      headers: headers,
      body: params.formData,
    });

    return response as object;
  } catch (error) {
    console.error('Error recognizing voice:', error);
    throw error;
  }
};
