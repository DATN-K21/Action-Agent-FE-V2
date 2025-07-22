import { auth } from '@/auth';

import { User } from 'next-auth';
import { notFound } from 'next/navigation';
import SchedulerTasksList from './_components/task-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scheduler Tasks',
  description: 'Manage your scheduled tasks',
};

export default async function SchedulerJobsPage() {
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
    <div className="flex flex-col items-center justify-start p-2 md:px-4 gap-2">
      <SchedulerTasksList user={user} />
    </div>
  );
}
