import { AI_ENDPOINT_V1, HttpMethod } from '@/constants/response-constant';
import { createUserAuthHeaders, sendRequest } from '@/lib/utils';
import { IMCP } from '@/types/mcp';
import { User } from 'next-auth';

export interface CreateMCPParams {
  user: User;
  payload: {
    mcpName: string;
    url: string;
    description?: string; // Optional field for description
    transport?: string; // Transport type, e.g., 'streamable_http', 'sse'
  };
}

export interface UpdateMCPParams {
  user: User;
  connectedMcpId: string;
  payload: {
    mcpName: string;
    url: string;
    transport: 'sse';
    description?: string; // Optional field for description
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

export const getConnectedMCPs = async (params: GetMCPsParams): Promise<IMCP[]> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<{ connectedMcps: IMCP[] }> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/mcp/get-all`,
      method: HttpMethod.GET,
      headers: headers,
      queryParams: {
        pageNumber: params.payload?.pageNumber,
        maxPerPage: params.payload?.maxPerPage,
      },
    });

    return response.data?.connectedMcps || [];
  } catch (error) {
    console.error('Error getting MCPs: ', error);
    throw error;
  }
};

export const createMCP = async (params: CreateMCPParams): Promise<IMCP> => {
  try {
    if (!params.payload.mcpName) throw new Error('MCP name is required');
    if (!params.payload.url) throw new Error('MCP URL is required');
    if (!params.payload.transport) throw new Error('Connection type is required');

    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IMCP> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/mcp/create`,
      method: HttpMethod.POST,
      body: params.payload,
      headers: headers,
    });

    return response.data as IMCP;
  } catch (error) {
    console.error('Error creating MCP: ', error);
    throw error;
  }
};

export const getMCPDetail = async (params: GetMCPDetailParams): Promise<IMCP> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IMCP> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/mcp/${params.connectedMcpId}/get-detail`,
      method: HttpMethod.GET,
      headers: headers,
    });

    return response.data as IMCP;
  } catch (error) {
    console.error('Error getting MCP detail: ', error);
    throw error;
  }
};

export const updateMCP = async (params: UpdateMCPParams): Promise<IMCP> => {
  if (!params.payload.mcpName) throw new Error('MCP name is required');
  if (!params.payload.url) throw new Error('MCP URL is required');
  if (!params.payload.transport) throw new Error('Connection type is required');
  if (!params.connectedMcpId) throw new Error('Connected MCP ID is required');

  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<IMCP> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/mcp/${params.connectedMcpId}/update`,
      method: HttpMethod.PATCH,
      body: params.payload,
      headers: headers,
    });

    return response.data as IMCP;
  } catch (error) {
    console.error('Error updating MCP: ', error);
    throw error;
  }
};

export const deleteMCP = async (params: DeleteMCPParams): Promise<void> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    await sendRequest({
      url: `${AI_ENDPOINT_V1}/mcp/${params.connectedMcpId}/delete`,
      method: HttpMethod.DELETE,
      headers: headers,
    });
  } catch (error) {
    console.error('Error deleting MCP: ', error);
    throw error;
  }
};
