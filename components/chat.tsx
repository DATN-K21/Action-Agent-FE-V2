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
  assistantId: string;
  user: User;
  initialMessages: IMessage[];
  extensionName?: string;
}

export function Chat(props: ChatProps) {
  const { id, assistantId, user, initialMessages, extensionName } = props;

  const messages = useChatStore((state) => state.messages);
  const status = useChatStore((state) => state.status);
  const isCreatingThread = useChatStore((state) => state.isCreatingThread);
  const setMessages = useChatStore((state) => state.setMessages);
  const setThreadId = useChatStore((state) => state.setThreadId);
  const setExtension = useChatStore((state) => state.setExtension);
  const setSelectedAssistant = useChatStore((state) => state.setSelectedAssistant);
  const reloadChat = useChatStore((state) => state.reloadChat);

  useEffect(() => {
    reloadChat();
    setThreadId(id);
    setMessages(initialMessages);
    setExtension(extensionName as ExtensionType);
    setSelectedAssistant(assistantId);
  }, [
    id,
    assistantId,
    initialMessages,
    extensionName,
    reloadChat,
    setMessages,
    setThreadId,
    setExtension,
    setSelectedAssistant,
  ]);

  return (
    <>
      {isCreatingThread ? (
        <>
          <div className="flex flex-col items-center justify-center h-screen text-center px-4">
            <h1 className="text-2xl font-bold">Creating thread ...</h1>
            <p className="text-gray-500 mt-2" role="status" aria-live="polite">
              Please wait while we create the thread.
            </p>
            <div className="loader mt-4" />
          </div>
        </>
      ) : (
        <>
          <Messages status={status} messages={messages} user={user} />
          <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-4xl">
            <MultimodalInput user={user} status={status} />
          </form>
        </>
      )}
    </>
  );
}
