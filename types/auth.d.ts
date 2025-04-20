import { Role } from '@/constants/auth-constant';

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

export interface IRegisterReponse {
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
  };
}
