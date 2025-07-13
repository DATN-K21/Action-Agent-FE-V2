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
import { cn } from '@/lib/utils';

type EditAssistantDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assistant: IAssistant | null;
  user: User;
  extensionOptions?: IConnectedExtension[];
  mcpOptions?: IMCP[];
  onAssistantUpdated?: () => void;
};

type ValidationErrors = {
  name?: string;
  description?: string;
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
  const [mcpIds, setMcpIds] = useState<string[]>([]);
  const [extensionIds, setExtensionIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (assistant) {
      setName(assistant.name || '');
      setDescription(assistant.description || '');
      setMcpIds(assistant.mcpIds || []);
      setExtensionIds(assistant.extensionIds || []);
    }
  }, [assistant]);

  const extensionsChoice = useMemo(() => {
    if (!extensionOptions || extensionOptions.length === 0) {
      return [];
    }

    return extensionOptions
      ?.filter((ext) => ext.connectionStatus === 'success')
      .map((ext) => ({
        name: ext.extensionName.charAt(0).toUpperCase() + ext.extensionName.slice(1),
        key: ext.id,
      }));
  }, [extensionOptions]);

  const mcpChoice = useMemo(() => {
    if (!mcpOptions || mcpOptions.length === 0) {
      return [];
    }

    return mcpOptions.map((mcp) => ({
      name: mcp.mcpName,
      key: mcp.id,
    }));
  }, [mcpOptions]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Assistant name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Assistant name must be at least 3 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 3) {
      newErrors.description = 'Description must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNameChange = (value: string) => {
    setName(value);
    // Clear name error when user starts typing
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    // Clear description error when user starts typing
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: undefined }));
    }
  };

  const handleSave = async () => {
    if (!assistant) return;

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        supportUnits: ['searchbot', 'ragbot'],
        mcpIds,
        extensionIds,
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
      handleClose();
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setMcpIds([]);
    setExtensionIds([]);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[600px] w-[95%] max-w-full mx-auto"
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
          <div className="grid w-full max-w-md items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={cn(
                'col-span-3',
                errors.name && 'border-red-500 focus-visible:ring-red-500',
              )}
              placeholder="Assistant name"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="grid w-full max-w-md items-center gap-1.5">
            <Label htmlFor="description" className="pt-1.5">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className={cn(
                'col-span-3',
                errors.description && 'border-red-500 focus-visible:ring-red-500',
              )}
              placeholder="What does this assistant do?"
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Extensions or MCP Servers */}
          {assistant && (
            <div className="grid w-full max-w-md items-center gap-1.5">
              <Label className="pt-1.5">Extensions</Label>
              <>
                <MultiSelect
                  options={extensionsChoice}
                  values={extensionIds}
                  onChange={setExtensionIds}
                  className="w-full max-w-md"
                />
                {extensionsChoice.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    No extensions available. Please connect some extensions first.
                  </p>
                )}
              </>
              <Label className="pt-1.5">MCP Servers</Label>
              <>
                <MultiSelect
                  options={mcpChoice}
                  values={mcpIds}
                  onChange={setMcpIds}
                  className="w-full max-w-md"
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
