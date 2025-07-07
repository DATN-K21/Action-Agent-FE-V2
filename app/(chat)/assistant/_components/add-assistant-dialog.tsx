import { useState, useMemo } from 'react';
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
import { createAssistant } from '@/services/assistant-service';
import { User } from 'next-auth';
import { toast } from '@/components/toast';
import { IMCP } from '@/types/mcp';
import { IConnectedExtension } from '@/types/extension';
import { AssistantType } from '@/constants/assistant-constant';

type AddAssistantDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extensionOptions?: IConnectedExtension[];
  mcpOptions?: IMCP[];
  type: AssistantType;
  user: User;
  onAssistantCreated?: () => void;
};

export function AddAssistantDialog({
  open,
  onOpenChange,
  extensionOptions,
  mcpOptions,
  user,
  onAssistantCreated,
}: AddAssistantDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [workerIds, setWorkerIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const mcpChoice = useMemo(() => {
    return (
      mcpOptions?.map((mcp) => ({
        name: mcp.mcpName,
        key: mcp.id,
      })) || []
    );
  }, [mcpOptions]);

  const handleSave = async () => {
    if (!name) {
      toast({
        description: 'Please provide a name for your assistant.',
        type: 'error',
      });
      return;
    }

    if (!description) {
      toast({
        description: 'Please provide a description for your assistant.',
        type: 'error',
      });
      return;
    }

    // if (!workerIds.length) {
    //   toast({
    //     description: `Please select at least one ${type === 'extension' ? 'extension' : 'MCP server'}.`,
    //     type: 'error',
    //   });
    //   return;
    // }

    setIsLoading(true);

    try {
      const payload = { name, description };

      await createAssistant({ user, payload });

      toast({
        description: 'Assistant created successfully',
        type: 'success',
      });

      // Reset form
      setName('');
      setDescription('');
      setWorkerIds([]);

      // Close dialog
      onOpenChange(false);

      // Refresh assistants list
      if (onAssistantCreated) {
        onAssistantCreated();
      }
    } catch (error) {
      console.error('Error creating assistant:', error);
      toast({
        description: 'Failed to create assistant. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] w-[95%] max-w-full mx-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
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

          {/* Extensions or MCP Servers */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className="pt-1.5">Extensions</Label>

            {/* <MultiSelect
              options={extensionsChoice}
              values={workerIds}
              onChange={setWorkerIds}
              className="w-full max-w-sm"
            /> */}
            <Label className="pt-1.5">MCP Servers</Label>
            <MultiSelect
              options={mcpChoice}
              values={workerIds}
              onChange={setWorkerIds}
              className="w-full max-w-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Assistant'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
