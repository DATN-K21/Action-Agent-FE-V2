import { auth } from '@/auth';
import { Chat } from '@/components/chat';
import { Role } from '@/constants/data';
import { ExtensionType } from '@/constants/extension-constant';
import { generateUUID } from '@/lib/utils';
import { User } from 'next-auth';
import { notFound } from 'next/navigation';

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
    <Chat
      key={generateUUID()}
      id={generateUUID()}
      user={user}
      initialMessages={[]}
      extensionName={ExtensionType.DEFAULT}
    />
  );
}
