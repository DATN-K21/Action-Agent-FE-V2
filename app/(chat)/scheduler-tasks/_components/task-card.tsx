'use client';

import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SchedulerTaskStatus } from '@/constants/scheduler-task';
import { displayEnum } from '@/lib/utils';
import { deleteSchedulerTask } from '@/services/scheduler-service';
import { ISchedulerTask } from '@/types/scheduler-task';
import { MoreHorizontal, Pencil, Play, Trash } from 'lucide-react';
import { User } from 'next-auth';
import { useMemo } from 'react';
import { GoTasklist } from 'react-icons/go';

const MAX_PROMPT_LENGTH = 40;

export interface SchedulerTasksListProps {
  user: User;
  task: ISchedulerTask;
  onEditTaskCallback: (task: ISchedulerTask) => void;
  onDeleteTaskCallback: (taskId: string) => void;
  onRunTaskCallback: (task: ISchedulerTask) => Promise<void>;
}
function SchedulerTaskCard(props: SchedulerTasksListProps) {
  const { user, task, onEditTaskCallback, onDeleteTaskCallback, onRunTaskCallback } = props;

  const TaskStatusBadgeComponent = useMemo<React.ReactNode>((): React.ReactNode => {
    let badgeClassName = 'p-2 rounded-lg text-xs font-medium ';
    switch (task.status) {
      case SchedulerTaskStatus.PENDING:
        badgeClassName += 'bg-yellow-100 text-yellow-750 ring-yellow-600/20 ring-inset';
        break;
      case SchedulerTaskStatus.RUNNING:
        badgeClassName += 'bg-blue-100 text-blue-750 ring-blue-600/20 ring-inset';
        break;
      case SchedulerTaskStatus.SUCCESS:
        badgeClassName += 'bg-green-100 text-green-750 ring-green-600/20 ring-inset';
        break;
      case SchedulerTaskStatus.FAILED:
        badgeClassName += 'bg-red-100 text-red-750 ring-red-600/20 ring-inset';
        break;
      case SchedulerTaskStatus.CANCELLED:
        badgeClassName += 'bg-gray-100 text-gray-750 ring-gray-600/20 ring-inset';
        break;
      case SchedulerTaskStatus.PAUSED:
        badgeClassName += 'bg-orange-100 text-orange-750 ring-orange-600/20 ring-inset';
        break;
      default:
        badgeClassName += 'bg-gray-100 text-gray-750 ring-gray-600/20 ring-inset';
    }

    return <span className={badgeClassName}>{task.status?.toLowerCase() ?? 'Unknown'}</span>;
  }, [task.status]);

  const displayedTaskPrompt = useMemo<string>((): string => {
    if (!task || !task.prompt) {
      return 'No prompt';
    }
    if (typeof task.prompt === 'string') {
      return task.prompt.length > MAX_PROMPT_LENGTH
        ? task.prompt.slice(0, MAX_PROMPT_LENGTH) + '...'
        : task.prompt;
    }
    return 'No prompt';
  }, [task]);

  const handleOnEdit = (task: ISchedulerTask) => {
    onEditTaskCallback(task);
  };

  const handleOnDelete = async (taskId: string) => {
    try {
      const isSuccess: boolean = await deleteSchedulerTask(user, taskId);
      if (isSuccess) {
        toast({
          description: 'Deleted successfully',
          type: 'success',
        });
        return onDeleteTaskCallback(taskId);
      }
      throw new Error('Failed to delete task');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        description: 'Failed to delete task, please try again',
        type: 'error',
      });
    }
  };

  const handleOnRunTask = async (task: ISchedulerTask) => {
    await onRunTaskCallback(task);
  };

  return (
    <li
      className="min-w-[320px] rounded-lg border p-4 hover:shadow-md hover:cursor-pointer hover:bg-gray-50 transition-all duration-200 ease-in-out list-none"
      style={{
        boxShadow: `
        inset 0px -3px 0px 0px #D6D6E7,
        0px 4px 8px -3px #2D23424D,
        0px 2px 4px 0px #2C234266
      `,
      }}
    >
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center rounded-lg bg-muted p-2`}>
            <GoTasklist size={24} />
          </div>
          {TaskStatusBadgeComponent}
          <span className="ml-2 text-xs text-gray-500">{displayEnum(task.jobType)}</span>
        </div>
        <div className={`flex size-10 items-center justify-center rounded-lg p-2`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            {/* Actions */}
            <DropdownMenuContent side="bottom" align="start" sideOffset={4}>
              {/* Edit */}
              <DropdownMenuItem onClick={() => handleOnEdit(task)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              {/* Run */}
              <DropdownMenuItem
                onClick={() => handleOnRunTask(task)}
                disabled={task.status === SchedulerTaskStatus.RUNNING}
              >
                <Play className="mr-2 size-4" />
                Run
              </DropdownMenuItem>
              {/* Delete */}
              <DropdownMenuItem
                className="text-red-600 focus:text-red-700"
                onClick={() => handleOnDelete(task.id)}
              >
                <Trash className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/*  Brief information */}
      <div className="mb-2 max-w-full">
        <h2 className="mb-1 font-semibold">{task.name}</h2>
        <p className="line-clamp-2 text-gray-500 text-sm">{displayedTaskPrompt}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-700 text-xs italic">
          {'Next: ' + (new Date(task?.nextRunAt ?? 0).toLocaleString() ?? 'Paused permanently.')}
        </span>
        <span className="text-gray-700 text-xs italic">{`Total runs: ${task.totalRuns ?? 0}`}</span>
      </div>
    </li>
  );
}

export default SchedulerTaskCard;
