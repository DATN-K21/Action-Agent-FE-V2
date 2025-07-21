import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import queryString from 'query-string';
import { User } from 'next-auth';
import { ISchedulerTask, SchedulerTaskTimeDataProps } from '@/types/scheduler-task';
import { SchedulerTaskTimePickerTypes, SchedulerTaskTypes } from '@/constants/scheduler-task';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isDateTime = (value: string) => {
  const parsedDate = new Date(value);
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime()) && isNaN(Number(value));
};

export function getLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  return [];
}

export function createUserAuthHeaders(user: User): Record<string, string> {
  const { accessToken } = user;

  if (!accessToken || accessToken.trim() === '') {
    throw new Error("Missing or invalid 'user.accessToken'");
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export const sendRequest = async <T>(props: IRequest) => {
  let {
    url,
    method,
    body,
    queryParams = {},
    useCredentials = false,
    headers = {},
    nextOption = {},
  } = props;

  // The Authorization header should be provided by the caller using createUserAuthHeaders(user)
  const options: any = {
    method: method,
    headers: new Headers(headers),
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
    ...nextOption,
  };

  if (!(body instanceof FormData)) {
    options.headers.append('content-type', 'application/json');
  }

  if (useCredentials) options.credentials = 'include';

  if (Object.keys(queryParams).length !== 0) {
    url = `${url}?${queryString.stringify(queryParams)}`;
  }

  return fetch(url, options).then((res) => {
    if (res.ok) {
      return res.json() as T;
    } else {
      console.log(`[sendRequest] Not OK. Response=${res.statusText}`);
      return res.json().then(function (json) {
        throw {
          status: json.status || 500,
          message: json?.message ?? 'Unknown error',
          code: json?.code ?? 0,
          data: json?.data ?? null,
          errorStack: json?.errorStack ?? '',
        };
      });
    }
  });
};

export const buildQueryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const displayEnum = (value: string): string => {
  // Remove underscores and capitalize each word
  return value
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const extractCronExpression = (
  task: ISchedulerTask | null,
): {
  type: SchedulerTaskTimePickerTypes;
  time: SchedulerTaskTimeDataProps;
} => {
  if (!task || !task.cronExpression) {
    throw new Error('Invalid task');
  }
  let taskTimePickerType: SchedulerTaskTimePickerTypes = SchedulerTaskTimePickerTypes.DAILY;
  const cronParts = task.cronExpression.split(' ');
  if (cronParts.length < 5) {
    taskTimePickerType = SchedulerTaskTimePickerTypes.DAILY;
  }
  const [minute, hour, dayOfMonth, month, dayOfWeek] = cronParts;
  if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    taskTimePickerType = SchedulerTaskTimePickerTypes.DAILY;
  } else if (dayOfMonth === '*' && month === '*') {
    taskTimePickerType = SchedulerTaskTimePickerTypes.WEEKLY;
  } else if (month === '*' && dayOfWeek === '*') {
    taskTimePickerType = SchedulerTaskTimePickerTypes.MONTHLY;
  } else if (dayOfWeek === '*') {
    taskTimePickerType = SchedulerTaskTimePickerTypes.ANNUALLY;
  }
  if (task?.jobType === SchedulerTaskTypes.ONE_TIME) {
    taskTimePickerType = SchedulerTaskTimePickerTypes.ONE_TIME;
  }

  const result = {
    type: taskTimePickerType,
    time: {
      minute: minute === '*' ? '0' : minute,
      hour: hour === '*' ? '0' : hour,
      dayOfMonth: dayOfMonth === '*' ? '1' : dayOfMonth,
      month: month === '*' ? '1' : month,
      dayOfWeek: dayOfWeek === '*' ? '1' : dayOfWeek,
    },
  };
  return result;
};
