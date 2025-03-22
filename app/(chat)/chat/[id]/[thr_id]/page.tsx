import React from 'react';
import { auth } from '@/auth';
import { notFound } from 'next/navigation';
import { User } from 'next-auth';
import { IMessage, IThreadHistoryResponse } from '@/types/ai';
import { getThreadHistory } from '@/services/thread-service';
import { generateUUID } from '@/lib/utils';
import { Chat } from '@/components/chat';

async function ExtensionChatPage(props: { params: Promise<{ id: string, thr_id: string }> }) {
  const params = await props.params;
  const { id: extension_name, thr_id: thread_id } = params;
  let user: User | null = null;
  let initialMessages: IMessage[] | [] = [];

  const fetchUser = async () => {
    const session = await auth();
    if (!session || !session.user) {
      return notFound();
    }
    user = {
      ...session.user,
      accessToken: session.accessToken,
      role: session.user.role,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt,
    } as User;

    await fetchMessages(user);
  }

  const fetchMessages = async (user: User) => {
    if (!user) {
      console.log("User not found to fetch messages");
      return notFound();
    }

    console.log("User: ")
    console.log(user);
    const response: IThreadHistoryResponse = await getThreadHistory({
      user,
      payload: {
        threadId: thread_id,
      }
    });
    if (!response) {
      notFound();
    }
    initialMessages = response.messages?.map(message => {
      return {
        id: generateUUID(),
        content: message.content,
        role: message.role,
      }
    }) || [];
  }

  await fetchUser();
  return (
    <Chat
      id={thread_id}
      user={user!}
      initialMessages={initialMessages}
    />
  );
}

export default ExtensionChatPage;