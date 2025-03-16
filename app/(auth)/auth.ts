import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';


import { authConfig } from './auth.config';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any): Promise<User | null> {
        // const passwordsMatch = await compare(password, users[0].password!);
        // if (!passwordsMatch) return null;
        // return users[0] as any;
        return {
          id: '1',
          name: 'Test User',
          username: 'testuser',
          role: 'user',
          expiresAt: 123,
          accessToken: 'testAccessToken',
          refreshToken: 'testRefreshToken',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});
