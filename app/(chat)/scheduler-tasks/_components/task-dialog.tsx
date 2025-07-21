'use client';
import { toast } from '@/components/toast';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SchedulerTaskTimePickerTypes, SchedulerTaskTypes } from '@/constants/scheduler-task';
import { cn, displayEnum, extractCronExpression } from '@/lib/utils';
import {
  CreateSchedulerTaskParams,
  createTask,
  updateSchedulerTask,
  UpdateSchedulerTaskParams,
} from '@/services/scheduler-service';
import { IAssistant, ITeamProps } from '@/types/assistant';
import { User } from 'next-auth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DailyTaskTimePicker from './time-picker/daily';
import { ISchedulerTask, SchedulerTaskTimeDataProps } from '@/types/scheduler-task';
import WeeklyTaskTimePicker from './time-picker/weekly';
import MonthlyTaskTimePicker from './time-picker/monthly';
import AnnuallyTaskTimePicker from './time-picker/annually';
import OneTimeTaskTimePicker from './time-picker/onetime';

export interface SchedulerTaskDialogProps {
  user: User;
  assistants: IAssistant[];
  open: boolean;
  task: ISchedulerTask | null;
  onOpenChange: (open: boolean) => void;
  onTaskCompletedCallback: (task: ISchedulerTask) => void;
}

export interface ISchedulerTaskPayload {
  name: string;
  description: string;
  cron_expression: string;
  prompt: string;
  team_id: string;
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
  const { user, assistants, open, task, onOpenChange, onTaskCompletedCallback } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const status = useMemo(() => (task !== null ? 'edit' : 'create'), [task]);
  const [taskTimeData, setTaskTimeData] = useState<SchedulerTaskTimeDataProps | null>(null);

  const [taskData, setTaskData] = useState<ISchedulerTaskPayload>({} as ISchedulerTaskPayload);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [timePickerType, setTimePickerType] = useState<SchedulerTaskTimePickerTypes>(
    SchedulerTaskTimePickerTypes.DAILY,
  );
  const [selectedAssistant, setSelectedAssistant] = useState<IAssistant | null>(null);
  const [selectedTeamAssistant, setSelectedTeamAssistant] = useState<ITeamProps | null>(null);

  const handleOnChange = useCallback((field: string, value: any) => {
    setTaskData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  useEffect(() => {
    // Reset task data when dialog opens
    if (open === false) {
      return;
    }
    setTaskData({
      name: task?.name || '',
      description: task?.description || '',
      cron_expression: task?.cronExpression || '',
      prompt: task?.prompt || '',
      team_id: task?.teamId || '',
      assistant_id: task?.assistantId || '',
      job_type: task?.jobType || SchedulerTaskTypes.RECURRING,
      timezone: task?.timezone || userTimezone || 'UTC',
    });
    setErrors({});

    if (!task) {
      setTimePickerType(SchedulerTaskTimePickerTypes.DAILY);
      setTaskTimeData(null);
      return;
    }
    const { type, time } = extractCronExpression(task);
    setTimePickerType(type);
    setTaskTimeData(time);
  }, [open, task]);

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
    setTaskData((prev) => ({
      ...prev,
      assistant_id: selectedAssistant?.id || '',
    }));
  }, [selectedAssistant]);

  useEffect(() => {
    setTaskData((prev) => ({
      ...prev,
      team_id: selectedTeamAssistant?.id || '',
    }));
  }, [selectedTeamAssistant]);

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

    const payload: CreateSchedulerTaskParams = {
      user,
      payload: {
        ...taskData,
        timezone: userTimezone || 'UTC',
      },
    };
    try {
      if (status === 'create') {
        await handleCreateNewTask(payload);
      } else {
        await handleUpdateTask({
          ...payload,
          id: task?.id || '',
        } as UpdateSchedulerTaskParams);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleCreateNewTask = useCallback(
    async (payload: CreateSchedulerTaskParams): Promise<void> => {
      try {
        const response: ISchedulerTask = await createTask(payload);
        toast({
          description: 'Scheduler task created successfully',
          type: 'success',
        });
        onTaskCompletedCallback?.(response);
      } catch (error) {
        console.error('Error saving task:', error);
      }
    },
    [onTaskCompletedCallback],
  );
  const handleUpdateTask = useCallback(
    async (payload: UpdateSchedulerTaskParams): Promise<void> => {
      try {
        const response: ISchedulerTask = await updateSchedulerTask(payload);
        toast({
          description: 'Scheduler task updated successfully',
          type: 'success',
        });
        onTaskCompletedCallback?.(response);
      } catch (error) {
        console.error('Error updating task:', error);
        toast({
          description: 'Failed to update task, please try again',
          type: 'error',
        });
      }
    },
    [onTaskCompletedCallback],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-screen-toast-mobile w-[95%] max-w-full mx-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {status === 'create' ? 'Add Scheduler Task' : 'Edit Scheduler Task'}
          </DialogTitle>
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
                    <SelectValue placeholder="Select Assistant">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {selectedAssistant?.name ?? 'Select Assistant'}
                        </span>
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

          {/* Assistant Team */}
          <div className="grid w-full max-w-md items-center gap-1.5">
            <div className="w-full flex flex-col gap-1">
              <Label htmlFor="team" className="w-full">
                Tool <span className="text-red-500">*</span>
              </Label>
              <div>
                <Select
                  value={selectedTeamAssistant?.id || ''}
                  onValueChange={(value) =>
                    setSelectedTeamAssistant(
                      selectedAssistant?.teams?.find((team) => team.id === value) || null,
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Tool">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {selectedTeamAssistant?.id
                            ? displayEnum(selectedTeamAssistant.name.slice(37))
                            : 'Select Tool'}
                        </span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align="end">
                    {selectedAssistant &&
                    selectedAssistant.teams &&
                    selectedAssistant?.teams?.length > 0 ? (
                      selectedAssistant.teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          <div className="flex items-center gap-4">
                            <span className="text-sm" title={team.name}>
                              {displayEnum(team.name.replace(team.id, ''))}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No tools available</span>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center w-full max-w-md gap-2">
            {/* Time Picker Type */}
            <div className="w-1/4 flex flex-col gap-1">
              <Label htmlFor="time-picker-type" className="w-full">
                When <span className="text-red-500">*</span>
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
                    <SelectItem value={SchedulerTaskTimePickerTypes.WEEKLY}>
                      <div className="flex items-center gap-4">
                        <span>Weekly</span>
                      </div>
                    </SelectItem>
                    <SelectItem value={SchedulerTaskTimePickerTypes.MONTHLY}>
                      <div className="flex items-center gap-4">
                        <span>Monthly</span>
                      </div>
                    </SelectItem>
                    <SelectItem value={SchedulerTaskTimePickerTypes.ANNUALLY}>
                      <div className="flex items-center gap-4">
                        <span>Annually</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Time Picker */}
            <div className="w-3/4">
              {timePickerType === SchedulerTaskTimePickerTypes.ONE_TIME && (
                <OneTimeTaskTimePicker
                  onChange={onHandleUpdateTimePicker}
                  timeData={taskTimeData}
                />
              )}
              {timePickerType === SchedulerTaskTimePickerTypes.DAILY && (
                <DailyTaskTimePicker onChange={onHandleUpdateTimePicker} timeData={taskTimeData} />
              )}
              {timePickerType === SchedulerTaskTimePickerTypes.WEEKLY && (
                <WeeklyTaskTimePicker onChange={onHandleUpdateTimePicker} timeData={taskTimeData} />
              )}
              {timePickerType === SchedulerTaskTimePickerTypes.MONTHLY && (
                <MonthlyTaskTimePicker
                  onChange={onHandleUpdateTimePicker}
                  timeData={taskTimeData}
                />
              )}
              {timePickerType === SchedulerTaskTimePickerTypes.ANNUALLY && (
                <AnnuallyTaskTimePicker
                  onChange={onHandleUpdateTimePicker}
                  timeData={taskTimeData}
                />
              )}
            </div>
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
