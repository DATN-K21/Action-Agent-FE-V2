import { AI_ENDPOINT_V1, HttpMethod } from '@/constants/response-constant';
import { createUserAuthHeaders, sendRequest } from '@/lib/utils';
import { IUpload, IUploadInitiateResponse, IUploadStatusResponse } from '@/types/upload';
import { User } from 'next-auth';

export interface UploadServiceParams {
  user: User;
}

export interface InitiateParams extends UploadServiceParams {
  payload: {
    filename: string;
    file_size_bytes: number;
    name: string;
    description: string;
    chunk_size?: number;
    chunk_overlap?: number;
    thread_id?: string | null;
  };
}

export interface ProcessParams extends UploadServiceParams {
  uploadId: string;
}

export const getUploads = async (
  params: UploadServiceParams,
): Promise<IUpload[]> => {
  const headers = createUserAuthHeaders(params.user);
  const response: any = await sendRequest({
    url: `${AI_ENDPOINT_V1}/uploads/`,
    method: HttpMethod.GET,
    headers,
    queryParams: { maxPerPage: 100 },
  });
  return (response.data?.uploads || []) as IUpload[];
};

export const initiateUpload = async (
  params: InitiateParams,
): Promise<IUploadInitiateResponse> => {
  const headers = createUserAuthHeaders(params.user);
  const response: any = await sendRequest({
    url: `${AI_ENDPOINT_V1}/uploads/initiate`,
    method: HttpMethod.POST,
    headers,
    body: params.payload,
  });
  return response.data as IUploadInitiateResponse;
};

export const processUpload = async (
  params: ProcessParams,
): Promise<IUpload> => {
  const headers = createUserAuthHeaders(params.user);
  const response: any = await sendRequest({
    url: `${AI_ENDPOINT_V1}/uploads/${params.uploadId}/process`,
    method: HttpMethod.POST,
    headers,
  });
  return response.data as IUpload;
};

export const reInitiateUpload = async (
  params: ProcessParams,
): Promise<IUploadInitiateResponse> => {
  const headers = createUserAuthHeaders(params.user);
  const response: any = await sendRequest({
    url: `${AI_ENDPOINT_V1}/uploads/${params.uploadId}/re-initiate`,
    method: HttpMethod.POST,
    headers,
  });
  return response.data as IUploadInitiateResponse;
};

export const deleteUpload = async (
  params: ProcessParams,
): Promise<void> => {
  const headers = createUserAuthHeaders(params.user);
  await sendRequest({
    url: `${AI_ENDPOINT_V1}/uploads/${params.uploadId}`,
    method: HttpMethod.DELETE,
    headers,
  });
};

export const getUploadStatus = async (
  params: ProcessParams,
): Promise<IUploadStatusResponse> => {
  const headers = createUserAuthHeaders(params.user);
  const response: any = await sendRequest({
    url: `${AI_ENDPOINT_V1}/uploads/${params.uploadId}/status`,
    method: HttpMethod.GET,
    headers,
  });
  return response.data as IUploadStatusResponse;
}