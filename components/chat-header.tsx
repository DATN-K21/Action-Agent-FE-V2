'use client';

import { useRouter, usePathname } from 'next/navigation';

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

  // Only show assistant name on home page or chat pages
  const isShowAssistant = pathname === '/' || pathname.startsWith('/chat');

  return (
    <header className="flex sticky top-0 py-2 items-center px-3 sm:px-4 md:px-6 gap-2 sm:gap-3 bg-background/80 backdrop-blur-sm border-b border-border">
      <SidebarToggle />

      {assistant && isShowAssistant && (
        <div className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer">
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full flex-shrink-0"></div>
            <span className="text-sm sm:text-base font-medium sm:font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
              {assistant.name}
            </span>
            <div className="hidden sm:flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
              AI
            </div>
          </div>
        </div>
      )}

      {/* Show button when sidebar is closed OR on mobile */}
      <div className={`${open ? 'md:hidden' : 'block'} ml-auto md:ml-0`}>
        <Button
          variant="outline"
          size="sm"
          className="order-2 md:order-1 px-2 sm:px-3 md:px-4 h-8 sm:h-9 md:h-10 flex-shrink-0"
          onClick={() => {
            router.push('/');
            router.refresh();
          }}
        >
          <PlusIcon size={16} />
          <span className="hidden sm:inline md:sr-only lg:inline ml-1 sm:ml-2">New Chat</span>
        </Button>
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader);
