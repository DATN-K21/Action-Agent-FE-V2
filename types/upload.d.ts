export type UploadStatus = 'Uploading' | 'Ingesting' | 'Completed' | 'Failed';

export interface IUpload {
  id: string;
  name: string;
  description: string;
  fileType: string;
  webUrl: string | null;
  threadId: string | null;
  lastModified: string;
  status: UploadStatus;
  userId: string | null;
  chunkSize: number;
  chunkOverlap: number;
}

export interface IUploadInitiateResponse {
  uploadId: string;
  uploadUrl: string;
}