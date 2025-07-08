'use client';

import { ActionSkeleton } from '@/components/skeleton/action-skeleton';
import { toast } from '@/components/toast';
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
import { getExtensionActions } from '@/services/extension-service';
import { IExtension } from '@/types/extension';
import { User } from 'next-auth';
import React, { useEffect, useState } from 'react';

interface ExtensionDialogProps {
  user: User;
  extension?: IExtension;
  isOpen: boolean;
  onClose: () => void;
}

const ExtensionDialog: React.FC<ExtensionDialogProps> = ({ user, extension, isOpen, onClose }) => {
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
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExtensionDialog;
