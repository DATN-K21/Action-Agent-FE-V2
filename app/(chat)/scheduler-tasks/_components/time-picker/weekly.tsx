import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SchedulerTaskTimePickerProps } from '@/types/scheduler-task';
import { useState } from 'react';

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')) as string[];
const MINUTES = Array.from({ length: 12 }, (_, i) =>
  (i * 5).toString().padStart(2, '0'),
) as string[];
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as string[];

function WeeklyTaskTimePicker(props: SchedulerTaskTimePickerProps) {
  const { onChange, timeData } = props;

  const [selectedDay, setSelectedDay] = useState<string>(timeData?.dayOfWeek || 'MON');
  const [selectedHour, setSelectedHour] = useState<string>(timeData?.hour || '00');
  const [selectedMinute, setSelectedMinute] = useState<string>(timeData?.minute || '00');

  const handleTimeChange = (type: 'day' | 'hour' | 'minute', value: string) => {
    let builtCronExpression = '';
    if (type === 'hour') {
      setSelectedHour(value);
      builtCronExpression = `${selectedMinute} ${value} * * ${selectedDay}`;
    } else if (type === 'minute') {
      setSelectedMinute(value);
      builtCronExpression = `${value} ${selectedHour} * * ${selectedDay}`;
    } else if (type === 'day') {
      setSelectedDay(value);
      builtCronExpression = `${selectedMinute} ${selectedHour} * * ${value}`;
    }
    onChange(builtCronExpression);
  };

  return (
    <>
      <div className="w-full flex justify-stretch gap-2">
        <div className="flex flex-col w-1/2 gap-1">
          <Label htmlFor="weekly-day-picker" className="w-full">
            Day <span className="text-red-500">*</span>
          </Label>
          <Select value={selectedDay} onValueChange={(value) => handleTimeChange('day', value)}>
            <SelectTrigger className="w-full">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{selectedDay}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {DAYS.map((day, index) => (
                <SelectItem key={index} value={day}>
                  <div className="flex items-center gap-4">
                    <span>{day}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col w-1/2 gap-1">
          <Label htmlFor="daily-time-picker" className="w-full">
            Hour & Minute <span className="text-red-500">*</span>
          </Label>
          <div className="flex justify-between items-center w-full gap-2">
            <div className="w-1/2">
              <Select
                value={selectedHour}
                onValueChange={(value) => handleTimeChange('hour', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{selectedHour}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="end">
                  {HOURS.map((time, index) => (
                    <SelectItem key={index} value={time}>
                      <div className="flex items-center gap-4">
                        <span>{time}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Select
                value={selectedMinute}
                onValueChange={(value) => handleTimeChange('minute', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{selectedMinute}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="end">
                  {MINUTES.map((time, index) => (
                    <SelectItem key={index} value={time}>
                      <div className="flex items-center gap-4">
                        <span>{time}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WeeklyTaskTimePicker;
