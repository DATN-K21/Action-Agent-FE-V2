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
