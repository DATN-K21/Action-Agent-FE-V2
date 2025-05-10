export interface IGetAllExtensionResponse {
  extensions: string[];
}

export interface IConnectedExtension {
  id: string;
  userId: string;
  extensionName: string;
  connectedAccountId: string;
  authScheme?: string;
  authValue?: string;
  createdAt?: string;
}

export interface IGetConnectedExtensions {
  connectedExtensions: IConnectedExtension[];
}

export interface IGetExtensionActionsResponse {
  actions: string[];
}

export interface IActiveExtensionResponse {
  isExisted: boolean;
  redirectUrl: string;
}
