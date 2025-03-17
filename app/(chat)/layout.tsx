import { cookies } from 'next/headers';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { auth } from '@/auth';
import Script from 'next/script';
import { User } from 'next-auth';
import { Role } from '@/constants/data';

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

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
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={user} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
