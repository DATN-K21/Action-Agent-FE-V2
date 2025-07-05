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
  workers: (IMCP | IConnectedExtension)[];
  description: string;
  teams: ITeamProps[];
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
  workerIds?: string[];
}

export interface IMessageInterruptPayload {
  messages?: string[];
  interrupt: {
    interaction_type: string;
    decision: string;
    tool_message?: string;
  };
}
