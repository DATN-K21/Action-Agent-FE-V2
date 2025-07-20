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
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { IAssistant } from '@/types/assistant';
import { CreateSchedulerTaskParams, createTask } from '@/services/scheduler-service';
import { User } from 'next-auth';
import { getAllAssistants, GetAssistantsParams } from '@/services/assistant-service';

export interface SchedulerTaskDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ISchedulerTaskPayload {
  name: string;
  description: string;
  cron_expression: string;
  prompt: string;
  assistant_id: string;
  timezone: string;
  job_type: SchedulerTaskTypes;
}

type ValidationErrors = {
  name?: string;
  prompt?: string;
};

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function SchedulerTaskDialog(props: SchedulerTaskDialogProps) {
  const { user, open, onOpenChange } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const [taskData, setTaskData] = useState<ISchedulerTaskPayload>({} as ISchedulerTaskPayload);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [timePickerType, setTimePickerType] = useState<SchedulerTaskTimePickerTypes>(
    SchedulerTaskTimePickerTypes.DAILY,
  );
  const [assistants, setAssistants] = useState<IAssistant[]>([]); // Assuming you will fetch assistants
  const [selectedAssistant, setSelectedAssistant] = useState<IAssistant | null>(null);

  const displayEnum = (value: string): string => {
    // Remove underscores and capitalize each word
    return value
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleOnChange = useCallback((field: string, value: any) => {
    setTaskData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  useEffect(() => {
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
          setSelectedAssistant(assistantsResponse[0]);
        }
      } catch (error) {
        console.error('Error fetching assistants:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssistants();
  }, [user]);

  useEffect(() => {
    // Reset task data when dialog opens
    if (open === false) {
      return;
    }
    setTaskData({
      name: '',
      description: '',
      cron_expression: '',
      prompt: '',
      assistant_id: '',
      timezone: userTimezone || 'UTC',
      job_type: SchedulerTaskTypes.ONE_TIME,
    });
    setErrors({});
    setTimePickerType(SchedulerTaskTimePickerTypes.DAILY);
  }, [open]);

  useEffect(() => {
    setTaskData((prev) => ({
      ...prev,
      job_type:
        timePickerType === SchedulerTaskTimePickerTypes.ONE_TIME
          ? SchedulerTaskTypes.ONE_TIME
          : SchedulerTaskTypes.RECURRING,
    }));
  }, [timePickerType]);

  useEffect(() => {
    if (selectedAssistant) {
      setTaskData((prev) => ({
        ...prev,
        assistant_id: selectedAssistant.id,
      }));
    }
  }, [selectedAssistant]);

  const onHandleUpdateTimePicker = (builtCronExpression: string | null) => {
    if (builtCronExpression) {
      setTaskData((prev) => ({
        ...prev,
        cron_expression: builtCronExpression,
      }));
    }
  };

  const validateSubmit = (): boolean => {
    setErrors({});

    // Basic validation
    const newErrors: ValidationErrors = {};
    if (!taskData.name) {
      newErrors.name = 'Name is required';
    }
    if (!taskData.prompt) {
      newErrors.prompt = 'Prompt is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return false;
    }

    return true;
  };
  const handleSave = async (): Promise<void> => {
    const isValid = validateSubmit();
    if (!isValid) {
      return;
    }
    setLoading(true);

    // Simulate API call
    try {
      // Here you would typically make an API call to save the task
      console.log('Saving task: ', taskData);
      // Reset form after saving
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

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
              Prompt <span className="text-red-500">*</span>
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

          {/* Assistant */}
          <div className="grid w-full max-w-md items-center gap-1.5">
            <div className="w-full flex flex-col gap-1">
              <Label htmlFor="time-picker-type" className="w-full">
                Assistant <span className="text-red-500">*</span>
              </Label>
              <div>
                <Select
                  value={selectedAssistant?.id || ''}
                  onValueChange={(value) =>
                    setSelectedAssistant(assistants.find((a) => a.id === value) || null)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{selectedAssistant?.name}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align="end">
                    {assistants.length > 0 ? (
                      assistants.map((assistant) => (
                        <SelectItem key={assistant.id} value={assistant.id}>
                          <div className="flex items-center gap-4">
                            <span>{assistant.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No assistants available</span>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center w-full max-w-md gap-2">
            {/* Time Picker Type */}
            <div className="w-full flex flex-col gap-1">
              <Label htmlFor="time-picker-type" className="w-full">
                When to trigger <span className="text-red-500">*</span>
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
