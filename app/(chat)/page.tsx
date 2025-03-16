import { Chat } from '@/components/chat';
import { generateUUID } from '@/lib/utils';
import { User } from 'next-auth';

export default async function Page() {
  const id = generateUUID();

  const user: User = {
    id: '425fd43b-48cb-4dbd-8c93-9287b6496ab5',
    email: '',
    username: 'user',
    image: '',
    role: 'user',
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
