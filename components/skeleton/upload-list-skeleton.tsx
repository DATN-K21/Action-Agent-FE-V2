export const UploadListSkeleton = () => (
  <ul className="grid gap-4 pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <li key={i} className="rounded-lg border p-4 animate-pulse flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <div className="size-6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700 mt-2" />
        <div className="flex items-center gap-1 mt-2">
          <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </li>
    ))}
  </ul>
);
