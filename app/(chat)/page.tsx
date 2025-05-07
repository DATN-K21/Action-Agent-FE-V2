import { auth } from '@/auth';
import { Chat } from '@/components/chat';
import { ExtensionType } from '@/constants/extension-constant';
import { User } from 'next-auth';
import { notFound } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export const metadata = {
  title: 'New Chat',
  description: 'Chat with Action Agent',
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

  return (
    <Chat id={uuidv4()} user={user} initialMessages={[]} extensionName={ExtensionType.DEFAULT} />
  );
}
