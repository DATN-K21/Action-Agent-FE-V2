'use client';

import { useEffect } from 'react';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import useChatStore from '@/store/chat-store';
import { User } from 'next-auth';
import { IMessage } from '@/types/ai';
import { useAssistantStore } from '@/store/assistant-store';

interface ChatProps {
  id: string;
  assistantId: string;
  user: User;
  initialMessages: IMessage[];
}

export function Chat(props: ChatProps) {
  const { id, assistantId, user, initialMessages } = props;

  const messages = useChatStore((state) => state.messages);
  const status = useChatStore((state) => state.status);
  const isCreatingThread = useChatStore((state) => state.isCreatingThread);
  const setMessages = useChatStore((state) => state.setMessages);
  const setThreadId = useChatStore((state) => state.setThreadId);
  const setAssistant = useChatStore((state) => state.setAssistant);
  const reloadChat = useChatStore((state) => state.reloadChat);

  const assistants = useAssistantStore((state) => state.assistants);

  useEffect(() => {
    reloadChat();
    setThreadId(id);
    setMessages(initialMessages);
  }, [id, assistantId, initialMessages, reloadChat, setMessages, setThreadId, setAssistant]);

  useEffect(() => {
    const assistant = assistants.find((assistant) => assistant.id === assistantId) || assistants[0];
    setAssistant(assistant?.id);
  }, [assistants]);

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
