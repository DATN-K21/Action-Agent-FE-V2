export interface IExtension {
  id: string;
  key: string;
  name: string;
  description: string;
  logo: string;
  displayName?: string;
  isCustomApp?: boolean;
  noAuth?: boolean;
  enabled?: boolean;
  docs?: string;
  categories?: string[];
  tags?: string[];
  authSchemes?: string[];
  getCurrentUserEndpoint?: string;
  createdAt?: string;
  updatedAt?: string;
  testConnectors?: any[];
  triggerCount?: number;
  actionsCount?: number;
  // Custom properties
  connected?: boolean;
}

export interface IConnectedExtension {
  id: string;
  userId: string;
  extensionName: string;
  connectedAccountId: string;
  connectionStatus: string;
  authScheme?: string;
  authValue?: string;
  createdAt?: string;
}

export interface IGetConnectedExtensions {
  connectedExtensions: IConnectedExtension[];
}

export interface IActiveExtensionResponse {
  isExisted: boolean;
  redirectUrl: string;
}
