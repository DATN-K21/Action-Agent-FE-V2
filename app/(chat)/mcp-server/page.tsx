import { auth } from '@/auth';
import MCPServerTable from './_components/mcp-server-table';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { User } from 'next-auth';

export const metadata: Metadata = {
  title: 'MCP Server - Botion',
  description: 'MCP Server Page',
}

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

  return <MCPServerTable user={user} />;
}
