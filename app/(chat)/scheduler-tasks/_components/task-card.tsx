'use client';

import { ISchedulerTask } from '@/types/scheduler-task';
import React from 'react';

export interface SchedulerTasksListProps {
  task: ISchedulerTask;
}
function SchedulerTaskCard(props: SchedulerTasksListProps) {
  const { task } = props;

  return <div></div>;
}

export default SchedulerTaskCard;
