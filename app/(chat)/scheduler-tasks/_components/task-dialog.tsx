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
import { useEffect, useMemo, useState } from 'react';
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
  prompt?: string;
};

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function SchedulerTaskDialog(props: SchedulerTaskDialogProps) {
  const { open, onOpenChange } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const [taskData, setTaskData] = useState<ISchedulerTaskPayload>({} as ISchedulerTaskPayload);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [timePickerType, setTimePickerType] = useState<SchedulerTaskTimePickerTypes>(
    SchedulerTaskTimePickerTypes.DAILY,
  );
  const displayEnum = (value: string): string => {
    // Remove underscores and capitalize each word
    return value
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleOnChange = (field: string, value: any) => {
    setTaskData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  useEffect(() => {
    // Reset task data when dialog opens
    if (open) {
      setTaskData({
        name: '',
        description: '',
        cron_expression: '',
        prompt: '',
        timezone: userTimezone || 'UTC',
        job_type: SchedulerTaskTypes.ONE_TIME,
      });
      setErrors({});
      setTimePickerType(SchedulerTaskTimePickerTypes.DAILY);
    }
  }, [open]);

  useEffect(() => {
    handleOnChange(
      'job_type',
      timePickerType === SchedulerTaskTimePickerTypes.ONE_TIME
        ? SchedulerTaskTypes.ONE_TIME
        : SchedulerTaskTypes.RECURRING,
    );
  }, [timePickerType]);

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

          {/* Prompt */}
          <div className="grid w-full max-w-md items-center gap-1.5">
            <Label htmlFor="prompt" className="pt-1.5">
              Prompt
            </Label>
            <Textarea
              id="prompt"
              value={taskData.prompt}
              onChange={(e) => handleOnChange('prompt', e.target.value)}
              className={cn(
                'col-span-3',
                errors.prompt && 'border-red-500 focus-visible:ring-red-500',
              )}
              placeholder="What does this task do?"
            />
            {errors.prompt && <p className="text-sm text-red-500 mt-1">{errors.prompt}</p>}
          </div>

          <div className="flex justify-between items-center w-full max-w-md gap-2">
            {/* Time Picker Type */}
            <div className="w-full flex flex-col gap-1">
              <Label htmlFor="time-picker-type" className="w-full">
                When to trigger
              </Label>
              <div>
                <Select
                  value={timePickerType}
                  onValueChange={(value) =>
                    setTimePickerType(value as SchedulerTaskTimePickerTypes)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{displayEnum(timePickerType)}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value={SchedulerTaskTimePickerTypes.ONE_TIME}>
                      <div className="flex items-center gap-4">
                        <span>One Time</span>
                      </div>
                    </SelectItem>
                    <SelectItem value={SchedulerTaskTimePickerTypes.DAILY}>
                      <div className="flex items-center gap-4">
                        <span>Daily</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Time Picker */}
            {timePickerType === SchedulerTaskTimePickerTypes.DAILY && (
              <DailyTaskTimePicker onChange={onHandleUpdateTimePicker} />
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
