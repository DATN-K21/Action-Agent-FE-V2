export const INVALID_LOGIN_ERROR_MESSAGE = 'Email or password is incorrect'
export const ACCOUNT_NOT_VERIFIED_ERROR_MESSAGE =
  'Account is not verified, please check your email for verification'

export enum Providers {
  Credentials = 'credentials',
  Google = 'google',
  Facebook = 'facebook',
}

export enum Role {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  USER = 'User',
}
