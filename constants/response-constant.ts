export const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
export const AI_ENDPOINT = process.env.NEXT_PUBLIC_AI_ENDPOINT;

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
    DELETE = 'DELETE',
}

export enum ErrorCode {
    ACCOUNT_NOT_VERIFIED = 1010210,
    EMAIL_NOT_FOUND = 1010205,
    INCORRECT_PASSWORD = 1010206,
}