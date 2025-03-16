import { Chat } from '@/components/chat';
import { Role } from '@/constants/data';
import { generateUUID } from '@/lib/utils';
import { User } from 'next-auth';

export default async function Page() {
  const id = generateUUID();

  const user: User = {
    id: '07ccb145-768f-424b-938e-bcc9b766014f',
    email: '',
    username: 'user',
    image: '',
    role: Role.USER,
    accessToken: '',
    expiresAt: 0,
    refreshToken: '',
  };

  return (
    <Chat
      key={id}
      id={id}
      user={user}
      initialMessages={[]}
    />
  );
}
