import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import queryString from 'query-string';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      'An error occurred while fetching the data.',
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  return [];
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const sendRequest = async <T>(props: IRequest) => {
  let {
    url,
    method,
    body,
    queryParams = {},
    useCredentials = false,
    headers = {},
    nextOption = {}
  } = props;

  const options: any = {
    method: method,
    // by default setting the content-type to be json type
    headers: new Headers({ 'content-type': 'application/json', ...headers }),
    body: body ? JSON.stringify(body) : null,
    ...nextOption
  };
  if (useCredentials) options.credentials = "include";

  if (Object.keys(queryParams).length !== 0) {
    console.log("check");
    url = `${url}?${queryString.stringify(queryParams)}`;
  }

  return fetch(url, options).then(res => {
    if (res.ok) {
      return res.json() as T;
    } else {
      return res.json().then(function (json) {
        throw {
          status: json.status || 500,
          message: json?.message ?? "Unknown error",
          code: json?.code ?? 0,
          data: json?.data ?? null,
          errorStack: json?.errorStack ?? ""
        };
      });
    }
  });
};