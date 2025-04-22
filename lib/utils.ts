import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import queryString from 'query-string';
import { User } from 'next-auth';

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

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function createUserAuthHeaders(user: User): Record<string, string> {
  const { id, role, email } = user;

  if (!id || id.trim() === '') {
    throw new Error("Missing or invalid 'user.id'");
  }

  if (!role || role.trim() === '') {
    throw new Error("Missing or invalid 'user.role'");
  }

  if (!email || email.trim() === '') {
    throw new Error("Missing or invalid 'user.email'");
  }

  return {
    'x-user-id': id,
    'x-user-role': role,
    'x-user-email': email,
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

  const options: any = {
    method: method,
    // by default setting the content-type to be json type
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
