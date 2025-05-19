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
import { ThreadType } from '@/constants/extension-constant';
import { toast } from '@/components/toast';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { ActionSkeleton } from '@/components/skeleton/action-skeleton';

interface ExtensionDialogProps {
  user: User;
  extension?: Extension;
  isOpen: boolean;
  onClose: () => void;
  onDisconnect: () => Promise<void>;
}

const ExtensionDialog: React.FC<ExtensionDialogProps> = ({
  user,
  extension,
  isOpen,
  onClose,
  onDisconnect,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [extensionActions, setExtensionActions] = useState<IExtensionAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false); // Add actionLoading state
  const createThread = useChatStore((state) => state.createThread);
  const router = useRouter();

  const fetchExtensionActions = async () => {
    if (!user || !extension) return;

    setActionLoading(true);
    try {
      const response: IGetExtensionActionsResponse = await getExtensionActions({ user, extension });
      setExtensionActions(
        extensionActionList.filter((action) => response.actions.includes(action.key)),
      );
    } catch (error) {
      toast({ type: 'error', description: 'Failed to fetch extension actions' });
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (extension) {
      setIsConnected(extension.connected || false);
      fetchExtensionActions();
    }
  }, [extension]);

  const handleClickConnect = useCallback(async () => {
    if (isConnected || !extension) return;
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

  const handleClickDisconnect = useCallback(async () => {
    if (!isConnected) return;
    setIsLoading(true);

    try {
      await onDisconnect();
      toast({ type: 'success', description: 'Extension disconnected successfully' });
    } catch (error) {
      toast({ type: 'error', description: 'Failed to disconnect to extension' });
    } finally {
      onClose();
      setIsLoading(false);
    }
  }, [user, extension, isConnected, onClose, onDisconnect]);

  const handleClickStartChat = async () => {
    if (!extension) return;

    try {
      const threadId = uuidv4();
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
              {actionLoading ? (
                Array(4)
                  .fill(0)
                  .map((_, index) => <ActionSkeleton key={`action-skeleton-${index}`} />)
              ) : extensionActions.length > 0 ? (
                extensionActions.map((action) => (
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
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No actions available for this extension
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <DialogFooter>
          {isConnected ? (
            <Button onClick={handleClickDisconnect} disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 size-4 animate-spin" />} Disconnect
            </Button>
          ) : (
            <Button onClick={handleClickConnect} disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 size-4 animate-spin" />} Connect
            </Button>
          )}
          <Button
            className="bg-green-600 text-white hover:bg-green-700 mb-2"
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
