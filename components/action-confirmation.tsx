'use client';

import { Icons } from '@/components/icon';
import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ChatStatus,
  InterruptDecisionType,
  InterruptType,
  MessageType,
} from '@/constants/ai-constant';
import useChatStore from '@/store/chat-store';
import { IMessage } from '@/types/ai';
import { IMessageInterruptPayload } from '@/types/assistant';
import { AnimatePresence, motion } from 'framer-motion';
import { User } from 'next-auth';
import { memo, useEffect, useMemo, useState } from 'react';

interface ActionArg {
  key: string;
  value: string | number;
  label: string;
  component: JSX.Element;
}

interface ToolCallProps {
  name: string;
  args: Record<string, string | number>;
  id: string;
  type: string;
}

interface ActionConfirmationProps {
  message: IMessage;
  user: User;
}

const formatArgumentKey = (key: string): string => {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const PureActionConfirmation = ({ message, user }: ActionConfirmationProps) => {
  const status = useChatStore((state) => state.status);
  const handleInterruptTeam = useChatStore((state) => state.handleInterruptTeam);

  const firstToolCall = useMemo<ToolCallProps>(() => {
    return message.tool_calls?.[0] || { name: '', args: {}, id: '', type: '' };
  }, [message.tool_calls]);

  const [args, setArgs] = useState<Record<string, string | number>>(firstToolCall.args || {});

  useEffect(() => {
    setArgs(firstToolCall.args || {});
  }, [firstToolCall.args]);

  const handleInputChange = (key: string, value: string) => {
    setArgs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const argTextInputElements = useMemo(() => {
    return Object.entries(args).map(([key, value]) => ({
      key,
      value,
      label: formatArgumentKey(key),
      component:
        typeof value === 'string' && value.length > 50 ? (
          <Textarea
            key={`textarea-${key}`}
            value={value.toString()}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="mt-1 w-full"
            disabled={status !== ChatStatus.READY}
          />
        ) : (
          <Input
            key={`input-${key}`}
            value={value.toString()}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="mt-1 w-full"
            disabled={status !== ChatStatus.READY}
          />
        ),
    }));
  }, [args, status]);

  const handleInterruptAction = async (type: InterruptDecisionType) => {
    const interruptPayload: IMessageInterruptPayload = {
      messages: [],
      interrupt: {
        interaction_type:
          message.name === InterruptType.TOOL_REVIEW
            ? InterruptType.TOOL_REVIEW.toString()
            : InterruptType.CONTEXT_INPUT.toString(),
        decision: type.toString(),
        tool_message: JSON.stringify(args),
      },
    };

    try {
      await handleInterruptTeam(user, interruptPayload);
      toast({
        type: 'success',
        description: `Action "${firstToolCall.name}" (${type}) was performed successfully.`,
      });
    } catch (error) {
      toast({
        type: 'error',
        description: `Failed to perform action "${firstToolCall.name}" (${type}).`,
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        data-testid="message-action-confirmation"
        className="w-full mx-auto max-w-4xl"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={MessageType.AI}
      >
        <AlertDialog defaultOpen>
          <AlertDialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
            <AlertDialogHeader className="pb-4 space-y-4">
              <AlertDialogTitle className="text-xl font-[550]">
                Allow tool from "{firstToolCall.name}"?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-6">
              <div className="rounded-lg border bg-neutral-50 p-4">
                <p className="text-sm font-medium mb-3">Run {firstToolCall.name}</p>
                <div className="space-y-4">
                  {argTextInputElements.map((arg) => (
                    <div key={arg.key} className="space-y-2">
                      <label className="text-sm font-medium block">{arg.label}</label>
                      <div className="relative rounded-md focus-within:ring-2 focus-within:ring-offset-0 focus-within:ring-blue-500 focus-within:ring-opacity-50 transition-shadow duration-200">
                        {arg.component}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <AlertDialogFooter className="flex flex-row justify-end items-center gap-3 pt-4">
                <AlertDialogCancel
                  onClick={() => handleInterruptAction(InterruptDecisionType.REJECTED)}
                  disabled={status !== ChatStatus.READY}
                  className="hover:bg-neutral-100 transition-colors duration-200"
                >
                  {status !== ChatStatus.READY && (
                    <Icons.spinner className="mr-2 size-4 animate-spin" />
                  )}
                  Deny
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleInterruptAction(InterruptDecisionType.UPDATE)}
                  disabled={status !== ChatStatus.READY}
                  className="bg-black text-white hover:bg-neutral-800 transition-colors duration-200"
                >
                  {status !== ChatStatus.READY && (
                    <Icons.spinner className="mr-2 size-4 animate-spin" />
                  )}
                  Allow
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </AnimatePresence>
  );
};

export const ActionConfirmation = memo(PureActionConfirmation);
