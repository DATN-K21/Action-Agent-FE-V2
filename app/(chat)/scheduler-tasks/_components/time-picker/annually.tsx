import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SchedulerTaskTimePickerProps } from '@/types/scheduler-task';
import { useMemo, useState } from 'react';

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')) as string[];
const MINUTES = Array.from({ length: 12 }, (_, i) =>
  (i * 5).toString().padStart(2, '0'),
) as string[];
const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')) as string[];
const MONTHS = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, '0'),
) as string[];

function AnnuallyTaskTimePicker(props: SchedulerTaskTimePickerProps) {
  const { onChange } = props;

  const [selectedMonth, setSelectedMonth] = useState<string>('01');
  const [selectedDay, setSelectedDay] = useState<string>('01');
  const [selectedHour, setSelectedHour] = useState<string>('00');
  const [selectedMinute, setSelectedMinute] = useState<string>('00');

  const displayedDays = useMemo(() => {
    const SAMPLE_YEAR = 2023; // Example year to calculate days in month
    const monthIndex = parseInt(selectedMonth, 10) - 1;
    const lastDate = new Date(SAMPLE_YEAR, monthIndex + 1, 0);
    const lastDayInMonth = lastDate.getDate();

    if (selectedDay === '00' || parseInt(selectedDay, 10) > lastDayInMonth) {
      setSelectedDay(lastDayInMonth.toString().padStart(2, '0'));
    }
    return DAYS.slice(0, lastDayInMonth);
  }, [selectedDay, selectedMonth]);

  const handleTimeChange = (type: 'month' | 'day' | 'hour' | 'minute', value: string) => {
    let builtCronExpression = '';
    if (type === 'hour') {
      setSelectedHour(value);
      builtCronExpression = `${selectedMinute} ${value} ${selectedDay} ${selectedMonth} *`;
    } else if (type === 'minute') {
      setSelectedMinute(value);
      builtCronExpression = `${value} ${selectedHour} ${selectedDay} ${selectedMonth} *`;
    } else if (type === 'day') {
      setSelectedDay(value);
      builtCronExpression = `${selectedMinute} ${selectedHour} ${value} ${selectedMonth} *`;
    } else if (type === 'month') {
      setSelectedMonth(value);
      builtCronExpression = `${selectedMinute} ${selectedHour} ${selectedDay} ${value} *`;
    }
    onChange(builtCronExpression);
  };

  return (
    <>
      <div className="w-full flex justify-stretch gap-2">
        <div className="flex flex-col w-1/2 gap-1">
          <Label htmlFor="monthly-month-picker" className="w-full">
            Month & Day
          </Label>
          <div className="flex justify-between items-center w-full gap-2">
            <div className="w-1/2">
              <Select
                value={selectedMonth}
                onValueChange={(value) => handleTimeChange('month', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{selectedMonth}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="end">
                  {MONTHS.map((month, index) => (
                    <SelectItem key={index} value={month}>
                      <div className="flex items-center gap-4">
                        <span>{month}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Select value={selectedDay} onValueChange={(value) => handleTimeChange('day', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{selectedDay}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="end">
                  {displayedDays.map((day, index) => (
                    <SelectItem key={index} value={day}>
                      <div className="flex items-center gap-4">
                        <span>{day}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-1/2 gap-1">
          <Label htmlFor="daily-time-picker" className="w-full">
            Hour & Minute
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

export default AnnuallyTaskTimePicker;
