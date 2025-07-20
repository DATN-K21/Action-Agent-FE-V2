import { SchedulerTaskStatus, SchedulerTaskTypes } from '@/constants/scheduler-task';

export interface ISchedulerTask {
  id: string;
  name: string;
  prompt: string;
  assistantId: string;
  teamId: string;
  cronExpression: string;
  jobType: SchedulerTaskTypes;
  status: SchedulerTaskStatus;
  timezone: string;
  isActive: boolean;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  lastRunAt?: string | null;
  nextRunAt?: string | null;
  description?: string;
  maxRetries?: number;
  timeoutSeconds?: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userRole?: string;
}

export interface SchedulerTaskTimePickerProps {
  onChange: (builtCronExpression: string | null) => void;
}
