import { IConnectedExtension } from '@/types/extension';
import { IMCP } from '@/types/mcp';
import { AssistantType } from '@/constants/assistant-constants';
import { InterruptType, InterruptDecisionType } from '@/constants/ai-constant';

export interface ITeamProps {
  id: string;
  name: string;
  description: string;
  workflow_type: string;
}
export interface IAssistant {
  id: string;
  name: string;
  assistantType: AssistantType;
  mcpIds?: string[];
  extensionIds?: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  teams?: ITeamProps[];
  interrupt?: boolean;
  askHuman?: boolean;
}

export interface CreateAssistantRequest {
  name: string;
  // type: AssistantType;
  description?: string;
  mcpIds?: string[];
  exensionIds?: string[];
  supportUnits?: string[];
  askHuman?: boolean;
  interrupt?: boolean;
}

export interface UpdateAssistantRequest {
  name?: string;
  description?: string;
  type?: AssistantType;
  mcpIds?: string[];
  extensionIds?: string[];
  askHuman?: boolean;
  interrupt?: boolean;
}

export interface IMessageInterruptPayload {
  messages?: string[];
  interrupt: {
    interaction_type: string;
    decision: string;
    tool_message?: string;
  };
  timezone: string;
}
