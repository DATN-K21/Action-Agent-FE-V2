import { ISchedulerTaskPayload } from '@/app/(chat)/scheduler-tasks/_components/task-dialog';
import { HttpMethod, SCHEDULER_ENDPOINT } from '@/constants/response-constant';
import { SchedulerTaskStatus, SchedulerTaskTypes } from '@/constants/scheduler-task';
import { createUserAuthHeaders, sendRequest } from '@/lib/utils';
import { ISchedulerTask } from '@/types/scheduler-task';
import { User } from 'next-auth';

export interface CreateSchedulerTaskParams {
  user: User;
  payload: ISchedulerTaskPayload;
}

export interface UpdateSchedulerTaskParams extends CreateSchedulerTaskParams {
  id: string;
}

export interface SchedulerTaskFilterProps {
  skip?: number;
  limit?: number;
  status?: SchedulerTaskStatus;
  job_type?: SchedulerTaskTypes;
  assistant_id?: string;
  team_id?: string;
}

export interface GetAllSchedulerTasksParams {
  user: User;
  payload?: SchedulerTaskFilterProps;
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

export const getAllSchedulerTasks = async (
  params: GetAllSchedulerTasksParams,
): Promise<ISchedulerTask[]> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);
    const response: IResponse<{ jobs: ISchedulerTask[] }> = await sendRequest({
      url: `${SCHEDULER_ENDPOINT}/job/get-jobs`,
      method: HttpMethod.GET,
      headers: headers,
      queryParams: {
        ...params.payload,
      },
    });

    return response.data?.jobs || [];
  } catch (error) {
    console.error('Error getting scheduler tasks: ', error);
    throw error;
  }
};

export const getSchedulerTaskById = async (
  user: User,
  taskId: string,
): Promise<ISchedulerTask | null> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(user);
    const response: IResponse<ISchedulerTask> = await sendRequest({
      url: `${SCHEDULER_ENDPOINT}/job/${taskId}`,
      method: HttpMethod.GET,
      headers: headers,
    });

    return response.data || null;
  } catch (error) {
    console.error('Error getting scheduler task by id: ', error);
    throw error;
  }
};

export const updateSchedulerTask = async (
  params: UpdateSchedulerTaskParams,
): Promise<ISchedulerTask> => {
  try {
    if (!params.id) throw new Error("Missing 'id'");

    const headers: Record<string, string> = createUserAuthHeaders(params.user);
    const response: IResponse<ISchedulerTask> = await sendRequest({
      url: `${SCHEDULER_ENDPOINT}/job/${params.id}/update`,
      method: HttpMethod.PUT,
      body: params.payload,
      headers: headers,
    });

    return response.data as ISchedulerTask;
  } catch (error) {
    console.error('Error updating scheduler task: ', error);
    throw error;
  }
};

export const deleteSchedulerTask = async (user: User, taskId: string): Promise<boolean> => {
  try {
    if (!taskId) throw new Error("Missing 'taskId'");

    const headers: Record<string, string> = createUserAuthHeaders(user);
    const response: IResponse<{ message: string }> = await sendRequest({
      url: `${SCHEDULER_ENDPOINT}/job/${taskId}/remove`,
      method: HttpMethod.DELETE,
      headers: headers,
    });
    console.log('Response from deleteSchedulerTask:', response);
    return response.status === 200;
  } catch (error) {
    console.error('Error deleting scheduler task: ', error);
    return false;
  }
};

export const runSchedulerTask = async (user: User, taskId: string): Promise<boolean> => {
  try {
    if (!taskId) throw new Error("Missing 'taskId'");

    const headers: Record<string, string> = createUserAuthHeaders(user);
    const response: IResponse<any> = await sendRequest({
      url: `${SCHEDULER_ENDPOINT}/job/${taskId}/run`,
      method: HttpMethod.POST,
      headers: headers,
    });

    if (response.status !== 200) {
      throw new Error('Failed to run task');
    }
    return true;
  } catch (error) {
    console.error('Error running scheduler task: ', error);
    return false;
  }
};
