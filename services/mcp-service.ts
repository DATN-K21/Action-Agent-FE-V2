import { AI_ENDPOINT, HttpMethod } from '@/constants/response-constant';
import { createUserAuthHeaders, sendRequest } from '@/lib/utils';
import { IMCPServer } from '@/types/mcp';
import { User } from 'next-auth';

// Interface for API responses
interface IResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Interfaces for request params
export interface CreateMCPParams {
  user: User;
  payload: {
    mcpName: string;
    url: string;
    connectionType: 'sse';
  };
}

export interface UpdateMCPParams {
  user: User;
  connectedMcpId: string;
  payload: {
    mcpName: string;
    url: string;
    connectionType: 'sse';
  };
}

export interface GetMCPsParams {
  user: User;
  payload?: {
    pageNumber?: number;
    maxPerPage?: number;
  };
}

export interface DeleteMCPParams {
  user: User;
  connectedMcpId: string;
}

export interface GetMCPDetailParams {
  user: User;
  connectedMcpId: string;
}

export const getMCPs = async (params: GetMCPsParams): Promise<IMCPServer[]> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const queryParams = new URLSearchParams();
    if (params.payload?.pageNumber) {
      queryParams.append('pageNumber', params.payload.pageNumber.toString());
    }
    if (params.payload?.maxPerPage) {
      queryParams.append('maxPerPage', params.payload.maxPerPage.toString());
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response: IResponse<{ connectedMcps: IMCPServer[] }> = await sendRequest({
      url: `${AI_ENDPOINT}/mcp/${params.user.id}/get-all${queryString}`,
      method: HttpMethod.GET,
      headers: headers,
    });

    return response.data.connectedMcps || [];
  } catch (error) {
    console.error('Error getting MCPs: ', error);
    throw error;
  }
};

export const createMCP = async (params: CreateMCPParams): Promise<IMCPServer> => {
  try {
    if (!params.payload.mcpName) throw new Error('MCP name is required');
    if (!params.payload.url) throw new Error('MCP URL is required');
    if (!params.payload.connectionType) throw new Error('Connection type is required');

    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IMCPServer> = await sendRequest({
      url: `${AI_ENDPOINT}/mcp/${params.user.id}/create`,
      method: HttpMethod.POST,
      body: params.payload,
      headers: headers,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating MCP: ', error);
    throw error;
  }
};

export const getMCPDetail = async (params: GetMCPDetailParams): Promise<IMCPServer> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IMCPServer> = await sendRequest({
      url: `${AI_ENDPOINT}/mcp/${params.user.id}/${params.connectedMcpId}/get-detail`,
      method: HttpMethod.GET,
      headers: headers,
    });

    return response.data;
  } catch (error) {
    console.error('Error getting MCP detail: ', error);
    throw error;
  }
};

export const updateMCP = async (params: UpdateMCPParams): Promise<IMCPServer> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IMCPServer> = await sendRequest({
      url: `${AI_ENDPOINT}/mcp/${params.user.id}/${params.connectedMcpId}/update`,
      method: HttpMethod.PATCH,
      body: params.payload,
      headers: headers,
    });

    return response.data;
  } catch (error) {
    console.error('Error updating MCP: ', error);
    throw error;
  }
};

// DELETE MCP
export const deleteMCP = async (params: DeleteMCPParams): Promise<{ deleted: boolean }> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<{ deleted: boolean }> = await sendRequest({
      url: `${AI_ENDPOINT}/mcp/${params.user.id}/${params.connectedMcpId}/delete`,
      method: HttpMethod.DELETE,
      headers: headers,
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting MCP: ', error);
    throw error;
  }
};
