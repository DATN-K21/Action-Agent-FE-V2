'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icon';
import { Extension, IExtensionAction, extensionActionList } from '@/constants/data';
import { activeExtension, getExtensionActions } from '@/services/extension-service';
import { User } from 'next-auth';
import { IActiveExtensionResponse, IGetExtensionActionsResponse } from '@/types/extension';
import useChatStore from '@/store/chat-store';
import { generateUUID } from '@/lib/utils';
import { ThreadType } from '@/constants/extension-constant';
import { toast } from '@/components/toast';
import { useRouter } from 'next/navigation';

interface ExtensionDialogProps {
  user: User;
  extension?: Extension;
  isOpen: boolean;
  onClose: () => void;
}

const ExtensionDialog: React.FC<ExtensionDialogProps> = ({ user, extension, isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [extensionActions, setExtensionActions] = useState<IExtensionAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const createThread = useChatStore((state) => state.createThread);
  const router = useRouter();

  useEffect(() => {
    if (extension) {
      setIsConnected(extension.connected || false);
      fetchExtensionActions();
    }
  }, [extension]);

  const fetchExtensionActions = async () => {
    if (!user || !extension) return;
    setIsLoading(true);
    try {
      const response: IGetExtensionActionsResponse = await getExtensionActions({ user, extension });
      setExtensionActions(
        extensionActionList.filter((action) => response.actions.includes(action.key)),
      );
    } catch (error) {
      toast({ type: 'error', description: 'Failed to fetch extension actions' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickConnect = useCallback(async () => {
    if (isConnected) return;
    setIsLoading(true);
    try {
      const response: IActiveExtensionResponse = await activeExtension({ user, extension });

      // Check if the extension is already connected
      if (response?.isExisted) {
        toast({ type: 'error', description: 'Extension is already connected' });
        return;
      }

      // Redirect to the extension's connection URL
      toast({ type: 'info', description: 'Redirecting to connect to extension...' });
      window.location.href = response.redirectUrl;
      setIsConnected(true);
    } catch (error) {
      toast({ type: 'error', description: 'Failed to connect to extension' });
    } finally {
      onClose();
      setIsLoading(false);
    }
  }, [user, extension, isConnected, onClose]);

  const handleClickStartChat = async () => {
    if (!extension) return;

    try {
      const threadId = generateUUID();
      await createThread(user, threadId, `New ${extension.name} Chat`, extension.key as ThreadType);
      toast({ type: 'success', description: `Starting chat with ${extension.name}` });
      router.push(`/chat/${threadId}/${extension.key}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast({ type: 'error', description: 'Failed to start chat' });
    } finally {
      onClose();
    }
  };

  if (!isOpen || !extension) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[350px] md:max-w-[680px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{extension.name}</DialogTitle>
          <DialogDescription>{`Integrate ${extension.name} into your chat!`}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Card className="w-full md:w-[600px] overflow-y-auto max-h-[50vh]">
            <CardContent className="grid gap-4 p-4">
              {extensionActions.map((action) => (
                <div
                  key={action.key}
                  className="mb-1 grid grid-cols-[25px_1fr] items-start pb-1 last:mb-0 last:pb-0"
                >
                  <span className="flex size-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{action.name}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <DialogFooter>
          <Button onClick={handleClickConnect} disabled={isConnected || isLoading}>
            {isLoading && <Icons.spinner className="mr-2 size-4 animate-spin" />} Connect
          </Button>
          <Button
            className="bg-green-600 text-white hover:bg-green-700"
            disabled={!isConnected || isLoading}
            onClick={handleClickStartChat}
          >
            Start Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExtensionDialog;
