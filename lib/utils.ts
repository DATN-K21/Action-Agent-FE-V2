import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import queryString from 'query-string';
import { User } from 'next-auth';
import { ThreadType } from '@/constants/extension-constant';
import {
  IconBrandNotion,
  IconBrandSlack,
  IconBrandGmail,
  IconBrandYoutube,
  IconBrandGoogleMaps,
  IconCalendarEvent,
  IconVideoPlus,
  IconProps,
  IconMessages,
  IconServer,
  IconRobotFace,
} from '@tabler/icons-react';

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

const threadIconMap: Record<string, React.FC<IconProps>> = {
  [ThreadType.GMAIL]: IconBrandGmail,
  [ThreadType.GOOGLE_CALENDAR]: IconCalendarEvent,
  [ThreadType.GOOGLE_MAP]: IconBrandGoogleMaps,
  [ThreadType.GOOGLE_MEET]: IconVideoPlus,
  [ThreadType.NOTION]: IconBrandNotion,
  [ThreadType.SLACK]: IconBrandSlack,
  [ThreadType.YOUTUBE]: IconBrandYoutube,
  [ThreadType.MCP]: IconServer,
  [ThreadType.ASSISTANT]: IconRobotFace,
};

export const getThreadIcon = (threadType: string): React.FC<IconProps> => {
  return threadIconMap[threadType] || IconMessages;
};

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
