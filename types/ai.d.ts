import { MessageRole } from '@/constants/ai-constant';
import { ThreadType } from '@/constants/extension-constant';

export interface IChatRequest {
  input: string;
  recursionLimit: number;
}

export interface IChatResponse {
  output: string;
  thread_id: string;
}

export interface IMessage {
  id: string;
  role: MessageRole;
  content: string;
  interrupted?: boolean;
  toolcalls?: any[];
}

export interface IMessageWithoutId {
  role: MessageRole;
  content: string;
}

export interface IThread {
  id: string;
  title: string;
  userId: string;
  threadType: string;
  createdAt: string;
}

export interface IThreadsResponse {
  cursor?: string;
  nextCursor?: string;
  prevCursor?: string;
  threads: IThread[];
}

export interface ICreateThreadResponse {
  id: string;
  title: string;
  userId: string;
  threadType: string;
  createdAt: string;
}

export interface IThreadHistoryResponse {
  messages: IMessage[];
}
