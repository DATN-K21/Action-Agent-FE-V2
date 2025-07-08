import { User } from 'next-auth';
import { AI_ENDPOINT_V1, HttpMethod } from '@/constants/response-constant';
import { createUserAuthHeaders, sendRequest } from '@/lib/utils';

export interface GetStatisticOverviewParams {
  user: User;
}

export interface GetStatisticRankingUserParams {
  user: User;
}

export interface IRankingUser {
  id: string;
  score: number;
  rank: number;
  displayInfo: {
    username: string;
    email: string;
    upload_count: string;
    thread_count: string;
    assistant_count: string;
  };
}

export const getStatisticOverview = async (params: GetStatisticOverviewParams) => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response = (await sendRequest({
      url: `${AI_ENDPOINT_V1}/statistics/overview`,
      method: HttpMethod.GET,
      headers: headers,
    })) as { data: any };

    return response.data;
  } catch (error) {
    console.error('Error getting assistants: ', error);
    throw error;
  }
};

export const getRankingUser = async (
  params: GetStatisticOverviewParams,
): Promise<IRankingUser[]> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);

    const response: IResponse<{
      users: { data: IRankingUser[] } | null;
    }> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/statistics/ranking`,
      method: HttpMethod.GET,
      headers,
    });

    const users = response.data?.users;

    if (!users || !Array.isArray(users.data)) {
      console.warn('No user data found in response');
      return []; // fallback safe
    }

    return users.data;
  } catch (error) {
    console.error('Error getting ranking users: ', error);
    return []; // hoặc throw error nếu muốn fail nhanh
  }
};
