'use client';

import { Icons } from '@/components/icon';
import { ActionSkeleton } from '@/components/skeleton/action-skeleton';
import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IExtensionAction } from '@/constants/data';
import { activeExtension, getExtensionActions } from '@/services/extension-service';
import { IActiveExtensionResponse, IExtension } from '@/types/extension';
import { User } from 'next-auth';
import React, { useCallback, useEffect, useState } from 'react';

interface ExtensionDialogProps {
  user: User;
  extension?: IExtension;
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

  useEffect(() => {
    if (!user || !extension) return;

    const fetchExtensionActions = async () => {
      setActionLoading(true);
      try {
        const extensionActions: IExtensionAction[] = await getExtensionActions({ user, extension });
        console.log('Fetched Extension Actions: ', extensionActions);
        setExtensionActions(extensionActions || []);
      } catch (error) {
        toast({ type: 'error', description: 'Failed to fetch extension actions' });
      } finally {
        setActionLoading(false);
      }
    };

    setIsConnected(extension.connected || false);
    fetchExtensionActions();
  }, [extension, user]);

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

  }, [isConnected, onClose, onDisconnect]);

  if (!isOpen || !extension) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[350px] md:max-w-[680px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{extension.name}</DialogTitle>
          <DialogDescription>{`Integrate ${extension.name} into your chat!`}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Card className="w-full md:w-[600px] overflow-y-auto h-[50vh]">
            <CardContent className="grid gap-4 p-4 h-full">
              {actionLoading ? (
                Array(4)
                  .fill(0)
                  .map((_, index) => <ActionSkeleton key={`action-skeleton-${index}`} />)
              ) : extensionActions.length > 0 ? (
                extensionActions.map((action) => (
                  <div
                    key={action.enum}
                    className="mb-1 grid grid-cols-[25px_1fr] items-start pb-1 last:mb-0 last:pb-0"
                  >
                    <span className="flex size-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {action.name.toUpperCase()}
                      </p>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-full text-center py-4 text-muted-foreground items-center justify-center">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExtensionDialog;
