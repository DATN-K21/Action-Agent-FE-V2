'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, memo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ChatStatus, MessageRole } from '@/constants/ai-constant';
import { SparklesIcon } from './icons';
import useChatStore from '@/store/chat-store';
import { User } from 'next-auth';
import { toast } from '@/components/toast';
import { Icons } from '@/components/icon';
import { extensionActionList } from '@/constants/data';

const formatArgumentKey = (key: string): string => {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getActionName = (actionKey: string): string => {
  const action = extensionActionList.find((action) => action.key === actionKey);
  return action ? action.name : actionKey;
};

const PureActionConfirmation = ({ toolCalls, user }: { toolCalls: any[]; user: User }) => {
  const status = useChatStore((state) => state.status);
  const handleStreamInterrupt = useChatStore((state) => state.handleStreamInterrupt);

  const firstToolCall = toolCalls[0] || {};
  const pureArgs = firstToolCall.args || {};

  const [args, setArgs] = useState(pureArgs);
  const actionKey = firstToolCall.name || 'Unknown Action';
  const actionName = getActionName(actionKey);

  useEffect(() => {
    setArgs(firstToolCall.args || {});
  }, [toolCalls, firstToolCall.args]);

  const handleConfirmAction = async () => {
    try {
      const toolCallsData = toolCalls.map((toolCall) => ({
        name: toolCall.name,
        args: { ...toolCall.args, ...args },
        id: toolCall.id,
        type: toolCall.type,
      }));

      await handleStreamInterrupt(user, toolCallsData);
    } catch (error) {
      toast({
        type: 'error',
        description: 'Failed to confirm action.',
      });
    }
  };

  const handleCancelAction = () => {
    toast({ type: 'info', description: 'Action canceled.' });
  };

  return (
    <AnimatePresence>
      <motion.div
        data-testid="message-action-confirmation"
        className="w-full mx-auto max-w-4xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={MessageRole.AI}
      >
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
            <SparklesIcon size={14} />
          </div>

          <div className="flex flex-col gap-4 w-full">
            <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl shadow-md">
              <CardHeader>
                <CardTitle>Confirm Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold">Action Type:</p>
                  <p className="p-2 border rounded bg-gray-100">{actionName}</p>
                </div>

                {Object.keys(pureArgs).map((key) => (
                  <div key={key}>
                    <label className="font-semibold">{formatArgumentKey(key)}</label>
                    {pureArgs[key] && pureArgs[key].length > 50 ? (
                      <Textarea
                        value={args[key]}
                        onChange={(e) =>
                          setArgs((prev: any) => ({ ...prev, [key]: e.target.value }))
                        }
                        className="mt-1 w-full"
                        disabled={status !== ChatStatus.READY}
                      />
                    ) : (
                      <Input
                        value={args[key]}
                        onChange={(e) =>
                          setArgs((prev: any) => ({ ...prev, [key]: e.target.value }))
                        }
                        className="mt-1 w-full"
                        disabled={status !== ChatStatus.READY}
                      />
                    )}
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCancelAction}
                    disabled={status !== ChatStatus.READY}
                  >
                    {status !== ChatStatus.READY && (
                      <Icons.spinner className="mr-2 size-4 animate-spin" />
                    )}
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmAction} disabled={status !== ChatStatus.READY}>
                    {status !== ChatStatus.READY && (
                      <Icons.spinner className="mr-2 size-4 animate-spin" />
                    )}
                    Confirm
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const ActionConfirmation = memo(PureActionConfirmation);
