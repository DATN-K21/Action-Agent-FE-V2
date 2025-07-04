import { auth } from '@/auth';
import { Chat } from '@/components/chat';
import { User } from 'next-auth';
import { notFound } from 'next/navigation';

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

  return <Chat id={''} assistantId={''} user={user} initialMessages={[]} />;
}
