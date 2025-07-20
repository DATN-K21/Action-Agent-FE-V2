import { ISchedulerTaskPayload } from '@/app/(chat)/scheduler-tasks/_components/task-dialog';
import { HttpMethod, SCHEDULER_ENDPOINT } from '@/constants/response-constant';
import { createUserAuthHeaders, sendRequest } from '@/lib/utils';
import { ICreateThreadResponse } from '@/types/ai';
import { User } from 'next-auth';

export interface CreateSchedulerTaskParams {
  user: User;
  payload: ISchedulerTaskPayload;
}

export const createTask = async (
  params: CreateSchedulerTaskParams,
): Promise<ICreateThreadResponse> => {
  try {
    if (!params.payload.name) throw new Error("Missing 'name'");
    if (!params.payload.prompt) throw new Error("Missing 'prompt'");

    const headers: Record<string, string> = createUserAuthHeaders(params.user);
    const response: IResponse<ICreateThreadResponse> = await sendRequest({
      url: `${SCHEDULER_ENDPOINT}/job/create`,
      method: HttpMethod.POST,
      body: params.payload,
      headers: headers,
    });

    return response.data as ICreateThreadResponse;
  } catch (error) {
    console.error('Error create task: ', error);
    throw error;
  }
};
