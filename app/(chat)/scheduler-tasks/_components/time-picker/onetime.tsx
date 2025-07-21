import { DateTimePicker } from '@/components/date-time-picker';
import { Label } from '@/components/ui/label';
import { SchedulerTaskTimePickerProps } from '@/types/scheduler-task';
import React from 'react';

function OneTimeTaskTimePicker(props: SchedulerTaskTimePickerProps) {
  const { onChange: onUpdate } = props;

  const handleChange = (date: Date) => {
    const cronExpression = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;
    onUpdate(cronExpression);
  };
  return (
    <div className="w-full flex flex-col gap-1">
      <Label htmlFor="one-time-date-picker" className="w-full">
        Date & Time <span className="text-red-500">*</span>
      </Label>
      <DateTimePicker
        initialDate={new Date()}
        onChange={(date: Date | undefined) => {
          if (!date) return;
          console.log('Selected date:', date);
          handleChange(date);
        }}
      />
    </div>
  );
}

export default OneTimeTaskTimePicker;
