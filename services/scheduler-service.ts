import { ISchedulerTaskPayload } from '@/app/(chat)/scheduler-tasks/_components/task-dialog';
import { HttpMethod, SCHEDULER_ENDPOINT } from '@/constants/response-constant';
import { createUserAuthHeaders, sendRequest } from '@/lib/utils';
import { ISchedulerTask } from '@/types/scheduler-task';
import { User } from 'next-auth';

export interface CreateSchedulerTaskParams {
  user: User;
  payload: ISchedulerTaskPayload;
}

export const createTask = async (params: CreateSchedulerTaskParams): Promise<ISchedulerTask> => {
  try {
    if (!params.payload.name) throw new Error("Missing 'name'");
    if (!params.payload.prompt) throw new Error("Missing 'prompt'");
    if (!params.payload.cron_expression) throw new Error("Missing 'cron_expression'");
    if (!params.payload.job_type) throw new Error("Missing 'job_type'");
    if (!params.payload.assistant_id) throw new Error("Missing 'assistant_id'");
    if (!params.payload.team_id) throw new Error("Missing 'team_id'");

    const headers: Record<string, string> = createUserAuthHeaders(params.user);
    const response: IResponse<ISchedulerTask> = await sendRequest({
      url: `${SCHEDULER_ENDPOINT}/job/create`,
      method: HttpMethod.POST,
      body: params.payload,
      headers: headers,
    });

    return response.data as ISchedulerTask;
  } catch (error) {
    console.error('Error create task: ', error);
    throw error;
  }
};
