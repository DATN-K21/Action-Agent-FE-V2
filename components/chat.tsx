'use client';

import type { Attachment } from 'ai';
import { useEffect, useState } from 'react';
import { ChatHeader } from '@/components/chat-header';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import useChatStore from '@/store/chat-store';
import { User } from 'next-auth';
import { IMessage } from '@/types/ai';
import { Extension, extensions } from '@/constants/data';
import { MultimodalStreamInput } from './multimodal-stream-input';

interface ChatProps {
  id: string;
  user: User;
  initialMessages: IMessage[];
  extensionName?: string;
}

export function Chat(props: ChatProps) {
  const { id, user, initialMessages, extensionName } = props;
  const { messages, status, setMessages, setThreadId } = useChatStore();
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const [extension, setExtension] = useState<Extension | undefined>(undefined);

  useEffect(() => {
    setMessages(initialMessages);
    setThreadId(id);

    if (extensionName) {
      const ext: Extension | undefined = extensions.find((ext) => ext.key === extensionName);
      if (ext) {
        setExtension(ext);
      }
    }
  }, [extensionName]);

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

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-4xl">
          {extension
            ? <MultimodalStreamInput
              user={user}
              extension={extension}
              status={status}
              attachments={attachments}
              setAttachments={setAttachments}
            />
            : <MultimodalInput
              chatId={id}
              user={user}
              status={status}
              attachments={attachments}
              setAttachments={setAttachments}
            />
          }
        </form>
      </div>
    </>
  );
}
