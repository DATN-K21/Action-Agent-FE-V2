'use client';

import { useEffect } from 'react';
import { LogoSpinner } from './logo-spinner';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import useChatStore from '@/store/chat-store';
import { User } from 'next-auth';
import { IMessage } from '@/types/ai';
import { useAssistantStore } from '@/store/assistant-store';
import { TeamType } from '@/constants/ai-constant';

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
  const setTeamId = useChatStore((state) => state.setTeamId);
  const setThreadId = useChatStore((state) => state.setThreadId);
  const setAssistant = useChatStore((state) => state.setAssistant);
  const reloadChat = useChatStore((state) => state.reloadChat);

  const assistants = useAssistantStore((state) => state.assistants);

  useEffect(() => {
    reloadChat();
    setThreadId(id);
    setMessages(initialMessages);
  }, [assistants, assistantId]);

  useEffect(() => {
    const assistant = assistants.find((assistant) => assistant.id === assistantId) || assistants[0];

    setAssistant(assistant);

    const teamId =
      assistant?.teams?.find((team) => team.workflow_type === TeamType.CHATBOT)?.id || '';
    setTeamId(teamId);
  }, [assistants]);

  return (
    <>
      {isCreatingThread ? (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
          <LogoSpinner />
        </div>
      ) : (
        <>
          <Messages status={status} messages={messages} user={user} />
          <form className="flex mx-auto bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-4xl">
            <MultimodalInput user={user} status={status} />
          </form>
        </>
      )}
    </>
  );
}
