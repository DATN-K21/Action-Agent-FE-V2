'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo } from 'react';
import useChatStore from '@/store/chat-store';

interface SuggestedActionsProps {
  onSubmission: () => Promise<void>;
}

function SuggestedActionsSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={`skeleton-${index}`} className={index > 1 ? 'hidden sm:block' : 'block'}>
          <div className="border rounded-xl px-4 py-3.5 h-auto flex flex-col gap-1 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PureSuggestedActions({ onSubmission }: SuggestedActionsProps) {
  const setInput = useChatStore((state) => state.setInput);
  const assistant = useChatStore((state) => state.assistant);

  const suggestedActions = [
    {
      title: 'What are the advantages',
      label: 'of using Next.js?',
      action: 'What are the advantages of using Next.js?',
    },
    {
      title: 'Write code to',
      label: `demonstrate djikstra's algorithm`,
      action: `Write code to demonstrate djikstra's algorithm`,
    },
    {
      title: 'Help me write an essay',
      label: `about silicon valley`,
      action: `Help me write an essay about silicon valley`,
    },
    {
      title: 'What is the weather',
      label: 'in San Francisco?',
      action: 'What is the weather in San Francisco?',
    },
  ];

  if (!assistant) {
    return <SuggestedActionsSkeleton />;
  }

  return (
    <div data-testid="suggested-actions" className="grid sm:grid-cols-2 gap-2 w-full">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async (event) => {
              event.preventDefault();
              if (!assistant) {
                return;
              }
              setInput(suggestedAction.action);
              await onSubmission();
            }}
            disabled={!assistant}
            className={`text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start ${
              !assistant ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">{suggestedAction.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, (prevProps, nextProps) => {
  return prevProps.onSubmission === nextProps.onSubmission;
});
