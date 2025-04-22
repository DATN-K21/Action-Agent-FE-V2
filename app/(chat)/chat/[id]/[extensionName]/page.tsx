import { notFound } from 'next/navigation';

import { auth } from '@/auth';
import { Chat } from '@/components/chat';

import { v4 as uuidv4 } from 'uuid';
import { User } from 'next-auth';
import { getThreadHistory } from '@/services/thread-service';
import { IMessage, IThreadHistoryResponse } from '@/types/ai';

export default async function Page(props: {
  params: Promise<{ id: string; extensionName: string }>;
}) {
  const params = await props.params;
  const { id, extensionName } = params;

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

  try {
    const reponse: IThreadHistoryResponse = await getThreadHistory({
      user,
      payload: {
        threadId: id,
      },
    });
    const initialMessages: IMessage[] = reponse.messages?.map((message) => {
      return {
        id: uuidv4(),
        content: message.content,
        role: message.role,
      };
    });

    return (
      <Chat id={id} user={user} initialMessages={initialMessages} extensionName={extensionName} />
    );
  } catch (error) {
    notFound();
  }
}
