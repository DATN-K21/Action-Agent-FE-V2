import { AgentType } from '@/constants/ai-constant';
import { ExtensionType } from '@/constants/extension-constant';
import { API_ENDPOINT, HttpMethod } from '@/constants/response-constant';
import { IChatRequest } from '@/types/ai';
import { User } from 'next-auth';
import { boolean } from 'zod';

export interface StreamAgentParams {
  user: User;
  threadId: string;
  agentName: AgentType;
  payload: IChatRequest;
}

export interface StreamExtensionParams {
  user: User;
  threadId: string;
  extensionName: ExtensionType;
  payload: IChatRequest;
}

export interface InterruptStreamParams {
  user: User;
  threadId: string;
  extensionName: ExtensionType;
  payload: {
    toolCalls: any[];
    execute?: boolean;
  };
}

export const streamAgent = async (
  params: StreamAgentParams,
): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
  if (!params.user.id) throw new Error("Missing 'userId'");
  if (!params.threadId) throw new Error("Missing 'threadId'");
  if (!params.agentName) throw new Error("Missing 'agentName'");

  const headers: Record<string, string> = {
    'x-user-id': params.user.id,
    'x-user-role': params.user.role,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    // Send the request
    const response = await fetch(
      `${API_ENDPOINT}/ai/agent/stream/${params.user.id}/${params.threadId}/${params.agentName}`,
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
        `Failed to stream agent: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    // Ensure response body exists
    if (!response.body) {
      throw new Error('Response body is null or undefined');
    }

    // Return the readable stream reader
    return response.body.getReader();
  } catch (error) {
    console.error('Error in stream agent:', error);
    throw new Error('Error stream agent, please try again!');
  }
};

export const streamExtension = async (
  params: StreamExtensionParams,
): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
  if (!params.user.id) throw new Error("Missing 'userId'");
  if (!params.threadId) throw new Error("Missing 'threadId'");
  if (!params.extensionName) throw new Error("Missing 'extensionName'");

  const headers: Record<string, string> = {
    'x-user-id': params.user.id,
    'x-user-role': params.user.role,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    // Send the request
    const response = await fetch(
      `${API_ENDPOINT}/ai/extension/stream/${params.user.id}/${params.threadId}/${params.extensionName}`,
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
        `Failed to stream extension: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    // Ensure response body exists
    if (!response.body) {
      throw new Error('Response body is null or undefined');
    }

    // Return the readable stream reader
    return response.body.getReader();
  } catch (error) {
    console.error('Error in stream extension:', error);
    throw new Error('Error stream extension, please try again!');
  }
};

export const interruptStream = async (
  params: InterruptStreamParams,
): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
  if (!params.user.id) throw new Error("Missing 'userId'");
  if (!params.threadId) throw new Error("Missing 'threadId'");
  if (!params.extensionName) throw new Error("Missing 'extensionName'");

  const payload = { execute: true, ...params.payload };
  const headers: Record<string, string> = {
    'x-user-id': params.user.id,
    'x-user-role': params.user.role,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    // Send the request
    const response = await fetch(
      `${API_ENDPOINT}/ai/extension/stream-interrupt/${params.user.id}/${params.threadId}/${params.extensionName}`,
      {
        method: HttpMethod.POST,
        body: JSON.stringify(payload),
        headers: headers,
      },
    );

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to interrupt stream: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    // Ensure response body exists
    if (!response.body) {
      throw new Error('Response body is null or undefined');
    }

    // Return the readable stream reader
    return response.body.getReader();
  } catch (error) {
    console.error('Error in interrupt stream:', error);
    throw new Error('Error interrupt stream, please try again!');
  }
};
