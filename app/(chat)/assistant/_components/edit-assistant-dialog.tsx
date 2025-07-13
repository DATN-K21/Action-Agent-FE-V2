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
import * as Accordion from '@radix-ui/react-accordion';
import { Switch } from '@/components/ui/switch';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';

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
  const [mcpIds, setMcpIds] = useState<string[]>([]);
  const [extensionIds, setExtensionIds] = useState<string[]>([]);
  const [isInterrupt, setIsInterrupt] = useState(true);
  const [isAskHuman, setIsAskHuman] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastAssistantId, setLastAssistantId] = useState<string | null>(null);

  useEffect(() => {
    if (assistant && assistant.id !== lastAssistantId) {
      setName(assistant.name || '');
      setDescription(assistant.description || '');
      setMcpIds(assistant.mcpIds || []);
      setExtensionIds(assistant.extensionIds || []);
      setIsInterrupt(assistant.interrupt ?? true);
      setIsAskHuman(assistant.askHuman ?? true);
      setLastAssistantId(assistant.id);
    }
  }, [assistant, lastAssistantId]);

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

  const handleSave = async () => {
    if (!assistant) return;

    if (!name) {
      toast({
        description: 'Please provide a name for your assistant.',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name,
        description,
        supportUnits: ['searchbot', 'ragbot'],
        mcpIds,
        extensionIds,
        interrupt: isInterrupt,
        askHuman: isAskHuman,
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
    setIsLoading(false);
    onOpenChange(false);
    // Only clear fields if assistant changes, not on dialog close
    // (fields will be reset in useEffect if assistant changes)
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
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Assistant name"
            />
          </div>

          {/* Description */}
          <div className="grid w-full max-w-md items-center gap-1.5">
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
          {/* Advanced Settings */}
          <Accordion.Root type="single" collapsible className="w-full max-w-md">
            <Accordion.Item value="advanced" className="border rounded">
              <Accordion.Header>
                <Accordion.Trigger className="w-full flex items-center justify-between p-2 text-left text-sm">
                  Advanced settings
                  <span className="ml-2">▼</span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-2 pb-2 flex flex-row gap-2 justify-evenly">
                <div className="flex flex-row gap-2">
                  <Label htmlFor="chunk-size" className="flex justify-center items-center">
                    Interrupt
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={15} />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>
                        Allow the assistant to interrupt its own response if new user input arrives.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <Switch
                    id="interrupt"
                    checked={isInterrupt}
                    onCheckedChange={(checked) => {
                      setIsInterrupt(checked);
                    }}
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <Label htmlFor="chunk-overlap" className="flex justify-center items-center">
                    Ask human
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={15} />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>
                        Enable this to let the assistant ask for human help when it cannot answer a
                        question.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <Switch
                    id="ask-human"
                    checked={isAskHuman}
                    onCheckedChange={(checked) => {
                      setIsAskHuman(checked);
                    }}
                  />
                </div>
                {/* {advancedError && (
                  <span className="text-xs text-red-500 mt-1">{advancedError}</span>
                )} */}
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
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
