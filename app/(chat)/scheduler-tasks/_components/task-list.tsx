'use client';

import { UploadListSkeleton } from '@/components/skeleton/upload-list-skeleton';
import { toast } from '@/components/toast';
import { Separator } from '@/components/ui/separator';
import { SchedulerTaskStatus } from '@/constants/scheduler-task';
import useTaskPolling from '@/hooks/use-task-polling';
import { getAllAssistants, GetAssistantsParams } from '@/services/assistant-service';
import {
  getAllSchedulerTasks,
  GetAllSchedulerTasksParams,
  runSchedulerTask,
  SchedulerTaskFilterProps,
} from '@/services/scheduler-service';
import { IAssistant } from '@/types/assistant';
import { ISchedulerTask } from '@/types/scheduler-task';
import { User } from 'next-auth';
import { useCallback, useEffect, useState } from 'react';
import { GoTasklist } from 'react-icons/go';
import SchedulerTasksHeader from './header';
import SchedulerTaskCard from './task-card';
import SchedulerTaskDialog from './task-dialog';
import SchedulerTaskFilter from './task-filter';

export interface SchedulerTasksListProps {
  user: User;
}

function SchedulerTasksList(props: SchedulerTasksListProps) {
  const { user } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState<boolean>(false);
  const [tasks, setTasks] = useState<ISchedulerTask[]>([]);
  const [assistants, setAssistants] = useState<IAssistant[]>([]);
  const [editingTask, setEditingTask] = useState<ISchedulerTask | null>(null);
  const [filter, setFilter] = useState<SchedulerTaskFilterProps>({
    skip: 0,
    limit: 100,
  });

  // Initialize multi-task polling hook
  const taskPolling = useTaskPolling({
    user,
    intervalMs: 2000,
    maxRetries: 30,
    onStatusChange: (updatedTask: ISchedulerTask) => {
      // Update the task in the tasks array when status changes
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      );
    },
    onSuccess: (task: ISchedulerTask) => {
      toast({
        description: `Task "${task.name}" completed successfully!`,
        type: 'success',
      });
    },
    onError: (error: Error, taskId: string) => {
      const foundTask = tasks.find((t) => t.id === taskId);
      toast({
        description: `Task "${foundTask?.name || taskId}" failed: ${error.message}`,
        type: 'error',
      });
    },
    onMaxRetriesReached: (taskId: string) => {
      const foundTask = tasks.find((t) => t.id === taskId);
      toast({
        description: `Max polling retries reached for task "${foundTask?.name || taskId}"`,
        type: 'info',
      });
    },
  });

  useEffect(() => {
    const fetchSchedulerTasks = async () => {
      setLoading(true);
      const payload: GetAllSchedulerTasksParams = {
        user,
        payload: filter,
      };
      try {
        const tasksResponse: ISchedulerTask[] = await getAllSchedulerTasks(payload);
        if (tasksResponse && Array.isArray(tasksResponse)) {
          setTasks(tasksResponse);
        }
      } catch (error) {
        console.error('Error fetching scheduler tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchAssistants = async () => {
      setLoading(true);

      const payload: GetAssistantsParams = {
        user: user,
        payload: {
          pageNumber: 1,
          maxPerPage: 100,
        },
      };
      try {
        const assistantsResponse: IAssistant[] = await getAllAssistants(payload);
        if (assistantsResponse.length > 0) {
          setAssistants(assistantsResponse);
        }
      } catch (error) {
        console.error('Error fetching assistants:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssistants();
    fetchSchedulerTasks();
  }, [filter, user]);

  const updateFilter = useCallback((newFilter: SchedulerTaskFilterProps) => {
    setFilter((prevFilter) => ({ ...prevFilter, ...newFilter }));
  }, []);

  const handleOpenAddNewTaskDialog = useCallback(() => {
    setIsTaskDialogOpen(true);
    setEditingTask(null);
  }, []);

  const handleCompleteTaskCallback = (completedTask: ISchedulerTask) => {
    if (!completedTask) return;
    if (editingTask && editingTask.id === completedTask.id) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === completedTask.id ? completedTask : task)),
      );
    } else {
      setTasks((prevTasks) => [...prevTasks, completedTask]);
    }
    setIsTaskDialogOpen(false);
    setEditingTask(null);
  };

  const handleRemoveTaskCallback = useCallback((taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }, []);

  const handleOpenEditTaskDialog = useCallback((task: ISchedulerTask) => {
    setIsTaskDialogOpen(true);
    setEditingTask(task);
  }, []);

  const onRunTaskCallback = useCallback(
    async (task: ISchedulerTask) => {
      try {
        // Call the API to run the task
        const isSuccess = await runSchedulerTask(user, task.id);
        if (!isSuccess) {
          throw new Error(`Failed to start task "${task.name}"`);
        }
        // Update the task in state with the new status
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === task.id ? { ...t, status: SchedulerTaskStatus.RUNNING } : t,
          ),
        );

        // Start polling for this task
        taskPolling.startPolling(task.id);

        toast({
          description: `Task "${task.name}" started successfully!`,
          type: 'success',
        });
      } catch (error) {
        console.error('Error running task:', error);
        toast({
          description: `Failed to start task "${task.name}"`,
          type: 'error',
        });
      }
    },
    [user, taskPolling],
  );

  return (
    <>
      <SchedulerTasksHeader onOpenDialog={handleOpenAddNewTaskDialog} />

      <SchedulerTaskFilter assistants={assistants} updateFilter={updateFilter} />

      <Separator className="shadow" />

      <div className="mt-2">
        {loading ? (
          <UploadListSkeleton />
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-sm text-muted-foreground">
            <GoTasklist size={32} />
            <span>{`No scheduler tasks found. Use the "Add Task" button to add one.`}</span>
          </div>
        ) : (
          <ul className="w-full grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task, index) => {
              const displayTask = taskPolling.getCurrentTask(task.id) || task;

              return (
                <div key={index} className="w-full relative">
                  <SchedulerTaskCard
                    user={user}
                    task={displayTask}
                    onEditTaskCallback={handleOpenEditTaskDialog}
                    onDeleteTaskCallback={handleRemoveTaskCallback}
                    onRunTaskCallback={onRunTaskCallback}
                  />
                </div>
              );
            })}
          </ul>
        )}

        <SchedulerTaskDialog
          user={user}
          assistants={assistants}
          open={isTaskDialogOpen}
          task={editingTask}
          onOpenChange={setIsTaskDialogOpen}
          onTaskCompletedCallback={handleCompleteTaskCallback}
        />
      </div>
    </>
  );
}

export default SchedulerTasksList;
