import { notFound } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

import { auth } from '@/auth';
import { Chat } from '@/components/chat';

import { getThread, getThreadHistory } from '@/services/thread-service';
import { IMessage, IThreadHistoryResponse } from '@/types/ai';
import { User } from 'next-auth';
import { ExtensionType } from '@/constants/extension-constant';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const session = await auth();

  if (!session?.user) {
    return notFound();
  }

  const user: User = {
    ...session.user,
    accessToken: session.accessToken,
    role: session.user.role,
    refreshToken: session.refreshToken,
    expiresAt: session.expiresAt,
  };

  const thread = await getThread({
    user,
    payload: { threadId: id },
  });

  return {
    title: thread.title || 'Chat',
    description: 'Chat with Action Agent',
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth();

  if (!session?.user) {
    return notFound();
  }

  const user: User = {
    ...session.user,
    accessToken: session.accessToken,
    role: session.user.role,
    refreshToken: session.refreshToken,
    expiresAt: session.expiresAt,
  };

  try {
    const response: IThreadHistoryResponse = await getThreadHistory({
      user,
      payload: { threadId: id },
    });

    const initialMessages: IMessage[] = response.messages?.map((message) => ({
      id: uuidv4(),
      content: message.content,
      role: message.role,
    }));

    return (
      <Chat
        id={id}
        user={user}
        initialMessages={initialMessages}
        extensionName={ExtensionType.DEFAULT}
      />
    );
  } catch {
    return notFound();
  }
}
