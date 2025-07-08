import { IExtensionAction } from '@/constants/data';
import { AI_ENDPOINT_V1, EXTENSION_ENDPOINT, HttpMethod } from '@/constants/response-constant';
import { buildQueryParams, createUserAuthHeaders, sendRequest } from '@/lib/utils';
import { IConnectedExtension, IActiveExtensionResponse, IExtension } from '@/types/extension';
import { User } from 'next-auth';

export interface IPageFilterProps {
  page?: number | null;
  category?: string | null;
  sortBy?: string | '';
  sortOrder?: 'asc' | 'desc';
  search?: string | '';
  limit?: number;
  connected?: boolean | null;
}

export interface ExtensionParams {
  user: User;
  extension: IExtension | null;
  filter?: IPageFilterProps;
}

export interface DisconnectExtensionReponse {
  status: string;
  count: number;
  message: string | null;
  errorCode: string | null;
}

export interface ExtensionListResponse {
  data: IExtension[];
  meta: Record<string, any>;
}

export const getAllExtensions = async (params: ExtensionParams): Promise<ExtensionListResponse> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    // Build the query Url with optional filter parameters
    const queryParams = buildQueryParams({
      limit: params.filter?.limit || 24,
      page: params.filter?.page || 1,
      category: params.filter?.category,
      sortBy: params.filter?.sortBy,
      sortOrder: params.filter?.sortOrder,
      search: params.filter?.search,
      connected: params.filter?.connected,
    });

    const response: IResponse<IExtension[]> = await sendRequest({
      url: `${EXTENSION_ENDPOINT}/apps${queryParams}`,
      method: HttpMethod.GET,
      headers: headers,
    });

    return {
      data: response.data as IExtension[],
      meta: response.metadata || {},
    };
  } catch (error) {
    console.error('Error getting extensions: ', error);
    throw error;
  }
};

export const getDetailExtension = async (params: ExtensionParams): Promise<IConnectedExtension> => {
  try {
    if (!params.extension) throw new Error('Extension is required');

    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IConnectedExtension> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/connected-extension/${params.user.id!}/${params.extension.key}/get-detail`,
      method: HttpMethod.GET,
      headers: {
        ...headers,
        'connected-extension-id': params.extension.key || '',
      },
    });

    return response.data as IConnectedExtension;
  } catch (error) {
    console.error('Error getting extension detail: ', error);
    throw error;
  }
};

export const getExtensionActions = async (params: ExtensionParams): Promise<IExtensionAction[]> => {
  try {
    if (!params.extension) throw new Error('Extension is required');

    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IExtensionAction[]> = await sendRequest({
      url: `${EXTENSION_ENDPOINT}/actions?appKey=${params.extension.key}`,
      method: HttpMethod.GET,
    });

    return response.data as IExtensionAction[];
  } catch (error) {
    console.error('Error getting extension actions: ', error);
    throw error;
  }
};

export const activeExtension = async (
  params: ExtensionParams,
): Promise<IActiveExtensionResponse> => {
  try {
    if (!params.extension) throw new Error('Extension is required');
    if (params.extension.connected) throw new Error('Extension is already connected');

    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IActiveExtensionResponse> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/extension/active`,
      method: HttpMethod.POST,
      headers: headers,
      queryParams: {
        user_id: params.user.id,
        extension_enum: params.extension.key,
      },
    });

    return response.data as IActiveExtensionResponse;
  } catch (error) {
    console.error('Error active extension: ', error);
    throw error;
  }
};

export const disconnectExtension = async (
  params: ExtensionParams,
): Promise<DisconnectExtensionReponse> => {
  try {
    if (!params.extension) throw new Error('Extension is required');
    if (!params.extension.connected) throw new Error('Extension is not connected');

    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<DisconnectExtensionReponse> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/extension/disconnect`,
      method: HttpMethod.POST,
      headers: headers,
      queryParams: {
        user_id: params.user.id,
        extension_enum: params.extension.key,
      },
    });

    return response.data as DisconnectExtensionReponse;
  } catch (error) {
    console.error('Error disconnect extension: ', error);
    throw error;
  }
};
