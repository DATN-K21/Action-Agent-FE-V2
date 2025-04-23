'use client';

import { MessageSkeleton } from '@/components/message-skeleton';

export default function ChatLoading() {
  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6 max-w-4xl mx-auto">
          <MessageSkeleton isUser={false} />
          <MessageSkeleton isUser={true} />
          <MessageSkeleton isUser={false} />
          <MessageSkeleton isUser={false} lines={2} />
        </div>
      </div>
      <div className="border-t p-4">
        <div className="mx-auto max-w-4xl flex gap-2">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-md flex-1 animate-pulse" />
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}
