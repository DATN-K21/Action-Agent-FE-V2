import { Role } from "@/constants/auth-constant";

export interface ILoginReponse {
    user: {
        id: string;
        email: string;
        username: string;
        image: string;
    };
    accessToken: string;
    refreshToken: string;
}

export interface IHeader {
    Authorization?: string;
    'x-user-id': string;
    'x-user-role': String;
}


