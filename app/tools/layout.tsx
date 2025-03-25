import { auth } from '@/auth'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Role } from '@/constants/auth-constant'
import { User } from 'next-auth'
import { cookies } from 'next/headers'
import React from 'react'

export default async function ToolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user: User = {
    id: '07ccb145-768f-424b-938e-bcc9b766014f',
    email: '',
    username: 'user',
    image: '',
    role: Role.USER,
    accessToken: '',
    expiresAt: 0,
    refreshToken: '',
  }
  const [session, cookieStore] = await Promise.all([auth(), cookies()])
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true'

  return (
    <>
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={user} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  )
}
