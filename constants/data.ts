import {
  IconBrandDiscord,
  IconBrandDocker,
  IconBrandFigma,
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandGmail,
  IconBrandMedium,
  IconBrandNotion,
  IconBrandSkype,
  IconBrandSlack,
  IconBrandStripe,
  IconBrandTelegram,
  IconBrandTrello,
  IconBrandWhatsapp,
  IconBrandZoom,
  IconBrandYoutube,
  IconBrandGoogleMaps,
  IconCalendarEvent,
  IconVideoPlus,
  IconProps,
  Icon,
  IconMailSearch,
} from '@tabler/icons-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export const assistants = [
  {
    id: '227d6e7e-9a37-4acd-a584-f55e1933087a',
    userId: '685b1c1ba4ff7e68cd62242a',
    name: 'General Assistant',
    assistantType: 'general_assistant',
    description: 'General Assistant for general tasks',
    systemPrompt: null,
    provider: 'openai',
    modelName: 'gpt-4o-mini',
    temperature: 0.5,
    askHuman: null,
    interrupt: null,
    mainUnit: 'chatbot',
    supportUnits: ['ragbot', 'searchbot'],
    teams: [
      {
        id: '606c3167-2a43-479a-922b-b7083d6b3f97',
        name: '606c3167-2a43-479a-922b-b7083d6b3f97-main-chatbot-unit',
        description:
          'Main chatbot unit for general assistant, handles conversations and general queries.',
        workflow_type: 'chatbot',
        members: [
          {
            id: '0b0ed6bb-fbd8-426b-a84f-ebc6f166a67c',
            name: '0b0ed6bb-fbd8-426b-a84f-ebc6f166a67c-general-assistant-chatbot',
            type: 'chatbot',
            role: 'Handle general conversations, answer user questions, provide assistance with various tasks, and coordinate with support units when needed. Use search and knowledge tools when appropriate.',
          },
        ],
      },
      {
        id: 'e504d2cb-d5f7-43d4-a9f2-464765a68c2b',
        name: 'e504d2cb-d5f7-43d4-a9f2-464765a68c2b-ragbot-support-unit',
        description: 'Support unit for WorkflowType.RAGBOT in general assistant.',
        workflow_type: 'ragbot',
        members: [
          {
            id: '724429db-475c-4990-a80d-3acfe2a7448a',
            name: '724429db-475c-4990-a80d-3acfe2a7448a-ragbot-assistant',
            type: 'ragbot',
            role: 'Search through uploaded documents and knowledge bases to find relevant information for user queries.',
          },
        ],
      },
      {
        id: '2432b073-c97f-4080-b81d-31fabfdabe89',
        name: '2432b073-c97f-4080-b81d-31fabfdabe89-searchbot-support-unit',
        description: 'Support unit for WorkflowType.SEARCHBOT in general assistant.',
        workflow_type: 'searchbot',
        members: [
          {
            id: '76f3696b-61ff-4e12-8d2a-4868ede4fb9f',
            name: '76f3696b-61ff-4e12-8d2a-4868ede4fb9f-searchbot-assistant',
            type: 'searchbot',
            role: 'Search the internet and external sources to find relevant and up-to-date information for user queries.',
          },
        ],
      },
    ],
    createdAt: '2025-06-24T21:43:55.949504',
  },
];

export const selectedAssistant = assistants[0];

export interface ExtensionResponse {
  extensions: string[];
}

export const appText = new Map<string, string>([
  ['all', 'All Apps'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
]);

export interface IExtensionAction {
  id: string;
  enum: string;
  logo: string;
  name: string;
  description: string;
  displayName?: string;
  noAuth?: boolean;
  deprecated?: boolean;
  appKey?: string;
  availableVersions?: string[];
  parameters?: {
    properties?: Record<string, any>;
    required?: string[];
    title?: string;
    type?: string;
  };
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  version?: string;
  __v?: number;
}

export const INVALID_LOGIN_ERROR_MESSAGE = 'Email or password is invalid';
export const ACCOUNT_NOT_VERIFIED_ERROR_MESSAGE = 'Account has not been verified';

export enum Providers {
  Credentials = 'credentials',
  Google = 'google',
  Facebook = 'facebook',
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  CONFLICT = 409,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorCode {
  ACCOUNT_NOT_VERIFIED = 1010210,
  EMAIL_NOT_FOUND = 1010205,
  INCORRECT_PASSWORD = 1010206,
}

export enum Role {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  USER = 'User',
}
