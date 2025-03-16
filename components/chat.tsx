'use client';

import type { Attachment } from 'ai';
import { useEffect, useState } from 'react';
import { ChatHeader } from '@/components/chat-header';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import useChatStore from '@/store/chat-store';
import { User } from 'next-auth';
import { IMessage } from '@/types/ai';

interface ChatProps {
  id: string;
  user: User;
  initialMessages: IMessage[];
}

export function Chat(props: ChatProps) {
  const { id, user, initialMessages } = props;
  const { messages, status, setMessages, setThreadId } = useChatStore();
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  useEffect(() => {
    setMessages(initialMessages);
    setThreadId(id);
  }, []);

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
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          <MultimodalInput
            chatId={id}
            user={user}
            status={status}
            attachments={attachments}
            setAttachments={setAttachments}
          />
        </form>
      </div>
    </>
  );
}
