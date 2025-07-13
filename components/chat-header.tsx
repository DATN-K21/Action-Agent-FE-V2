'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon } from './icons';
import { useSidebar } from './ui/sidebar';
import { memo } from 'react';
import useChatStore from '@/store/chat-store';

function PureChatHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { open } = useSidebar();
  const { assistant } = useChatStore();

  const { width: windowWidth } = useWindowSize();

  // Only show assistant name on home page or chat pages
  const isShowAssistant = pathname === '/' || pathname.startsWith('/chat');

  return (
    <header className="flex sticky top-0 py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />

      {assistant && isShowAssistant && (
        <div className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer">
          <div className="flex items-center gap-3 px-4 py-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
              {assistant.name}
            </span>
            <div className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
              AI
            </div>
          </div>
        </div>
      )}

      {(!open || windowWidth < 768) && (
        <Button
          variant="outline"
          className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
          onClick={() => {
            router.push('/');
            router.refresh();
          }}
        >
          <PlusIcon />
          <span className="md:sr-only">New Chat</span>
        </Button>
      )}
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader);
