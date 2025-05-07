export const ExtensionCardSkeleton = () => (
  <li className="rounded-lg border p-4 animate-pulse">
    <div className="mb-8 flex items-center justify-between">
      <div className="size-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-8 w-20 rounded-md bg-gray-200 dark:bg-gray-700"></div>
    </div>
    <div>
      <div className="mb-2 h-5 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="mt-1 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
  </li>
);
