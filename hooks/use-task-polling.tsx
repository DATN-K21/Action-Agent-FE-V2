'use client';
import { SchedulerTaskStatus } from '@/constants/scheduler-task';
import { getSchedulerTaskById } from '@/services/scheduler-service';
import { ISchedulerTask } from '@/types/scheduler-task';
import { User } from 'next-auth';
import { useCallback, useEffect, useRef, useState } from 'react';

interface TaskPollingState {
  retryCount: number;
  intervalRef: NodeJS.Timeout | null;
  currentTask: ISchedulerTask | null;
}

interface UseTaskPollingOptions {
  user: User;
  intervalMs?: number;
  maxRetries?: number;
  onStatusChange?: (task: ISchedulerTask) => void;
  onMaxRetriesReached?: (taskId: string) => void;
  onSuccess?: (task: ISchedulerTask) => void;
  onError?: (error: Error, taskId: string) => void;
}

function useTaskPolling(props: UseTaskPollingOptions) {
  const {
    user,
    intervalMs = 5000,
    maxRetries = 30,
    onStatusChange,
    onMaxRetriesReached,
    onSuccess,
    onError,
  } = props;

  // State to track all polling tasks
  const [pollingTasks, setPollingTasks] = useState<Map<string, TaskPollingState>>(new Map());
  const [isPolling, setIsPolling] = useState<boolean>(false);

  // Ref to track polling states to avoid stale closures
  const pollingTasksRef = useRef<Map<string, TaskPollingState>>(new Map());

  const stopPolling = useCallback((taskId?: string) => {
    if (taskId) {
      // Stop polling for specific task
      const taskState = pollingTasksRef.current.get(taskId);
      if (taskState?.intervalRef) {
        clearInterval(taskState.intervalRef);
      }
      pollingTasksRef.current.delete(taskId);
      setPollingTasks(new Map(pollingTasksRef.current));

      // If no tasks are being polled, set isPolling to false
      if (pollingTasksRef.current.size === 0) {
        setIsPolling(false);
      }
    } else {
      // Stop all polling
      pollingTasksRef.current.forEach((taskState) => {
        if (taskState.intervalRef) {
          clearInterval(taskState.intervalRef);
        }
      });
      pollingTasksRef.current.clear();
      setPollingTasks(new Map());
      setIsPolling(false);
    }
  }, []);

  const pollSingleTask = useCallback(
    async (taskId: string) => {
      if (!taskId || !user) {
        return;
      }

      const taskState = pollingTasksRef.current.get(taskId);
      if (!taskState) {
        return;
      }

      try {
        const latestTask = await getSchedulerTaskById(user, taskId);
        if (!latestTask) {
          return;
        }

        // Update task state
        taskState.currentTask = latestTask;
        pollingTasksRef.current.set(taskId, taskState);
        setPollingTasks(new Map(pollingTasksRef.current));

        onStatusChange?.(latestTask);
        if (latestTask.status === SchedulerTaskStatus.SUCCESS) {
          onSuccess?.(latestTask);
          stopPolling(taskId);
          return;
        }

        if (
          [SchedulerTaskStatus.FAILED, SchedulerTaskStatus.CANCELLED].includes(latestTask.status)
        ) {
          onError?.(new Error(`Task ${taskId} failed`), taskId);
          stopPolling(taskId);
          return;
        }
      } catch (error: any) {
        console.error('Error polling task:', error);
        onError?.(error as Error, taskId);
      } finally {
        // Update retry count
        taskState.retryCount += 1;
        pollingTasksRef.current.set(taskId, taskState);
        setPollingTasks(new Map(pollingTasksRef.current));

        if (taskState.retryCount >= maxRetries) {
          onMaxRetriesReached?.(taskId);
          stopPolling(taskId);
          return;
        }
      }
    },
    [maxRetries, onError, onMaxRetriesReached, onStatusChange, onSuccess, stopPolling, user],
  );

  const startPolling = useCallback(
    (taskId: string) => {
      if (!taskId || !user || pollingTasksRef.current.has(taskId)) {
        return;
      }

      // Create new task polling state
      const taskState: TaskPollingState = {
        retryCount: 0,
        intervalRef: null,
        currentTask: null,
      };

      // Initial call to fetch the task immediately
      pollSingleTask(taskId);

      // Set up interval for this specific task
      taskState.intervalRef = setInterval(() => pollSingleTask(taskId), intervalMs);

      pollingTasksRef.current.set(taskId, taskState);
      setPollingTasks(new Map(pollingTasksRef.current));
      setIsPolling(true);
    },
    [intervalMs, pollSingleTask, user],
  );

  const getTaskState = useCallback((taskId: string): TaskPollingState | undefined => {
    return pollingTasksRef.current.get(taskId);
  }, []);

  const getCurrentTask = useCallback((taskId: string): ISchedulerTask | null => {
    return pollingTasksRef.current.get(taskId)?.currentTask || null;
  }, []);

  const getRetryCount = useCallback((taskId: string): number => {
    return pollingTasksRef.current.get(taskId)?.retryCount || 0;
  }, []);

  const isTaskPolling = useCallback((taskId: string): boolean => {
    return pollingTasksRef.current.has(taskId);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling(); // Stop all polling on unmount
    };
  }, [stopPolling]);

  return {
    isPolling,
    pollingTasks: Array.from(pollingTasks.keys()),
    startPolling,
    stopPolling,
    getTaskState,
    getCurrentTask,
    getRetryCount,
    isTaskPolling,
  };
}

export default useTaskPolling;
