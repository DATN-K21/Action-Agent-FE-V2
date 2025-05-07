import { SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar';

export const ThreadListSkeleton = () => {
  return (
    <SidebarGroup>
      <div className="px-2 py-1 text-xs text-sidebar-foreground/50">Today</div>
      <SidebarGroupContent>
        <div className="flex flex-col">
          {[44, 32, 28, 64, 52].map((item) => (
            <div key={item} className="rounded-md h-8 flex gap-2 px-2 items-center">
              <div
                className="h-4 rounded-md flex-1 max-w-[--skeleton-width] bg-sidebar-accent-foreground/10"
                style={
                  {
                    '--skeleton-width': `${item}%`,
                  } as React.CSSProperties
                }
              />
            </div>
          ))}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
