'use client';

import { Icons } from '@/components/icon';
import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { AnimatePresence, motion } from 'framer-motion';
import { User } from 'next-auth';
import { memo, useEffect, useMemo, useState } from 'react';
import { SparklesIcon } from './icons';
import { IMessageInterruptPayload } from '@/types/assistant';

const formatArgumentKey = (key: string): string => {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface ActionArg {
  key: string;
  value: any;
  label: string;
  component: JSX.Element;
}

interface ToolCallProps {
  name: string;
  args: Record<string, any>;
  id: string;
  type: string;
}

const PureActionConfirmation = ({ message, user }: { message: IMessage; user: User }) => {
  const status = useChatStore((state) => state.status);
  const handleInterruptTeam = useChatStore((state) => state.handleInterruptTeam);

  console.log(message);

  const firstToolCall = useMemo<ToolCallProps>((): ToolCallProps => {
    return message.tool_calls?.[0] || {};
  }, [message.tool_calls]);

  const pureArgs = useMemo((): Record<string, any> => {
    if (!firstToolCall || !firstToolCall.args) {
      return {};
    }

    return Object.keys(firstToolCall.args).reduce((acc: Record<string, any>, key: string) => {
      if (['string', 'number'].includes(typeof firstToolCall.args[key]) === true) {
        acc[key] = firstToolCall.args[key];
      }
      return acc;
    }, {});
  }, [firstToolCall]);

  const argTextInputElements = useMemo<ActionArg[]>((): ActionArg[] => {
    if (!pureArgs || Object.keys(pureArgs).length === 0) {
      return [];
    }

    return Object.keys(pureArgs).map((key: string) => {
      const value = pureArgs[key];
      const isUsingTextArea = typeof value === 'string' && value.length > 50;
      return {
        key: key,
        value: value,
        label: formatArgumentKey(key),
        component: isUsingTextArea ? (
          <Textarea
            value={value}
            onChange={(e) => setArgs((prev: any) => ({ ...prev, [key]: e.target.value }))}
            className="mt-1 w-full"
            disabled={status !== ChatStatus.READY}
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => setArgs((prev: any) => ({ ...prev, [key]: e.target.value }))}
            className="mt-1 w-full"
            disabled={status !== ChatStatus.READY}
          />
        ),
      };
    });
  }, [pureArgs, status]);

  const [args, setArgs] = useState(pureArgs);

  useEffect(() => {
    setArgs(firstToolCall.args || {});
  }, [firstToolCall.args]);

  const handleInterruptAction = async (type: InterruptDecisionType) => {
    const interruptPayload: IMessageInterruptPayload = {
      messages: [],
      interrupt: {
        interaction_type:
          message.name === InterruptType.TOOL_REVIEW
            ? InterruptType.TOOL_REVIEW.toString()
            : InterruptType.CONTEXT_INPUT.toString(),
        decision: (type || InterruptDecisionType.REJECTED).toString(),
        tool_message: JSON.stringify(args),
      },
    };
    try {
      await handleInterruptTeam(user, interruptPayload);
      toast({
        type: 'success',
        description: `Action ${type} successfully.`,
      });
    } catch (error) {
      toast({
        type: 'error',
        description: `Failed to make ${type} action.`,
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        data-testid="message-action-confirmation"
        className="w-full mx-auto max-w-4xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={MessageType.AI}
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
                  <p className="p-2 border rounded bg-gray-100">
                    {firstToolCall?.name || 'Unknown Action'}
                  </p>
                </div>

                {argTextInputElements &&
                  argTextInputElements.length > 0 &&
                  argTextInputElements.map((arg: ActionArg) => {
                    return (
                      <div key={arg.key}>
                        <label className="font-semibold">{arg.label}</label>
                        {arg.component}
                      </div>
                    );
                  })}

                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleInterruptAction(InterruptDecisionType.REJECTED)}
                    disabled={status !== ChatStatus.READY}
                  >
                    {status !== ChatStatus.READY && (
                      <Icons.spinner className="mr-2 size-4 animate-spin" />
                    )}
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleInterruptAction(InterruptDecisionType.UPDATE)}
                    disabled={status !== ChatStatus.READY}
                  >
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
