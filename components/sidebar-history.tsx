'use client';

import { isToday, isYesterday, subMonths, subWeeks } from 'date-fns';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import type { User } from 'next-auth';
import { memo, useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  CheckCircleFillIcon,
  GlobeIcon,
  LockIcon,
  MoreHorizontalIcon,
  ShareIcon,
  TrashIcon,
} from '@/components/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { getThreads } from '@/services/thread-service';
import { IThread } from '@/types/ai';

interface GroupedThreads {
  today: IThread[];
  yesterday: IThread[];
  lastWeek: IThread[];
  lastMonth: IThread[];
  older: IThread[];
};

const PureThreadItem = ({
  thread,
  isActive,
  onDelete,
  setOpenMobile,
}: {
  thread: IThread;
  isActive: boolean
  onDelete: () => void;
  setOpenMobile: (open: boolean) => void;
}) => {

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={`/chat/${thread.id}`} onClick={() => setOpenMobile(false)}>
          <span>{thread.title}</span>
        </Link>
      </SidebarMenuButton>

      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5"
            showOnHover={!isActive}
          >
            <MoreHorizontalIcon />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <ShareIcon />
              <span>Share</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
            onSelect={() => onDelete()}
          >
            <TrashIcon />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export const ThreadItem = memo(PureThreadItem, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) return false;
  return true;
});

export function SidebarHistory({ user }: { user: User }) {
  const { setOpenMobile } = useSidebar();
  const [threads, setThreads] = useState<IThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const pathname = usePathname();

  useEffect(() => {
    handleGetThreads();
  }, [pathname]);

  const handleGetThreads = async () => {
    setIsLoading(true);

    try {
      const response = await getThreads({ user, payload: {} });
      setThreads(response.threads);
    } catch (error) {
      console.error('Error fetching threads: ', error);
    } finally {
      setIsLoading(false);
    }
  }

  const [deleteId, setDeleteId] = useState<string>('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    // const deletePromise = fetch(`/api/chat?id=${deleteId}`, {
    //   method: 'DELETE',
    // });

    // toast.promise(deletePromise, {
    //   loading: 'Deleting chat...',
    //   success: () => {
    //     mutate((history) => {
    //       if (history) {
    //         return history.filter((h) => h.id !== id);
    //       }
    //     });
    //     return 'Chat deleted successfully';
    //   },
    //   error: 'Failed to delete chat',
    // });

    setShowDeleteDialog(false);

    if (deleteId === id) {
      router.push('/');
    }
  };

  if (!user) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
            Login to save and revisit previous chats!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (isLoading) {
    return (
      <SidebarGroup>
        <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
          Today
        </div>
        <SidebarGroupContent>
          <div className="flex flex-col">
            {[44, 32, 28, 64, 52].map((item) => (
              <div
                key={item}
                className="rounded-md h-8 flex gap-2 px-2 items-center"
              >
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
  }

  if (threads?.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
            Your conversations will appear here once you start chatting!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  const groupThreadsByDate = (threads: IThread[]): GroupedThreads => {
    const now = new Date();
    const oneWeekAgo = subWeeks(now, 1);
    const oneMonthAgo = subMonths(now, 1);

    return threads.reduce(
      (groups, thread) => {
        const threadDate = new Date(thread.createdAt);

        if (isToday(threadDate)) {
          groups.today.push(thread);
        } else if (isYesterday(threadDate)) {
          groups.yesterday.push(thread);
        } else if (threadDate > oneWeekAgo) {
          groups.lastWeek.push(thread);
        } else if (threadDate > oneMonthAgo) {
          groups.lastMonth.push(thread);
        } else {
          groups.older.push(thread);
        }

        return groups;
      },
      {
        today: [],
        yesterday: [],
        lastWeek: [],
        lastMonth: [],
        older: [],
      } as GroupedThreads,
    );
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {threads &&
              (() => {
                const groupedThreads = groupThreadsByDate(threads);

                return (
                  <>
                    {groupedThreads.today.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                          Today
                        </div>
                        {groupedThreads.today.map((thread) => (
                          <ThreadItem
                            key={thread.id}
                            thread={thread}
                            isActive={thread.id === id}
                            onDelete={() => {
                              setDeleteId(thread.id);
                              setShowDeleteDialog(true);
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </>
                    )}

                    {groupedThreads.yesterday.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-6">
                          Yesterday
                        </div>
                        {groupedThreads.yesterday.map((thread) => (
                          <ThreadItem
                            key={thread.id}
                            thread={thread}
                            isActive={thread.id === id}
                            onDelete={() => {
                              setDeleteId(thread.id);
                              setShowDeleteDialog(true);
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </>
                    )}

                    {groupedThreads.lastWeek.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-6">
                          Last 7 days
                        </div>
                        {groupedThreads.lastWeek.map((thread) => (
                          <ThreadItem
                            key={thread.id}
                            thread={thread}
                            isActive={thread.id === id}
                            onDelete={() => {
                              setDeleteId(thread.id);
                              setShowDeleteDialog(true);
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </>
                    )}

                    {groupedThreads.lastMonth.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-6">
                          Last 30 days
                        </div>
                        {groupedThreads.lastMonth.map((thread) => (
                          <ThreadItem
                            key={thread.id}
                            thread={thread}
                            isActive={thread.id === id}
                            onDelete={() => {
                              setDeleteId(thread.id);
                              setShowDeleteDialog(true);
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </>
                    )}

                    {groupedThreads.older.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-6">
                          Older
                        </div>
                        {groupedThreads.older.map((thread) => (
                          <ThreadItem
                            key={thread.id}
                            thread={thread}
                            isActive={thread.id === id}
                            onDelete={() => {
                              setDeleteId(thread.id);
                              setShowDeleteDialog(true);
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </>
                    )}
                  </>
                );
              })()}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              chat and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
