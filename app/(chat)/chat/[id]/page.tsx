import { notFound } from 'next/navigation';

import { auth } from '@/auth';
import { Chat } from '@/components/chat';

import { generateUUID } from '@/lib/utils';
import { getThreadHistory } from '@/services/thread-service';
import { IMessage, IThreadHistoryResponse } from '@/types/ai';
import { User } from 'next-auth';
import { ExtensionType } from '@/constants/extension-constant';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

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
        id: generateUUID(),
        content: message.content,
        role: message.role,
      };
    });

    return (
      <Chat
        id={id}
        user={user}
        initialMessages={initialMessages}
        extensionName={ExtensionType.DEFAULT}
      />
    );
  } catch (error) {
    notFound();
  }
}
