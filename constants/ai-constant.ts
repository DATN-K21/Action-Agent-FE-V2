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
