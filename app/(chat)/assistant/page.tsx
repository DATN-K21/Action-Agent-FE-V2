import { auth } from '@/auth';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { User } from 'next-auth';
import AssistantsList from './_components/assistant-list';

export const metadata: Metadata = {
  title: 'Assistant - Botion',
  description: 'Assistant Page',
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

  return (
    <div className="flex flex-col h-full w-full px-2 md:px-4">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight mt-2">Assistants</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          {`Add your Assistant to your account to use it with Botion.`}
        </p>
      </div>
      <AssistantsList user={user} />
    </div>
  );
}
