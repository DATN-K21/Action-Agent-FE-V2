'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from 'next-auth';
import { memo, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { MoreHorizontalIcon, TrashIcon } from '@/components/icons';
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
import { IThread } from '@/types/ai';
import { EditIcon } from 'lucide-react';
import { toast } from '@/components/toast';
import { useThreadStore } from '@/store/thread-store';
import { ThreadType } from '@/constants/extension-constant';
import useChatStore from '@/store/chat-store';

function SidebarHistory({ user }: { user: User }) {
  const threads = useThreadStore((state) => state.threads);
  const nextCursor = useThreadStore((state) => state.nextCursor);
  const isLoading = useThreadStore((state) => state.isLoading);
  const fetchThreads = useThreadStore((state) => state.fetchThreads);
  const deleteThreadById = useThreadStore((state) => state.deleteThreadById);
  const renameThread = useThreadStore((state) => state.renameThread);
  const groupThreadsByDate = useThreadStore((state) => state.groupThreadsByDate);

  const threadId = useChatStore((state) => state.threadId);

  const [deleteId, setDeleteId] = useState<string>('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    fetchThreads(user);
  }, [user]);

  // useEffect(() => {
  //   if (inView && nextCursor && !isLoading) {
  //     fetchThreads(user, nextCursor);
  //   }
  // }, [inView, nextCursor, isLoading, fetchThreads, user]);

  // Handle delete thread
  const handleDelete = async () => {
    try {
      await deleteThreadById(user, deleteId);
      if (deleteId === threadId) {
        router.push('/');
      }
      toast({
        type: 'success',
        description: 'Thread deleted successfully',
      });
    } catch (error) {
      toast({
        type: 'error',
        description: 'Failed to delete thread',
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  // Handle rename thread
  const handleRename = async (id: string, title: string) => {
    try {
      await renameThread(user, id, title);
      toast({
        type: 'success',
        description: 'Thread renamed successfully',
      });
    } catch (error) {
      toast({
        type: 'error',
        description: 'Failed to rename thread',
      });
    }
  };

  // Loading skeleton
  if (isLoading) {
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
  }

  // Empty threads
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

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {threads &&
              (() => {
                const groupedThreads = groupThreadsByDate();

                return (
                  <>
                    {groupedThreads.today.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-sidebar-foreground/50">Today</div>
                        {groupedThreads.today.map((thread) => (
                          <ThreadItem
                            key={thread.id}
                            thread={thread}
                            isActive={thread.id === threadId}
                            onDelete={() => {
                              setDeleteId(thread.id);
                              setShowDeleteDialog(true);
                            }}
                            onRename={handleRename}
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
                            isActive={thread.id === threadId}
                            onRename={handleRename}
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
                            isActive={thread.id === threadId}
                            onRename={handleRename}
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
                            isActive={thread.id === threadId}
                            onRename={handleRename}
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
                            isActive={thread.id === threadId}
                            onRename={handleRename}
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
            {nextCursor && <div ref={ref} className="h-1" />}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your chat and remove it
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default memo(SidebarHistory, (prev, next) => {
  return prev.user.id === next.user.id;
});

interface IThreadItemProps {
  thread: IThread;
  isActive: boolean;
  onRename: (id: string, title: string) => Promise<void>;
  onDelete: () => void;
  setOpenMobile: (open: boolean) => void;
}

const PureThreadItem = (props: IThreadItemProps) => {
  const { thread, isActive, onRename, onDelete, setOpenMobile } = props;
  const [isRenaming, setIsRenaming] = useState(false);
  const [newtitle, setNewTitle] = useState(thread.title);

  const onEventRename = async () => {
    const trimmedTitle = newtitle.trim();

    if (!trimmedTitle) {
      toast({
        type: 'error',
        description: 'Title cannot be empty',
      });
    } else if (trimmedTitle !== thread.title) {
      await onRename(thread.id, trimmedTitle);
    }

    setIsRenaming(false);
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        {isRenaming ? (
          <input
            type="text"
            value={newtitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={onEventRename}
            onKeyDown={(e) => e.key === 'Enter' && onEventRename()}
            autoFocus={true}
            className="w-full px-2 py-1 text-sm border rounded"
          />
        ) : (
          <Link
            href={`/chat/${thread.threadType === ThreadType.DEFAULT ? thread.id : `${thread.id}/${thread.threadType}`}`}
            onClick={() => setOpenMobile(false)}
          >
            <span>{thread.title}</span>
          </Link>
        )}
      </SidebarMenuButton>

      {!isRenaming && (
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
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => {
                setNewTitle(thread.title);
                setIsRenaming(true);
              }}
            >
              <EditIcon />
              <span>Rename</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
              onSelect={() => onDelete()}
            >
              <TrashIcon />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </SidebarMenuItem>
  );
};

export const ThreadItem = memo(PureThreadItem, (prev, next) => {
  return (
    prev.isActive === next.isActive &&
    prev.thread.id === next.thread.id &&
    prev.thread.title === next.thread.title
  );
});
