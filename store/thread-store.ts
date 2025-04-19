import { create } from 'zustand';
import { subMonths, subWeeks, isToday, isYesterday } from 'date-fns';
import { deleteThread, getThreads, updateThread } from '@/services/thread-service';
import { ICreateThreadResponse, IThread, IThreadsResponse } from '@/types/ai';
import type { User } from 'next-auth';

interface GroupedThreads {
  today: IThread[];
  yesterday: IThread[];
  lastWeek: IThread[];
  lastMonth: IThread[];
  older: IThread[];
}

interface ThreadState {
  threads: IThread[];
  nextCursor: string | null;
  isLoading: boolean;
  addThread: (thread: IThread) => void;
  fetchThreads: (user: User, cursor?: string) => Promise<void>;
  deleteThreadById: (user: User, threadId: string) => Promise<void>;
  renameThread: (user: User, threadId: string, title: string) => Promise<void>;
  groupThreadsByDate: () => GroupedThreads;
}

export const useThreadStore = create<ThreadState>((set, get) => ({
  threads: [],
  nextCursor: null,
  isLoading: false,

  addThread: (thread) => {
    const { threads } = get();
    set({ threads: [thread, ...threads] });
  },

  fetchThreads: async (user, cursor) => {
    set({ isLoading: true });
    try {
      const response: IThreadsResponse = await getThreads({ user, payload: { cursor } });
      set((state) => ({
        threads: cursor
          ? [...state.threads, ...response.threads] // Nối thêm threads nếu có cursor
          : response.threads, // Thay thế nếu không có cursor
        nextCursor: response.nextCursor, // Lưu nextCursor
      }));
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteThreadById: async (user, threadId) => {
    const { threads } = get();
    try {
      await deleteThread({ user, payload: { threadId } });
      set({ threads: threads.filter((thread) => thread.id !== threadId) });
    } catch (error) {
      throw error;
    }
  },

  renameThread: async (user, threadId, title) => {
    const { threads } = get();
    try {
      const response: ICreateThreadResponse = await updateThread({
        user,
        payload: { id: threadId, title },
      });
      set({
        threads: threads.map((thread) =>
          thread.id === threadId ? { ...thread, title: response.title } : thread,
        ),
      });
    } catch (error) {
      throw error;
    }
  },

  groupThreadsByDate: () => {
    const { threads } = get();
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
  },
}));
