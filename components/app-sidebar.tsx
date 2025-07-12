'use client';

import type { User } from 'next-auth';

import { NavCustom } from '@/components/nav-custom';
import SidebarHistory from '@/components/sidebar-history';
import { SidebarUserNav } from '@/components/sidebar-user-nav';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAssistantStore } from '@/store/assistant-store';
import Link from 'next/link';
import { useEffect } from 'react';
import {
  HiOutlineBookOpen,
  HiOutlineChatAlt,
  HiOutlinePuzzle,
  HiOutlineServer,
  HiOutlineViewGrid
} from 'react-icons/hi';

type navCustomItemProps = {
  title: string;
  url: string;
  icon: any;
};

const navCustomItems: navCustomItemProps[] = [
  {
    title: 'New Chat',
    url: '/',
    icon: HiOutlineChatAlt,
  },
  {
    title: 'Extensions',
    url: '/extensions',
    icon: HiOutlineViewGrid,
  },
  {
    title: 'MCP Servers',
    url: '/mcp-server',
    icon: HiOutlineServer,
  },
  {
    title: 'Assistants',
    url: '/assistant',
    icon: HiOutlinePuzzle,
  },
  {
    title: 'Knowledge',
    url: '/knowledge-base',
    icon: HiOutlineBookOpen,
  },
];

export function AppSidebar({ user }: { user: User }) {
  const { setOpenMobile } = useSidebar();
  const fetchAssistants = useAssistantStore((state) => state.fetchAssistants);

  useEffect(() => {
    fetchAssistants(user);
  }, [user, fetchAssistants]);

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => {
              setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center justify-start"
            >
              <img
              src="/images/logo.png"
              alt="Action Agent Logo"
              className="h-14 w-auto px-2 rounded-md cursor-pointer"
              style={{ maxHeight: '3.5rem' }}
              />
            </Link>
          </div>
        </SidebarMenu>
        <NavCustom items={navCustomItems} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
