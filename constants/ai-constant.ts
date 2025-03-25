export enum AgentName {
  CHAT = 'chat-agent',
  SEARCH = 'search-agent',
  RAG = 'rag-agent',
}

export enum MessageRole {
  AI = 'ai',
  HUMAN = 'human',
}

export enum ChatStatus {
  SUBMITTED = 'submitted',
  STREAMING = 'streaming',
  READY = 'ready',
  ERROR = 'error',
}
