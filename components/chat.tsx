'use client';

import { useEffect } from 'react';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import useChatStore from '@/store/chat-store';
import { User } from 'next-auth';
import { IMessage } from '@/types/ai';
import { ExtensionType } from '@/constants/extension-constant';

interface ChatProps {
  id: string;
  user: User;
  initialMessages: IMessage[];
  extensionName?: string;
}

export function Chat(props: ChatProps) {
  const { id, user, initialMessages, extensionName } = props;
  const messages = useChatStore((state) => state.messages);
  const status = useChatStore((state) => state.status);
  const setMessages = useChatStore((state) => state.setMessages);
  const setThreadId = useChatStore((state) => state.setThreadId);
  const setExtension = useChatStore((state) => state.setExtension);
  const reloadChat = useChatStore((state) => state.reloadChat);

  useEffect(() => {
    reloadChat();
    setMessages(initialMessages);
    setThreadId(id);
    setExtension(extensionName as ExtensionType);
  }, []);

  return (
    <>
      <Messages chatId={id} status={status} messages={messages} user={user} />

      <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-4xl xl:max-w-6xl">
        <MultimodalInput chatId={id} user={user} status={status} />
      </form>
    </>
  );
}
