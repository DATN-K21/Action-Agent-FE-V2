import { auth } from '@/auth';
import type { Metadata } from 'next';
import { User } from 'next-auth';
import { notFound } from 'next/navigation';
import UploadList from './_components/upload-list';

export const metadata: Metadata = {
  title: 'Knowledge Base',
  description: 'Manage your uploaded files',
};

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

  return <UploadList user={user} />;
}