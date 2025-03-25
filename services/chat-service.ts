import { AgentName } from '@/constants/ai-constant'
import { API_ENDPOINT } from '@/constants/response-constant'
import { IChatRequest } from '@/types/ai'
import { User } from 'next-auth'

export interface ChatParams {
  user: User
  threadId: string
  agentName: AgentName
  payload: IChatRequest
}

export const sendMessage = async (
  params: ChatParams,
): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
  if (!params.user.id) throw new Error("Missing 'userId'")
  if (!params.threadId) throw new Error("Missing 'threadId'")
  if (!params.agentName) throw new Error("Missing 'agentName'")

  const headers: Record<string, string> = {
    'x-user-id': params.user.id,
    'x-user-role': params.user.role,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  try {
    // Send the request
    const response = await fetch(
      `${API_ENDPOINT}/ai/agent/stream/${params.user.id}/${params.threadId}/${params.agentName}`,
      {
        method: 'POST',
        body: JSON.stringify(params.payload),
        headers: headers,
      },
    )

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Failed to send message: ${response.status} ${response.statusText} - ${errorText}`,
      )
    }

    // Ensure response body exists
    if (!response.body) {
      throw new Error('Response body is null or undefined')
    }

    // Return the readable stream reader
    return response.body.getReader()
  } catch (error) {
    console.error('Error in sendMessage:', error)
    throw new Error('Error sending message, please try again!')
  }
}
