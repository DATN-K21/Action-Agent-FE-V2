import { MessageType } from '@/constants/ai-constant';
import { AI_ENDPOINT_V1, HttpMethod } from '@/constants/response-constant';
import { createUserAuthHeaders } from '@/lib/utils';
import { User } from 'next-auth';

export interface StreamTeamParams {
  user: User;
  threadId: string;
  teamId: string;
  payload: {
    messages: [
      {
        type: MessageType.HUMAN;
        content: string;
      },
    ];
  };
}

export const streamTeam = async (
  params: StreamTeamParams,
): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
  if (!params.threadId) throw new Error("Missing 'threadId'");
  if (!params.teamId) throw new Error("Missing 'teamId'");
  if (!params.payload.messages[0].content) throw new Error("Missing 'message'");

  let headers: Record<string, string> = createUserAuthHeaders(params.user);
  headers['Content-Type'] = 'application/json';
  headers['Accept'] = 'application/json';

  try {
    // Send the request
    const response = await fetch(
      `${AI_ENDPOINT_V1}/team/${params.teamId}/stream/${params.threadId}`,
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
        `Failed to stream team: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    // Ensure response body exists
    if (!response.body) {
      throw new Error('Response body is null or undefined');
    }

    // Return the readable stream reader
    return response.body.getReader();
  } catch (error) {
    console.error('Error in stream team:', error);
    throw new Error('Error stream team, please try again!');
  }
};
