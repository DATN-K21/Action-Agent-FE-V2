import { cookies } from 'next/headers'

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { auth } from '@/auth'
import { User } from 'next-auth'
import { notFound } from 'next/navigation'
import { ChatHeader } from '@/components/chat-header'

export const experimental_ppr = true

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()])
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true'

  if (!session || !session.user) {
    return notFound()
  }

  const user: User = {
    ...session.user,
    accessToken: session.accessToken,
    role: session.user.role,
    refreshToken: session.refreshToken,
    expiresAt: session.expiresAt,
  }

  return (
    <SidebarProvider defaultOpen={!isCollapsed}>
      <AppSidebar user={user} />
      <SidebarInset>
        <div className="flex flex-col min-w-0 h-dvh bg-background">
          <ChatHeader />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
