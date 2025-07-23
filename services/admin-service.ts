import { User } from 'next-auth';
import { AI_ENDPOINT_V1, HttpMethod } from '@/constants/response-constant';
import { createUserAuthHeaders, sendRequest } from '@/lib/utils';

export interface GetStatisticOverviewParams {
  user: User;
  period?: string; // Optional period for filtering statistics
}

export interface GetStatisticRankingUserParams extends GetStatisticOverviewParams {}

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
export interface IRankingConnectedExtension {
  id: string;
  score: number;
  rank: number;
  displayInfo: {
    extension_name: string;
    total_connections: string;
    skill_count: string;
    success_rate: string;
  };
}

export interface IRankingResponse {
  users: {
    data: IRankingUser[];
    weight: {
      uploads: number;
      threads: number;
      assistants: number;
    };
  };
  connectedExtensions: {
    data: IRankingConnectedExtension[];
    weight: {
      skills: number;
      success_rate: number;
      user_adoption: number;
    };
  };
}

export const getStatisticOverview = async (params: GetStatisticOverviewParams) => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);
    const response = (await sendRequest({
      url: `${AI_ENDPOINT_V1}/statistics/overview`,
      method: HttpMethod.GET,
      headers: headers,
      queryParams: {
        period: params.period === 'all' ? undefined : params.period,
      },
    })) as { data: any };

    return response.data;
  } catch (error) {
    console.error('Error getting assistants: ', error);
    throw error;
  }
};

export const getStatisticsRanking = async (
  params: GetStatisticOverviewParams,
): Promise<{
  users: IRankingUser[];
  connectedExtensions: IRankingConnectedExtension[];
}> => {
  try {
    const headers: Record<string, string> = createUserAuthHeaders(params.user);
    const response: IResponse<IRankingResponse> = await sendRequest({
      url: `${AI_ENDPOINT_V1}/statistics/ranking`,
      method: HttpMethod.GET,
      headers,
      queryParams: {
        period: params.period === 'all' ? undefined : params.period,
      },
    });
    const result = {
      users: response.data?.users.data || [],
      connectedExtensions: response.data?.connectedExtensions.data || [],
    };

    return result;
  } catch (error) {
    console.error('Error getting ranking users: ', error);
    return {
      users: [],
      connectedExtensions: [],
    };
  }
};
