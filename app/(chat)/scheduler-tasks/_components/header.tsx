'use client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export interface SchedulerTasksHeaderProps {
  onOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

function SchedulerTasksHeader(props: SchedulerTasksHeaderProps) {
  const { onOpenDialog } = props;

  return (
    <div className="w-full flex row items-between justify-between mt-2">
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">Scheduler Tasks</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Manage your scheduler tasks and get notified when they are triggered with Action Agent.
        </p>
      </div>
      <Button className="w-full md:w-auto" size="sm" onClick={() => onOpenDialog(true)}>
        <Plus className="mr-2 size-4" /> Add Task
      </Button>
    </div>
  );
}

export default SchedulerTasksHeader;
