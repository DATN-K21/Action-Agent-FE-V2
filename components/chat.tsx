'use client';

import { useEffect } from 'react';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import useChatStore from '@/store/chat-store';
import { User } from 'next-auth';
import { IMessage } from '@/types/ai';
import { ExtensionType } from '@/constants/extension-constant';
import { useAssistantStore } from '@/store/assistant-store';

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
  const isCreatingThread = useChatStore((state) => state.isCreatingThread);
  const setMessages = useChatStore((state) => state.setMessages);
  const setThreadId = useChatStore((state) => state.setThreadId);
  const setExtension = useChatStore((state) => state.setExtension);
  const reloadChat = useChatStore((state) => state.reloadChat);
  const generalAssistants = useAssistantStore((state) => state.generalAssistants);
  const fetchAssistants = useAssistantStore((state) => state.fetchAssistants);

  console.log('fetch General Assistants', generalAssistants);

  useEffect(() => {
    reloadChat();
    setMessages(initialMessages);
    setThreadId(id);
    setExtension(extensionName as ExtensionType);
    fetchAssistants(user);
  }, [reloadChat, initialMessages, id, extensionName, setMessages, setThreadId, setExtension]);

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
            <MultimodalInput chatId={id} user={user} status={status} />
          </form>
        </>
      )}
    </>
  );
}
