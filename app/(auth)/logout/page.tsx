import { LogoutForm } from '@/app/(auth)/_components/logout-form';
import { auth } from '@/auth';
import type { Metadata } from 'next';
import { User } from 'next-auth';

export const metadata: Metadata = {
  title: 'Sign Out',
  description: 'Sign out of your account',
};

export default async function LogoutPage() {
  const session = await auth();
  const user = {
    ...session?.user,
    accessToken: session?.accessToken as string,
    refreshToken: session?.refreshToken as string,
    expiresAt: session?.expiresAt as number,
  } as User;

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LogoutForm user={user} />
    </div>
  );
}
