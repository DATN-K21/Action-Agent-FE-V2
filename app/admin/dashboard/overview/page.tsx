import { User } from 'next-auth';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import OverViewPage from './_components/overview';

export const metadata = {
  title: 'Dashboard : Overview',
};

export default async function page() {
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
  return <OverViewPage user={user} />;
}
