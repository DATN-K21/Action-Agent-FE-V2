'use client';

import type { Attachment, Message } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { ChatHeader } from '@/components/chat-header';
import { fetcher, generateUUID } from '@/lib/utils';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import { toast } from 'sonner';

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  // initialMessages: Array<Message>;
  initialMessages: Array<any>;
}) {
  const [messages, setMessages] = useState<Array<Message>>(initialMessages);
  const [input, setInput] = useState<string>('');
  const { append, stop, status } = useChat({ id, initialMessages });
  const { mutate } = useSWRConfig();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  const handleSubmit = async () => {
    if (input.trim() === '' && attachments.length === 0) {
      return;
    }

    const message: any = {
      id: generateUUID(),
      role: 'user',
      content: input,
      attachments,
    };
  }

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader
          chatId={id}
        />

        <Messages
          chatId={id}
          status={status}
          messages={messages}
          setMessages={setMessages}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          <MultimodalInput
            chatId={id}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            status={status}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            setMessages={setMessages}
            append={append}
          />
        </form>
      </div>
    </>
  );
}
