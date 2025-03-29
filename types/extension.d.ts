export interface IGetAllExtensionResponse {
  extensions: string[]
}

export interface IConnectedApp {
  id: string
  userId: string
  appName: string
  connectedAccountId: string
  authScheme?: string
  authValue?: string
  createdAt?: string
}

export interface IGetConnectedExtensions {
  connectedApps: IConnectedApp[]
}

export interface IGetExtensionActions {
  actions: string[];
}

export interface IActiveExtension {
  isExisted: boolean;
  redirectUrl: string;
}