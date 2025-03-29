
import { Extension } from "@/constants/data";
import { API_ENDPOINT } from "@/constants/response-constant"
import { sendRequest } from "@/lib/utils";
import {
  IConnectedApp,
  IGetAllExtensionResponse,
  IGetConnectedExtensions,
  IGetExtensionActions,
  IActiveExtension,
} from "@/types/extension";
import { User } from "next-auth"

export interface ExtensionParams {
  user: User;
  extension: Extension | undefined;
  payload: any;
}

export interface IExtension {
  name: string
}

export const getAllExtensions = async (
  params: ExtensionParams,
): Promise<IGetAllExtensionResponse> => {
  try {
    const headers: Record<string, string> = {
      'x-user-id': params.user.id!,
      'x-user-role': params.user.role,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    const response: IResponse<IGetAllExtensionResponse> = await sendRequest({
      url: `${API_ENDPOINT}/ai/extension/get-all`,
      method: 'GET',
      headers: headers,
    })

    return response.data as IGetAllExtensionResponse
  } catch (error) {
    console.error('Error getting extensions: ', error)
    throw error
  }
}

export const getConnectedExtensions = async (
  params: ExtensionParams,
): Promise<IGetConnectedExtensions> => {
  try {
    const headers: Record<string, string> = {
      'x-user-id': params.user.id!,
      'x-user-role': params.user.role,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    const response: IResponse<IGetConnectedExtensions> = await sendRequest({
      url: `${API_ENDPOINT}/ai/connected-app/${params.user.id!}/get-all`,
      method: 'GET',
      headers: headers,
    })

    return response.data as IGetConnectedExtensions
  } catch (error) {
    console.error('Error getting connected extensions: ', error)
    throw error
  }
}

export const getDetailExtension = async (params: ExtensionParams): Promise<IConnectedApp> => { 
  if (!params.extension) {
    throw new Error('Extension is required');
  }

  try {
    const headers: Record<string, string> = {
      'x-user-id': params.user.id!,
      'x-user-role': params.user.role,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    const response: IResponse<IConnectedApp> = await sendRequest({
      url: `${API_ENDPOINT}/ai/connected-app/${params.user.id!}/${params.extension.key}/get-detail`,
      method: 'GET',
      headers: headers,
    })

    return response.data as IConnectedApp
  } catch (error) {
    console.error('Error getting extension detail: ', error)
    throw error
  }
}

export const getExtensionActions = async (params: ExtensionParams): Promise<IGetExtensionActions> => { 
  if (!params.extension) {
    throw new Error('Extension is required');
  }

  try {
    const headers: Record<string, string> = {
      "x-user-id": params.user.id!,
      "x-user-role": params.user.role,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    
    const response: IResponse<IGetExtensionActions> = await sendRequest({
      url: `${API_ENDPOINT}/ai/extension/${params.extension.key}/get-actions`,
      method: 'GET',
      headers: headers,
    });

    return response.data as IGetExtensionActions;
  } catch (error) {
    console.error('Error getting extension actions: ', error);
    throw error;
  }
}

export const activeExtension = async (params: ExtensionParams): Promise<IActiveExtension> => { 
  if (!params.extension) {
    throw new Error('Extension is required');
  } else if (params.extension.connected) {
    throw new Error('Extension is already connected');
  }

  try {
    const headers: Record<string, string> = {
      "x-user-id": params.user.id!,
      "x-user-role": params.user.role,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    
    const response: IResponse<IActiveExtension> = await sendRequest({
      url: `${API_ENDPOINT}/ai/extension/active`,
      method: 'POST',
      headers: headers,
      queryParams: {
        user_id: params.user.id,
        extension_name: params.extension.key,
      }
    });

    return response?.data as IActiveExtension;
  } catch (error) {
    console.error('Error active extension: ', error);
    throw error;
  }
}