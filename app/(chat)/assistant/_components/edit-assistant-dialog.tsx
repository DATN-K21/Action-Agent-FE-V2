import { useState, useEffect, useMemo } from 'react';
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
import { User } from 'next-auth';
import { IAssistant } from '@/types/assistant';
import { updateAssistant } from '@/services/assistant-service';
import { toast } from '@/components/toast';
import { MultiSelect } from './multiple-select';
import { IConnectedExtension } from '@/types/extension';
import { IMCP } from '@/types/mcp';

type EditAssistantDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assistant: IAssistant | null;
  user: User;
  extensionOptions?: IConnectedExtension[];
  mcpOptions?: IMCP[];
  onAssistantUpdated?: () => void;
};

export function EditAssistantDialog({
  open,
  onOpenChange,
  assistant,
  user,
  extensionOptions,
  mcpOptions,
  onAssistantUpdated,
}: EditAssistantDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [workerIds, setWorkerIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (assistant) {
      setName(assistant.name || '');
      setDescription(assistant.description || '');
      setWorkerIds(
        assistant.workers?.map((worker) => {
          return worker.id;
        }) || [],
      );
    }
  }, [assistant]);

  const mcpChoice = useMemo(() => {
    if (!mcpOptions || mcpOptions.length === 0) {
      return [];
    }

    return mcpOptions.map((mcp) => ({
      name: mcp.mcpName,
      key: mcp.id,
    }));
  }, [mcpOptions]);

  const handleSave = async () => {
    if (!assistant) return;

    if (!name) {
      toast({
        description: 'Please provide a name for your assistant.',
        type: 'error',
      });
      return;
    }

    // if (!workerIds || workerIds.length === 0) {
    //   const hasOptions =
    //     assistant?.type === AssistantType.EXTENSION
    //       ? extensionsChoice.length > 0
    //       : mcpChoice.length > 0;

    //   if (hasOptions) {
    //     toast({
    //       description: `Please select at least one ${assistant?.type === 'extension' ? 'extension' : 'MCP server'}.`,
    //       type: 'error',
    //     });
    //     return;
    //   }
    // }

    try {
      setIsLoading(true);
      const payload = {
        name,
        description,
      };

      await updateAssistant({
        user,
        assistantId: assistant.id,
        payload,
      });

      toast({
        description: 'Assistant updated successfully',
        type: 'success',
      });

      // Close dialog
      onOpenChange(false);

      // Refresh assistants list
      if (onAssistantUpdated) {
        onAssistantUpdated();
      }
    } catch (error) {
      console.error('Error updating assistant:', error);
      toast({
        description: 'Failed to update assistant. Please try again.',
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
          <DialogTitle>Edit Assistant</DialogTitle>
          <DialogDescription>
            Update your assistant details and modify connected extensions or MCP servers.
          </DialogDescription>
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
          {assistant && (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label className="pt-1.5">Extensions</Label>
              {/* <>
                <MultiSelect
                  options={extensionsChoice}
                  values={workerIds}
                  onChange={setWorkerIds}
                  className="w-full max-w-sm"
                />
                {extensionsChoice.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    No extensions available. Please connect some extensions first.
                  </p>
                )}
              </> */}
              <Label className="pt-1.5">MCP Servers</Label>
              <>
                <MultiSelect
                  options={mcpChoice}
                  values={workerIds}
                  onChange={setWorkerIds}
                  className="w-full max-w-sm"
                />
                {mcpChoice.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    No MCP servers available. Please connect some MCP servers first.
                  </p>
                )}
              </>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
