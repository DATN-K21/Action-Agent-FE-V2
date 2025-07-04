import { notFound } from 'next/navigation';

import { auth } from '@/auth';
import { Chat } from '@/components/chat';

import { getThread, getThreadHistory } from '@/services/thread-service';
import { IMessage, IGetThreadHistoryResponse } from '@/types/ai';
import { User } from 'next-auth';
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

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
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
    const response: IGetThreadHistoryResponse = await getThreadHistory({
      user,
      payload: { threadId: id },
    });

    const thread = await getThread({
      user,
      payload: { threadId: id },
    });

    const initialMessages: IMessage[] = response?.messages?.map((message) => ({
      id: message.id,
      name: message.name,
      type: message.type,
      content: message.content,
      imgdata: message.imgdata,
      tool_calls: message.tool_calls,
      tool_output: message.tool_output,
      documents: message.documents,
      next: message.next,
    }));

    return (
      <Chat
        id={id}
        assistantId={thread.assistantId}
        user={user}
        initialMessages={initialMessages || []}
      />
    );
  } catch {
    return notFound();
  }
}
