export interface IStreamEmitData {
  user_id: string;
  thread_id: string;
  extension_name: string;
  input: string;
}

export interface IStreamOnData {
  user_id: string;
  thread_id: string;
  extension_name: string;
  interrupted: boolean;
  output: any;
  streaming?: boolean;
}

export interface IToolCall {
  name: string;
  args: object;
  id?: string;
  type?: string;
}

export interface IStreamEmitInterrupt {
  user_id: string;
  thread_id: string;
  extension_name: string;
  execute: boolean;
  tool_call?: IToolCall[];
}

export interface IStreamOnInterrupt {
  user_id: string;
  thread_id: string;
  extension_name: string;
  interrupt: boolean;
  output: string;
}