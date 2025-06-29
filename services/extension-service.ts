import { Extension } from '@/constants/data';
import {
  AI_ENDPOINT_V1,
  AI_ENDPOINT_V2,
  EXTENSION_ENDPOINT,
  HttpMethod,
} from '@/constants/response-constant';
import { createUserAuthHeaders, sendRequest } from '@/lib/utils';
import {
  IConnectedExtension,
  IGetAllExtensionResponse,
  IGetConnectedExtensions,
  IGetExtensionActionsResponse,
  IActiveExtensionResponse,
} from '@/types/extension';
import { User } from 'next-auth';

export interface ExtensionParams {
  user: User;
  extension: Extension | null;
}

export interface DisconnectExtensionReponse {
  status: string;
  count: number;
  message: string | null;
  errorCode: string | null;
}

export const getAllExtensions = async (
  params: ExtensionParams,
): Promise<IGetAllExtensionResponse> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IGetAllExtensionResponse> = await sendRequest({
      url: `${EXTENSION_ENDPOINT}/apps?limit=1000`,
      method: HttpMethod.GET,
      headers: headers,
    });

    return response.data as IGetAllExtensionResponse;
  } catch (error) {
    console.error('Error getting extensions: ', error);
    throw error;
  }
};

export const getConnectedExtensions = async (
  params: ExtensionParams,
): Promise<IGetConnectedExtensions> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IGetConnectedExtensions> = await sendRequest({
      url: `${AI_ENDPOINT_V2}/connected-extension/${params.user.id!}/get-all`,
      method: HttpMethod.GET,
      headers: headers,
    });
    console.log('response.data: ', response.data);

    return response.data as IGetConnectedExtensions;
  } catch (error) {
    console.error('Error getting connected extensions: ', error);
    throw error;
  }
};

export const getDetailExtension = async (params: ExtensionParams): Promise<IConnectedExtension> => {
  try {
    if (!params.extension) throw new Error('Extension is required');

    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IConnectedExtension> = await sendRequest({
      url: `${AI_ENDPOINT_V2}/connected-app/${params.user.id!}/${params.extension.key}/get-detail`,
      method: HttpMethod.GET,
      headers: headers,
    });

    return response.data as IConnectedExtension;
  } catch (error) {
    console.error('Error getting extension detail: ', error);
    throw error;
  }
};

export const getExtensionActions = async (
  params: ExtensionParams,
): Promise<IGetExtensionActionsResponse> => {
  try {
    if (!params.extension) throw new Error('Extension is required');

    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IGetExtensionActionsResponse> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/extension/${params.extension.key}/get-actions`,
      method: HttpMethod.GET,
      headers: headers,
    });

    return response.data as IGetExtensionActionsResponse;
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
        extension_name: params.extension.key,
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
        extension_name: params.extension.key,
      },
    });

    return response.data as DisconnectExtensionReponse;
  } catch (error) {
    console.error('Error disconnect extension: ', error);
    throw error;
  }
};
