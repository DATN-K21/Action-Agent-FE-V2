export const USER_ENDPOINT = process.env.NEXT_PUBLIC_USER_API__V1_ENDPOINT;
export const AI_ENDPOINT = process.env.NEXT_PUBLIC_AI_API__V1_ENDPOINT;
export const AI_ENDPOINT_V2 = process.env.NEXT_PUBLIC_AI_API__V2_ENDPOINT;

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  CONFLICT = 409,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum ErrorCode {
  ACCOUNT_NOT_VERIFIED = 1010210,
  INCORRECT_EMAIL = 1010205,
  INCORRECT_PASSWORD = 1010206,
}
