import React from 'react';

export function AssistantCardSkeleton() {
  return (
    <li className="rounded-lg border p-4">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted p-2">
          <div className="size-6 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="size-8 animate-pulse rounded bg-gray-200"></div>
      </div>
      <div>
        <div className="mb-2 h-5 w-1/2 animate-pulse rounded bg-gray-200"></div>
        <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
        <div className="mt-1 h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
      </div>
      <div className="mt-4">
        <div className="h-8 w-full animate-pulse rounded bg-gray-200"></div>
      </div>
    </li>
  );
}

export function AssistantCardSkeletonList() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <AssistantCardSkeleton key={index} />
      ))}
    </>
  );
}
