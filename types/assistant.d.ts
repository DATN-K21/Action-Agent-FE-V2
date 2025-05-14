import { IConnectedExtension } from '@/types/extension';
import { IMCP } from '@/types/mcp';
import { AssistantType } from '@/constants/assistant-constants';

export interface IAssistant {
  id: string;
  name: string;
  type: AssistantType;
  workers: (IMCP | IConnectedExtension)[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAssistantRequest {
  name: string;
  type: AssistantType;
  workerIds: string[];
  description?: string;
}

export interface UpdateAssistantRequest {
  name?: string;
  description?: string;
  type?: AssistantType;
  workerIds?: string[];
}
