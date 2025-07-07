import { IConnectedExtension } from '@/types/extension';
import { IMCP } from '@/types/mcp';
import { AssistantType } from '@/constants/assistant-constants';

export interface ITeamProps {
  id: string;
  workflow_type: string;
}
export interface IAssistant {
  id: string;
  name: string;
  type: AssistantType;
  mcpIds?: string[];
  extensionIds?: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  teams?: ITeamProps[];
}

export interface CreateAssistantRequest {
  name: string;
  // type: AssistantType;
  description?: string;
  mcpIds?: string[];
  exensionIds?: string[];
  supportUnits?: string[];
}

export interface UpdateAssistantRequest {
  name?: string;
  description?: string;
  type?: AssistantType;
  mcpIds?: string[];
  extensionIds?: string[];
}
