'use client';

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
      <DialogContent className="w-[98vw] sm:w-[95vw] max-w-[450px] md:max-w-[700px] max-h-[80vh] sm:max-h-[75vh] p-3 sm:p-4 md:p-6 flex flex-col">
        <DialogHeader className="space-y-1 sm:space-y-2 pb-2 shrink-0">
          <DialogTitle className="uppercase text-sm sm:text-base md:text-lg font-bold text-center sm:text-left">
            {extension.name}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm md:text-base text-center sm:text-left">
            {`Integrate ${extension.name} into your chat!`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {actionLoading ? (
              <div className="space-y-3 p-2">
                {Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <ActionSkeleton key={`action-skeleton-${index}`} />
                  ))}
              </div>
            ) : extensionActions.length > 0 ? (
              <div className="space-y-3 sm:space-y-4 p-2 pb-4">
                {extensionActions.map((action) => (
                  <div
                    key={action.enum}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex size-2 translate-y-2 rounded-full bg-sky-500 shrink-0" />
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-semibold leading-tight break-words hyphens-auto">
                        {action.name.toUpperCase()}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words hyphens-auto">
                        {action.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[180px] sm:h-[200px] text-center p-4">
                <div className="space-y-2">
                  <p className="text-sm sm:text-base text-muted-foreground">
                    No actions available for this extension
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This extension may not have any configured actions yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-3 sm:pt-4 border-t bg-white/80 backdrop-blur-sm shrink-0 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
          <div className="w-full flex justify-center sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="w-full sm:w-auto min-h-[40px]"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExtensionDialog;
