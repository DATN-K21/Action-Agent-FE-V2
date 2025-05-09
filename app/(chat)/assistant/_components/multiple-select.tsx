import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Option = {
  name: string;
  key: string;
};

type MultiSelectProps = {
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
};

export function MultiSelect({
  options,
  values,
  onChange,
  placeholder = 'Select items',
  className = '',
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const toggleOption = (value: string) => {
    onChange(values.includes(value) ? values.filter((v) => v !== value) : [...values, value]);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative + ${className}`} ref={dropdownRef}>
      <Button
        variant="outline"
        className={cn(
          'w-full h-auto whitespace-normal flex flex-wrap items-center justify-start gap-2 border rounded-md p-2 text-left',
          open && 'ring-2 ring-ring',
        )}
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {values.length > 0 ? (
            options
              .filter((opt) => values.includes(opt.key))
              .map((opt) => (
                <span key={opt.key} className="bg-muted rounded px-2 py-0.5 text-sm">
                  {opt.name}
                </span>
              ))
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center justify-center h-full">
          <ChevronsUpDown className="h-4 w-4 opacity-50 mt-1" />
        </div>
      </Button>

      {open && (
        <div className="no-scrollbar absolute z-50 mt-1 w-full max-h-28 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
          {options.map((opt) => {
            const isSelected = values.includes(opt.key);
            return (
              <div
                key={opt.key}
                onClick={() => toggleOption(opt.key)}
                className={cn(
                  'flex cursor-pointer select-none items-center justify-between px-3 py-2 text-sm hover:bg-muted',
                  isSelected && 'bg-muted font-medium',
                )}
              >
                <span>{opt.name}</span>
                {isSelected && <Check className="h-4 w-4 text-primary" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
