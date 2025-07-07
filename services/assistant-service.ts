import { AI_ENDPOINT_V2, HttpMethod, AI_ENDPOINT_V1 } from '@/constants/response-constant';
import { createUserAuthHeaders, sendRequest } from '@/lib/utils';
import { IAssistant, CreateAssistantRequest, UpdateAssistantRequest } from '@/types/assistant';
import { User } from 'next-auth';

export interface GetAssistantsParams {
  user: User;
  payload?: {
    pageNumber?: number;
    maxPerPage?: number;
  };
}

export interface GetAdvancedAssistantsParams {
  user: User;
  payload?: {
    pageNumber?: number;
    maxPerPage?: number;
    assistant_type?: string;
  };
}

export interface CreateAssistantParams {
  user: User;
  payload: CreateAssistantRequest;
}

export interface UpdateAssistantParams {
  user: User;
  assistantId: string;
  payload: UpdateAssistantRequest;
}

export interface GetAssistantDetailParams {
  user: User;
  assistantId: string;
}

export interface DeleteAssistantParams {
  user: User;
  assistantId: string;
}

export const getGeneralAssistants = async (params: GetAssistantsParams): Promise<IAssistant> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IAssistant> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/assistant/get-or-create-general-assistant`,
      method: HttpMethod.GET,
      headers: headers,
    });

    return response?.data || ({} as IAssistant);
  } catch (error) {
    console.error('Error getting assistants: ', error);
    throw error;
  }
};

export const getAdvancedAssistants = async (
  params: GetAdvancedAssistantsParams,
): Promise<IAssistant[]> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<{ assistants: IAssistant[] }> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/assistant/get-all`,
      method: HttpMethod.GET,
      headers: headers,
      queryParams: {
        pageNumber: params.payload?.pageNumber || 1,
        maxPerPage: params.payload?.maxPerPage || 10,
        assistant_type: 'advanced_assistant',
      },
    });

    return response?.data?.assistants || [];
  } catch (error) {
    console.error('Error getting assistants: ', error);
    throw error;
  }
};

export const createAssistant = async (params: CreateAssistantParams): Promise<IAssistant> => {
  try {
    if (!params.payload.name) throw new Error('Assistant name is required');

    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IAssistant> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/assistant/create`,
      method: HttpMethod.POST,
      body: params.payload,
      headers: headers,
    });

    return response.data as IAssistant;
  } catch (error) {
    console.error('Error creating assistant: ', error);
    throw error;
  }
};

export const getAssistantDetail = async (params: GetAssistantDetailParams): Promise<IAssistant> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IAssistant> = await sendRequest({
      url: `${AI_ENDPOINT_V2}/assistant/${params.user.id}/${params.assistantId}/get-detail`,
      method: HttpMethod.GET,
      headers: headers,
    });

    return response.data as IAssistant;
  } catch (error) {
    console.error('Error getting assistant detail: ', error);
    throw error;
  }
};

export const updateAssistant = async (params: UpdateAssistantParams): Promise<IAssistant> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IAssistant> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/assistant/${params.assistantId}/update-advanced-assistant`,
      method: HttpMethod.PATCH,
      body: params.payload,
      headers: headers,
    });

    return response.data as IAssistant;
  } catch (error) {
    console.error('Error updating assistant: ', error);
    throw error;
  }
};

export const deleteAssistant = async (
  params: DeleteAssistantParams,
): Promise<{ deleted: boolean }> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<{ deleted: boolean }> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/assistant/${params.user.id}/${params.assistantId}/hard-delete-advanced-assistant`,
      method: HttpMethod.DELETE,
      headers: headers,
    });

    return response.data as { deleted: boolean };
  } catch (error) {
    console.error('Error deleting assistant: ', error);
    throw error;
  }
};
