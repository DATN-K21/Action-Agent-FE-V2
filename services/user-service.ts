import { HttpMethod, USER_ENDPOINT, AI_ENDPOINT_V1 } from '@/constants/response-constant';
import { createUserAuthHeaders, sendRequest } from '@/lib/utils';
import { User } from 'next-auth';

export interface IUserProfile {
  id: string;
  email: string;
  username: string;
  avatar: string;
  fullname: string;
}

export interface IUserCredits {
  credits: number;
}

/**
 * Fetch user profile by userId.
 * If avatar is null/undefined/empty, returns gravatar identicon.
 */
export const getUserProfile = async (user: User): Promise<IUserProfile> => {
  const headers = createUserAuthHeaders(user);
  const response = await sendRequest<{ data: Partial<IUserProfile> }>({
    url: `${USER_ENDPOINT}/user/${user.id}`,
    method: HttpMethod.GET,
    headers,
  });
  const profile = response.data || {};
  let avatar = profile.avatar;
  if (!avatar) {
    avatar = 'http://www.gravatar.com/avatar/?d=identicon';
  }
  return {
    id: profile.id ?? user.id ?? '',
    email: profile.email || '',
    username: profile.username || '',
    avatar,
    fullname: profile.fullname || '',
  };
};

/**
 * Fetch user balance (credits) by userId.
 */
export const getUserCredits = async (user: User): Promise<number> => {
  const headers = createUserAuthHeaders(user);
  const response = await sendRequest<{ data: IUserCredits }>({
    url: `${AI_ENDPOINT_V1}/user/${user.id}/credits`,
    method: HttpMethod.GET,
    headers,
  });
  return response.data?.credits ?? 0;
};