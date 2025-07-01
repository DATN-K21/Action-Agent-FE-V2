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
  {
    id: 'c6a5b0e8-f922-4911-8734-01671b455800',
    userId: '685b1c1ba4ff7e68cd62242a',
    name: 'My Assistant 2',
    assistantType: 'advanced_assistant',
    description: 'My Assistant 2',
    systemPrompt: null,
    provider: 'https://api.openai.com/v1',
    modelName: 'gpt-4o-mini',
    temperature: 0.5,
    askHuman: true,
    interrupt: true,
    mainUnit: 'chatbot',
    supportUnits: [],
    mcpIds: null,
    extensionIds: null,
    teams: [
      {
        id: '34d5e06f-3ffe-40dd-934d-e40099aec5f4',
        name: '34d5e06f-3ffe-40dd-934d-e40099aec5f4-chatbot-unit',
        description: 'Main chatbot unit for handling small talk and basic user interactions.',
        workflow_type: 'chatbot',
        members: [
          {
            id: '72343c80-31be-465e-9492-2f660d95e01f',
            name: '72343c80-31be-465e-9492-2f660d95e01f-chatbot-unit-root',
            type: 'chatbot',
            role: "Respond naturally to greetings and small talk. Answer user questions directly using available search and knowledge tools when needed. Provide helpful information and maintain a friendly conversational tone. Do not ask users what they want - simply respond to what they've said.",
          },
        ],
      },
    ],
    createdAt: '2025-06-29T08:45:32.145412',
  },
  {
    id: '4715551f-fdf1-41b4-88f7-564df1dbd1d1',
    userId: '685b1c1ba4ff7e68cd62242a',
    name: 'My assistant 2',
    assistantType: 'advanced_assistant',
    description: 'My assistant 2',
    systemPrompt: null,
    provider: 'https://api.openai.com/v1',
    modelName: 'gpt-4o-mini',
    temperature: 0.5,
    askHuman: true,
    interrupt: true,
    mainUnit: 'chatbot',
    supportUnits: ['hierarchical'],
    mcpIds: ['1360d2fa-79e4-4054-9e63-0a8bda4514f5'],
    extensionIds: [],
    teams: [
      {
        id: '57422955-ec06-4485-8137-f9d8eb968dab',
        name: '57422955-ec06-4485-8137-f9d8eb968dab-chatbot-unit',
        description: 'Main chatbot unit for handling small talk and basic user interactions.',
        workflow_type: 'chatbot',
        members: [
          {
            id: '3e252c02-6c24-4ea6-8e81-bf2e56547f8f',
            name: '3e252c02-6c24-4ea6-8e81-bf2e56547f8f-chatbot-unit-root',
            type: 'chatbot',
            role: "Respond naturally to greetings and small talk. Answer user questions directly using available search and knowledge tools when needed. Provide helpful information and maintain a friendly conversational tone. Do not ask users what they want - simply respond to what they've said.",
          },
        ],
      },
      {
        id: 'b0f67fc6-7fc1-443f-8bfe-e9544efa3296',
        name: 'b0f67fc6-7fc1-443f-8bfe-e9544efa3296-hierarchical-unit',
        description: "Execute user tasks based on integrated workers' tools.",
        workflow_type: 'hierarchical',
        members: [
          {
            id: '9b0de9b0-3a83-4e79-af2e-2cf64b7bd8b1',
            name: '9b0de9b0-3a83-4e79-af2e-2cf64b7bd8b1-leader',
            type: 'root',
            role: 'Gather inputs, outputs from your team and answer the question.',
          },
          {
            id: '0a38ef24-c9be-4011-b02d-17202809ca9b',
            name: '0a38ef24-c9be-4011-b02d-17202809ca9b-gmail',
            type: 'worker',
            role: 'Execute actions based on provided tasks using binding tools and return the results',
          },
        ],
      },
    ],
    createdAt: '2025-06-29T08:46:32.983234',
  },
  {
    id: '533fb606-e9cc-4fc8-a509-d9d5c6939c63',
    userId: '685b1c1ba4ff7e68cd62242a',
    name: 'Assistant 3',
    assistantType: 'advanced_assistant',
    description: 'Gmail assistant',
    systemPrompt: null,
    provider: 'https://api.openai.com/v1',
    modelName: 'gpt-4o-mini',
    temperature: 0.5,
    askHuman: true,
    interrupt: true,
    mainUnit: 'chatbot',
    supportUnits: ['hierarchical', 'searchbot', 'ragbot'],
    mcpIds: ['1360d2fa-79e4-4054-9e63-0a8bda4514f5'],
    extensionIds: [],
    teams: [
      {
        id: '60c013d3-71b2-4002-86cd-a710d074ca27',
        name: '60c013d3-71b2-4002-86cd-a710d074ca27-chatbot-unit',
        description: 'Main chatbot unit for handling small talk and basic user interactions.',
        workflow_type: 'chatbot',
        members: [
          {
            id: '2d1e50a9-18bd-49ee-be22-3c576e161ba3',
            name: '2d1e50a9-18bd-49ee-be22-3c576e161ba3-chatbot-unit-root',
            type: 'chatbot',
            role: "Respond naturally to greetings and small talk. Answer user questions directly using available search and knowledge tools when needed. Provide helpful information and maintain a friendly conversational tone. Do not ask users what they want - simply respond to what they've said.",
          },
        ],
      },
      {
        id: '48346a3a-b913-4d6f-8ff4-05efd96cf298',
        name: '48346a3a-b913-4d6f-8ff4-05efd96cf298-hierarchical-unit',
        description: "Execute user tasks based on integrated workers' tools.",
        workflow_type: 'hierarchical',
        members: [
          {
            id: 'f7a70ec5-003a-4456-937d-eb04889e0ed9',
            name: 'f7a70ec5-003a-4456-937d-eb04889e0ed9-leader',
            type: 'root',
            role: 'Gather inputs, outputs from your team and answer the question.',
          },
          {
            id: '890f5f97-e7a4-4adb-a19d-0431495bad1a',
            name: '890f5f97-e7a4-4adb-a19d-0431495bad1a-gmail',
            type: 'worker',
            role: 'Execute actions based on provided tasks using binding tools and return the results',
          },
        ],
      },
      {
        id: 'd2c0b1ed-8853-4b4a-9836-f25cd8872e06',
        name: 'd2c0b1ed-8853-4b4a-9836-f25cd8872e06-searchbot-support-unit',
        description: 'Support unit for searchbot in advanced assistant.',
        workflow_type: 'searchbot',
        members: [
          {
            id: 'f8386a3b-1370-4d34-a47a-fe76074ff4d6',
            name: 'f8386a3b-1370-4d34-a47a-fe76074ff4d6-searchbot-support-root',
            type: 'searchbot',
            role: "Answer the user's question.",
          },
        ],
      },
      {
        id: '4110dc36-4436-4515-9b9d-a8231e3c3939',
        name: '4110dc36-4436-4515-9b9d-a8231e3c3939-ragbot-support-unit',
        description: 'Support unit for ragbot in advanced assistant.',
        workflow_type: 'ragbot',
        members: [
          {
            id: 'b0ce20d5-1f25-45b8-a3a4-12d1227e2f6b',
            name: 'b0ce20d5-1f25-45b8-a3a4-12d1227e2f6b-ragbot-support-root',
            type: 'ragbot',
            role: "Answer the user's question.",
          },
        ],
      },
    ],
    createdAt: '2025-06-29T08:52:51.419345',
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
