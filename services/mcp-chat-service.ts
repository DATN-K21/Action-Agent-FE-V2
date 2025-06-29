import { AI_ENDPOINT_V1, HttpMethod } from '@/constants/response-constant';
import { createUserAuthHeaders, sendRequest } from '@/lib/utils';
import { User } from 'next-auth';

export interface McpChatParams {
  user: User;
  threadId: string;
  payload: {
    input: string;
    mcpId: string;
    recursionLimit?: number;
  };
}

export const chatWithMcp = async (
  params: McpChatParams,
): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
  if (!params.threadId) throw new Error("Missing 'threadId'");
  if (!params.payload.mcpId) throw new Error("Missing 'mcpId'");
  if (!params.payload.input) throw new Error("Missing 'input'");

  let headers: Record<string, string> = createUserAuthHeaders(params.user);
  headers['Content-Type'] = 'application/json';
  headers['Accept'] = 'application/json';

  try {
    // Send the request
    const response = await fetch(
      `${AI_ENDPOINT_V1}/api/v2/mcp-agent/stream/${params.user.id}/${params.threadId}`,
      {
        method: HttpMethod.POST,
        body: JSON.stringify(params.payload),
        headers: headers,
      },
    );

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to chat with MCP: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    // Ensure response body exists
    if (!response.body) {
      throw new Error('Response body is null or undefined');
    }

    // Return the readable stream reader
    return response.body.getReader();
  } catch (error) {
    console.error('Error in MCP chat:', error);
    throw new Error('Error chatting with MCP, please try again!');
  }
};
