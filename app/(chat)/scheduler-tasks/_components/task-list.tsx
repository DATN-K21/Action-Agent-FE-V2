'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { User } from 'next-auth';
import { UploadListSkeleton } from '@/components/skeleton/upload-list-skeleton';
import { GoTasklist } from 'react-icons/go';
import SchedulerTaskCard from './task-card';
import SchedulerTaskDialog from './task-dialog';
import { ISchedulerTask } from '@/types/scheduler-task';
import SchedulerTasksHeader from './header';
import { getAllSchedulerTasks, GetAllSchedulerTasksParams } from '@/services/scheduler-service';
import { IAssistant } from '@/types/assistant';
import { getAllAssistants, GetAssistantsParams } from '@/services/assistant-service';

export interface SchedulerTasksListProps {
  user: User;
}

function SchedulerTasksList(props: SchedulerTasksListProps) {
  const { user } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState<boolean>(false);
  const [tasks, setTasks] = useState<ISchedulerTask[]>([]);
  const [assistants, setAssistants] = useState<IAssistant[]>([]);

  useEffect(() => {
    const fetchSchedulerTasks = async () => {
      setLoading(true);
      const payload: GetAllSchedulerTasksParams = {
        user,
        payload: {
          skip: 0,
          limit: 10,
        },
      };
      try {
        const tasksResponse: ISchedulerTask[] = await getAllSchedulerTasks(payload);
        if (tasksResponse && tasksResponse.length > 0) {
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
  }, [user]);

  const handleAddTaskCallback = useCallback((newTask: ISchedulerTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setIsTaskDialogOpen(false);
  }, []);

  const handleRemoveTaskCallback = useCallback((taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }, []);

  return (
    <>
      <SchedulerTasksHeader onOpenDialog={setIsTaskDialogOpen} />
      <div className="mt-4">
        {loading ? (
          <UploadListSkeleton />
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-sm text-muted-foreground">
            <GoTasklist size={32} />
            <span>{`No scheduler tasks found. Use the "Add Task" button to add one.`}</span>
          </div>
        ) : (
          <ul className="w-full grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task, index) => (
              <div key={index} className="w-full">
                <SchedulerTaskCard
                  user={user}
                  task={task}
                  onDeleteTaskCallback={handleRemoveTaskCallback}
                />
              </div>
            ))}
          </ul>
        )}

        <SchedulerTaskDialog
          user={user}
          assistants={assistants}
          open={isTaskDialogOpen}
          onOpenChange={setIsTaskDialogOpen}
          onCreateTaskCallback={handleAddTaskCallback}
        />
      </div>
    </>
  );
}

export default SchedulerTasksList;
