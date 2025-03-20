
import { API_ENDPOINT } from "@/constants/response-constant"
import { sendRequest } from "@/lib/utils";
import { IConnectedApp, IGetAllExtensionResponse, IGetConnectedExtensions } from "@/types/extension";
import { User } from "next-auth"

export interface ExtensionParams {
  user: User;
  extension: IExtension;
  payload: any;
}

export interface IExtension {
  name: string;
}

export const getAllExtensions = async (params: ExtensionParams): Promise<IGetAllExtensionResponse> => {
  try {
    const headers: Record<string, string> = {
      "x-user-id": params.user.id!,
      "x-user-role": params.user.role,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    
    const response: IResponse<IGetAllExtensionResponse> = await sendRequest({
      url: `${API_ENDPOINT}/ai/extension/get-all`,
      method: 'GET',
      headers: headers,
    });

    return response.data as IGetAllExtensionResponse;
  } catch (error) {
    console.error('Error getting extensions: ', error);
    throw error;
  }
}

export const getConnectedExtensions = async (params: ExtensionParams): Promise<IGetConnectedExtensions> => { 
  try {
    const headers: Record<string, string> = {
      "x-user-id": params.user.id!,
      "x-user-role": params.user.role,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    
    const response: IResponse<IGetConnectedExtensions> = await sendRequest({
      url: `${API_ENDPOINT}/ai/connected-app/${params.user.id!}/get-all`,
      method: 'GET',
      headers: headers,
    });

    return response.data as IGetConnectedExtensions;
  } catch (error) {
    console.error('Error getting connected extensions: ', error);
    throw error;
  }
}

export const getDetailExtension = async (params: ExtensionParams): Promise<IConnectedApp> => { 
  try {
    const headers: Record<string, string> = {
      "x-user-id": params.user.id!,
      "x-user-role": params.user.role,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    
    const response: IResponse<IConnectedApp> = await sendRequest({
      url: `${API_ENDPOINT}/ai/connected-app/${params.user.id!}/${params.extension.name}/get-detail`,
      method: 'GET',
      headers: headers,
    });

    return response.data as IConnectedApp;
  } catch (error) {
    console.error('Error getting extension detail: ', error);
    throw error;
  }
}