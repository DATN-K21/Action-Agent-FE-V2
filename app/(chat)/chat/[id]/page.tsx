import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { auth } from '@/auth';
import { Chat } from '@/components/chat';

import { generateUUID } from '@/lib/utils';
import { User } from 'next-auth';
import { getThreadHistory } from '@/services/thread-service';
import { IMessage, IThreadHistoryResponse } from '@/types/ai';



export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const user: User = {
    id: '07ccb145-768f-424b-938e-bcc9b766014f',
    email: '',
    username: 'user',
    image: '',
    role: 'user',
    accessToken: '',
    expiresAt: 0,
    refreshToken: '',
  };

  const reponse: IThreadHistoryResponse = await getThreadHistory({
    user: user,
    payload: {
      threadId: id,
    }
  });


  if (!reponse) {
    notFound();
  }

  const initialMessages: IMessage[] = reponse.messages?.map(message => {
    return {
      id: generateUUID(),
      content: message.content,
      role: message.role,
    }
  });

  // const session = await auth();

  // if (!session || !session.user) {
  //   return notFound();
  // }

  // if (session.user.id !== chat.userId) {
  //   return notFound();
  // }

  return (
    <Chat
      id={id}
      user={user}
      initialMessages={initialMessages}
    />
  );
}
