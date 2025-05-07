import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MultiSelect } from './multiple-select';
import { extensions } from '@/constants/data';
type Option = {
  appName: string;
  value: string;
};

type mcpOption = {
  mcpName: string;
  value: string;
};

type AddAssistantDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extensionOptions?: Option[];
  mcpOptions?: mcpOption[];
  type?: 'extension' | 'mcp-server';
};

export function AddAssistantDialog({
  open,
  onOpenChange,
  extensionOptions,
  type = 'extension',
  mcpOptions,
}: AddAssistantDialogProps) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [selectedExtensions, setSelectedExtensions] = React.useState<string[]>([]);
  const [comboboxOpen, setComboboxOpen] = React.useState(false);

  const extensionsChoice = React.useMemo(() => {
    return extensions.filter((extension) =>
      extensionOptions?.some((option) => option.appName === extension.key),
    );
  }, [extensions, extensionOptions]);

  console.log('extensionsChoice:', extensionsChoice);

  const toggleExtension = (value: string) => {
    setSelectedExtensions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleSave = () => {
    const data = {
      name,
      description,
      extensions: selectedExtensions,
    };

    console.log('Assistant created:', data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add Assistant</DialogTitle>
          <DialogDescription>Provide assistant details and choose extensions.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col justify-center items-center gap-4 px-6">
          {/* Name */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Assistant name"
            />
          </div>

          {/* Description */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="description" className="pt-1.5">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="What does this assistant do?"
            />
          </div>

          {/* Extensions */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className="pt-1.5">{type === 'extension' ? 'Extensions' : 'MCP Servers'}</Label>
            {type === 'extension' ? (
              <MultiSelect
                options={extensionsChoice}
                values={selectedExtensions}
                onChange={setSelectedExtensions}
                className="w-full max-w-sm"
              />
            ) : (
              mcpOptions && (
                <MultiSelect
                  options={mcpOptions?.map((mcp) => ({
                    name: mcp.mcpName,
                    key: mcp.value,
                  }))}
                  values={selectedExtensions}
                  onChange={setSelectedExtensions}
                  className="w-full max-w-sm"
                />
              )
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Save Assistant</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
