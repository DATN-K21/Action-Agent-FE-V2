import { Role } from '@/constants/data';
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      image: string;
      role: Role;
    };
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    error?: 'RefreshTokenError';
  }

  interface User {
    id: string;
    email: string;
    username: string;
    image: string;
    role: Role;
    expiresAt: number;
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    username: string;
    image: string;
    role: Role;
    accessToken: string;
    expiresAt: number;
    refreshToken?: string;
    error?: 'RefreshTokenError';
  }
}
