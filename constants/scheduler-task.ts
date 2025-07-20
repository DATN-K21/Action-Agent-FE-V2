export enum SchedulerTaskTypes {
  ONE_TIME = 'one_time',
  RECURRING = 'recurring',
}

export enum SchedulerTaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
}

export enum SchedulerTaskTimePickerTypes {
  ONE_TIME = 'one_time',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ANNUALLY = 'annually',
}
