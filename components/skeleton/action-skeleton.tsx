export const ActionSkeleton = () => (
  <div className="mb-1 grid grid-cols-[25px_1fr] items-start pb-1 last:mb-0 last:pb-0">
    <span className="flex size-2 translate-y-1 rounded-full bg-gray-200 animate-pulse" />
    <div className="space-y-1">
      <div className="h-4 w-1/3 rounded bg-gray-200 animate-pulse" />
      <div className="h-3 w-full rounded bg-gray-200 animate-pulse" />
      <div className="h-3 w-2/3 rounded bg-gray-200 animate-pulse" />
    </div>
  </div>
);
