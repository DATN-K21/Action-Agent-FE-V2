'use client';

import React, { useEffect, useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Extension, IExtensionAction, extensionActionList } from '@/constants/data';
import { activeExtension, getExtensionActions } from '@/services/extension-service';
import { User } from 'next-auth';
import { IActiveExtension, IGetExtensionActions } from '@/types/extension';
import useChatStore from '@/store/chat-store';
import { generateUUID } from '@/lib/utils';
import { ThreadType } from '@/constants/extension-constant';
const features = [
  {
    title: 'Send email',
    description: 'You can send an email to other users.',
  },
  {
    title: 'Delete email',
    description: 'You can delete an email.',
  },
  {
    title: 'Mark email as read',
    description: 'You can mark an email as read.',
  },
];

interface ExtensionDialogProps {
  user: User;
  extension: Extension | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const ExtensionDialog: React.FC<ExtensionDialogProps> = ({ user, extension, isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(extension?.connected || false);
  const [extensionActions, setExtensionActions] = useState<IExtensionAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { createThread } = useChatStore();

  const { toast } = useToast();

  useEffect(() => {
    if (!user || !extension) {
      console.log('User or extension not found');
      return;
    }

    setIsConnected(extension.connected || false);
    const fetchExtensionActions = async () => {
      setIsLoading(true);

      try {
        const extensionActionsResponse: IGetExtensionActions = await getExtensionActions({ user, extension });
        const actualExtensionActions: IExtensionAction[] = extensionActionList.filter(
          action => extensionActionsResponse?.actions.includes(action.key)
        );
        setExtensionActions(actualExtensionActions);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchExtensionActions();
  }, [extension, user]);

  const handleClickConnect = async () => {
    if (isConnected) {
      return; // User have already connected to this extension
    }

    try {
      const responseData: IActiveExtension = await activeExtension({ user, extension });
      if (!responseData || !responseData.redirectUrl) {
        throw new Error('Failed to connect to extension');
      } else if (responseData.isExisted) {
        throw new Error('Extension is already connected');
      }

      onClose();
      window.location.href = responseData.redirectUrl;
      setIsConnected(true);
      toast({ variant: 'success', title: 'Success', description: 'Connected to extension' });
    } catch (error) {
      console.log(error);
      toast({ variant: 'error', title: 'Error', description: 'Failed to connect to extension' })
    }
  };

  const handleClickStartChat = async () => {
    if (!extension) {
      return;
    }

    // Start new thread
    const newThreadId = generateUUID();
    try {
      await createThread(user, newThreadId, `New ${extension.name} Chat`, extension.key as ThreadType);
      toast({ variant: 'success', title: 'Success', description: 'Chat started' });
      window.location.replace(`/chat/${extension.key}/${newThreadId}`);
    } catch (error) {
      console.error('Error creating thread: ', error);
      toast({ variant: 'error', title: 'Error', description: 'Failed to create chat' });
    } finally {
      onClose();
    }
  }

  if (!isOpen || !extension) {
    return null;
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] md:max-w-[680px] overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle> {extension.name} </DialogTitle>
          <DialogDescription>{`Integrate ${extension.name} into your chat!`}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Card className="w-full md:w-[600px]">
            <CardContent className="grid gap-4 p-4">
              <div>
                {extensionActions.map((action, index) => (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex size-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{action.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleClickConnect} disabled={isConnected}>
            {isLoading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
            Connect
          </Button>
          <Button type="button" style={{ backgroundColor: "green", color: "white" }} disabled={!isConnected} onClick={handleClickStartChat}>
            {isLoading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
            Start chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ExtensionDialog
