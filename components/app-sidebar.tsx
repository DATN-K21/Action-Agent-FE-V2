'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';

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
import Link from 'next/link';
import { NavCustom } from '@/components/nav-custom';

import {
  HiOutlineViewGrid,
  HiOutlineChatAlt,
  HiOutlineServer,
  HiOutlinePuzzle,
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
    title: 'MCP Server',
    url: '/mcp-server',
    icon: HiOutlineServer,
  },
  {
    title: 'Assistants',
    url: '/assistant',
    icon: HiOutlinePuzzle,
  },
];

export function AppSidebar({ user }: { user: User }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

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
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                Botion
              </span>
            </Link>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavCustom items={navCustomItems} />
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
