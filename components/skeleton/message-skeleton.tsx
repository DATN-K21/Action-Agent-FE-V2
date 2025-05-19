import React from 'react';

interface MessageSkeletonProps {
  isUser: boolean;
  lines?: number;
}

export function MessageSkeleton({ isUser, lines = 1 }: MessageSkeletonProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 w-3/5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {' '}
        {/* Increased max-width */}
        <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 animate-pulse" />
        <div className={`${isUser ? 'bg-primary/10' : 'bg-muted'} p-3 rounded-lg w-full`}>
          {Array(lines)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className={`h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse ${
                  i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
                }`}
                style={{ width: `${Math.max(70, Math.random() * 100)}%` }}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
