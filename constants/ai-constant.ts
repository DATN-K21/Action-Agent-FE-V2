export enum AgentType {
  CHAT = 'chat-agent',
  SEARCH = 'search-agent',
  RAG = 'rag-agent',
}

export enum MessageType {
  AI = 'ai',
  HUMAN = 'human',
  TOOL = 'tool',
  INTERRUPT = 'interrupt',
  ERROR = 'error',
}

export enum ChatStatus {
  SUBMITTED = 'submitted',
  STREAMING = 'streaming',
  READY = 'ready',
  ERROR = 'error',
}

export enum TeamType {
  CHATBOT = 'chatbot',
  SEARCHBOT = 'searchbot',
  RAGBOT = 'ragbot',
  HIERARCHICAL = 'hierarchical',
}

export enum InterruptType {
  TOOL_REVIEW = 'tool_review',
  CONTEXT_INPUT = 'context_input',
}

export enum InterruptDecisionType {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  UPDATE = 'update',
  CONTINUE = 'continue',
}
