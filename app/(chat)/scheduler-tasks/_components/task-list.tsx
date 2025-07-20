'use client';

import React, { useState } from 'react';
import { User } from 'next-auth';
import { UploadListSkeleton } from '@/components/skeleton/upload-list-skeleton';
import { GoTasklist } from 'react-icons/go';
import SchedulerTaskCard from './task-card';
import SchedulerTaskDialog from './task-dialog';
import { ISchedulerTask } from '@/types/scheduler-task';
import SchedulerTasksHeader from './header';

export interface SchedulerTasksListProps {
  user: User;
}

function SchedulerTasksList(props: SchedulerTasksListProps) {
  const { user } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState<boolean>(false);
  const [tasks, setTasks] = useState<ISchedulerTask[]>([]);

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
          <div className="flex flex-col w-full px-2 md:px-4 justify-start items-center gap-2">
            {tasks.map((task, index) => (
              <div key={index} className="w-full">
                <SchedulerTaskCard task={task} />
              </div>
            ))}
          </div>
        )}

        <SchedulerTaskDialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen} />
      </div>
    </>
  );
}

export default SchedulerTasksList;
