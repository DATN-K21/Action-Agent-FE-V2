import { auth } from '@/auth';
import ExtensionList from './_components/extension-list';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { User } from 'next-auth';

export const metadata: Metadata = {
  title: 'Tools - Botion',
  description: 'Tools Page',
}

export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    return notFound();
  }

  const user: User = {
    ...session.user,
    accessToken: session.accessToken,
    role: session.user.role,
    refreshToken: session.refreshToken,
    expiresAt: session.expiresAt,
  };

  return <ExtensionList user={user} />;
}
