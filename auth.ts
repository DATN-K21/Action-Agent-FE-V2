import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINT } from '@/constants/response-constant';
import { LoginWithGoogle, RefreshToken } from '@/services/auth-service';
import {
  INVALID_LOGIN_ERROR_MESSAGE,
  ACCOUNT_NOT_VERIFIED_ERROR_MESSAGE,
  Providers,
  Role,
} from '@/constants/auth-constant';
import { ErrorCode, HttpStatus } from '@/constants/response-constant';
import { ILoginReponse } from './types/auth';
import { sendRequest } from './lib/utils';

class AccountNotVerifiedError extends CredentialsSignin {
  code = ACCOUNT_NOT_VERIFIED_ERROR_MESSAGE;
}

class InvalidLoginError extends CredentialsSignin {
  code = INVALID_LOGIN_ERROR_MESSAGE;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as { email: string; password: string };

        try {
          const response: IResponse<ILoginReponse> = await sendRequest({
            url: `${API_ENDPOINT}/user/access/login`,
            method: 'POST',
            body: {
              email: email,
              password: password,
            },
          });

          // If the response does not contain the user data, throw an error
          if (!response.data) {
            throw new CredentialsSignin();
          }

          const { user, accessToken, refreshToken } = response.data;
          const decodedToken = jwtDecode<any>(accessToken);
          const role = decodedToken?.role as Role;
          const expiresAt = decodedToken?.exp;

          return {
            id: user.id,
            email: user.email,
            username: user.username,
            image: user.image,
            accessToken,
            refreshToken,
            expiresAt,
            role,
          };
        } catch (error: any) {
          const { status, code } = error;
          if (status === HttpStatus.CONFLICT) {
            if (code === ErrorCode.ACCOUNT_NOT_VERIFIED) {
              throw new AccountNotVerifiedError();
            } else if (
              code === ErrorCode.EMAIL_NOT_FOUND ||
              code === ErrorCode.INCORRECT_PASSWORD
            ) {
              throw new InvalidLoginError();
            }
          }

          throw error;
        }
      },
    }),
    Google,
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === Providers.Google) {
        try {
          if (!account.id_token) {
            throw new CredentialsSignin('Missing id_token');
          }
          const response = await LoginWithGoogle(account.id_token);

          // If the response does not contain the user data, throw an error
          if (!response.data) {
            throw new CredentialsSignin();
          }

          const { accessToken, refreshToken } = response.data;
          const decodedToken = jwtDecode<any>(accessToken);
          const role = decodedToken?.role as Role;
          const expiresAt = decodedToken?.exp;

          // Update the user object with the response from the backend API
          user.id = response.data.user.id;
          user.email = response.data.user.email;
          user.username = response.data.user.username;
          user.image = response.data.user.image;
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          user.expiresAt = expiresAt;
          user.role = role;
        } catch (error) {
          console.error('Failed to call backend API:', error);
          return false; // Return false to indicate sign in failure
        }
      }
      return true; // Return true to indicate sign in success
    },
    async jwt({ token, user }) {
      if (user) {
        // First-time login, save the `accessToken`, its expiry and the `refreshToken`
        token.id = user.id as string;
        token.email = user.email as string;
        token.username = user.username;
        token.image = user.image as string;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = user.expiresAt;
        token.role = user.role;
      } else if (Date.now() < token.expiresAt * 1000) {
        // Subsequent logins, but the `access_token` is still valid
        return token;
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!token.refreshToken) throw new TypeError('Missing refresh_token');

        try {
          const response = await RefreshToken({
            refreshToken: token.refreshToken,
            accessToken: token.accessToken,
            userId: token.id as string,
          });

          if (response.data) {
            const { accessToken, refreshToken } = response.data;
            const decodedToken = jwtDecode<any>(accessToken);
            const expiresAt = decodedToken?.exp;

            token.accessToken = accessToken;
            token.refreshToken = refreshToken;
            token.expiresAt = expiresAt;
          }

          return token;
        } catch (error: any) {
          token.error = 'RefreshTokenError';
          return token;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.username = token.username as string;
      session.user.image = token.image as string;
      session.user.role = token.role as Role;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.expiresAt = token.expiresAt;
      session.error = token.error;
      return session;
    },
  },
});
