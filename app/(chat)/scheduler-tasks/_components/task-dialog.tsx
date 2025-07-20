'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { SchedulerTaskTimePickerTypes, SchedulerTaskTypes } from '@/constants/scheduler-task';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DailyTaskTimePicker from './time-picker/daily';

export interface SchedulerTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ISchedulerTaskPayload {
  name: string;
  description: string;
  cron_expression: string;
  prompt: string;
  timezone: string;
  job_type: SchedulerTaskTypes;
}

type ValidationErrors = {
  name?: string;
  description?: string;
};

function SchedulerTaskDialog(props: SchedulerTaskDialogProps) {
  const { open, onOpenChange } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const [taskData, setTaskData] = useState<ISchedulerTaskPayload>({
    name: '',
    description: '',
    cron_expression: '',
    prompt: '',
    timezone: 'UTC',
    job_type: SchedulerTaskTypes.ONE_TIME,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [timePickerType, setTimePickerType] = useState<SchedulerTaskTimePickerTypes>(
    SchedulerTaskTimePickerTypes.DAILY,
  );

  const handleOnChange = (field: string, value: any) => {
    setTaskData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === 'job_type' && value === SchedulerTaskTypes.ONE_TIME) {
      setTimePickerType(SchedulerTaskTimePickerTypes.ONE_TIME);
    }
  };

  const onHandleUpdateTimePicker = (builtCronExpression: string | null) => {
    if (builtCronExpression) {
      setTaskData((prev) => ({
        ...prev,
        cron_expression: builtCronExpression,
      }));
    }
  };

  const handleSave = async () => {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-screen-toast-mobile w-[95%] max-w-full mx-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add Scheduler Task</DialogTitle>
          <DialogDescription>Provide scheduler task details.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col justify-center items-center gap-4 px-6">
          {/* Name */}
          <div className="grid w-full max-w-md items-center gap-1.5">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={taskData.name}
              onChange={(e) => handleOnChange('name', e.target.value)}
              className={cn(
                'col-span-3',
                errors.name && 'border-red-500 focus-visible:ring-red-500',
              )}
              placeholder="Task name"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="grid w-full max-w-md items-center gap-1.5">
            <Label htmlFor="description" className="pt-1.5">
              Description
            </Label>
            <Textarea
              id="description"
              value={taskData.description}
              onChange={(e) => handleOnChange('description', e.target.value)}
              className={cn(
                'col-span-3',
                errors.description && 'border-red-500 focus-visible:ring-red-500',
              )}
              placeholder="What does this task do?"
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="flex justify-between items-center w-full max-w-md gap-2">
            {/* Job Type */}
            <Select
              value={taskData.job_type}
              onValueChange={(value) => handleOnChange('job_type', value as SchedulerTaskTypes)}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Task Type</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value={SchedulerTaskTypes.ONE_TIME}>
                  <div className="flex items-center gap-4">
                    <span>One time</span>
                  </div>
                </SelectItem>
                <SelectItem value={SchedulerTaskTypes.RECURRING}>
                  <div className="flex items-center gap-4">
                    <span>Recurring</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Time Picker */}
            {timePickerType === SchedulerTaskTimePickerTypes.DAILY && (
              <DailyTaskTimePicker
                onChange={onHandleUpdateTimePicker}
                timePickerType={timePickerType}
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button disabled={loading} onClick={() => handleSave()}>
            {loading ? 'Saving...' : 'Save Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SchedulerTaskDialog;
