import { MessageType } from '@/constants/ai-constant';
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
  name: string;
  type: MessageType;
  content: string;
  imgdata?: string | null;
  tool_calls?: any[];
  tool_output?: any;
  documents?: any;
  next?: any;
  interrupted?: boolean;
}

export interface IMessageWithoutId {
  role: MessageType;
  content: string;
}

export interface IThread {
  id: string;
  title: string;
  assistantId: string;
  createdAt: string;
}

export interface IThreadsResponse {
  cursor: string;
  nextCursor: string;
  prevCursor: string;
  threads: IThread[];
}

export interface ICreateThreadResponse extends IThread {}

export interface IGetThreadResponse extends IThread {}

export interface IUpdateThreadResponse extends IThread {}

export interface IGetThreadHistoryResponse {
  threadId: string;
  assistantId: string;
  messages: IMessage[];
}
