import { DateTimePicker } from '@/components/date-time-picker';
import { Label } from '@/components/ui/label';
import { SchedulerTaskTimePickerProps } from '@/types/scheduler-task';
import React, { useEffect } from 'react';

function OneTimeTaskTimePicker(props: SchedulerTaskTimePickerProps) {
  const { onChange: onUpdate, timeData } = props;

  const [initialDate, setInitialDate] = React.useState<Date>(new Date());

  useEffect(() => {
    if (timeData) {
      const date = new Date();
      date.setHours(+timeData.hour || 0);
      date.setMinutes(+timeData.minute || 0);
      date.setSeconds(0);
      date.setDate(+timeData.dayOfMonth || 1);
      date.setMonth(+timeData.month - 1 || 0);
      setInitialDate(date);
    }
  }, [timeData]);

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
        initialDate={initialDate}
        onChange={(date: Date | undefined) => {
          if (!date) return;
          handleChange(date);
        }}
      />
    </div>
  );
}

export default OneTimeTaskTimePicker;
