import { ChatStatus, MessageType } from '@/constants/ai-constant';
import { IMessage } from '@/types/ai';
import { Root as AccordionRoot } from '@radix-ui/react-accordion';
import equal from 'fast-deep-equal';
import { ArrowDown } from 'lucide-react';
import { User } from 'next-auth';
import { memo, useEffect, useState } from 'react';
import { ThinkingMessage } from './message';
import MessageContainer from './message-container';
import { Overview } from './overview';
import { useScrollToBottom } from './use-scroll-to-bottom';

interface MessagesProps {
  status: ChatStatus;
  messages: Array<IMessage>;
  user: User;
}

function PureMessages({ status, messages, user }: MessagesProps) {
  const { containerRef, endRef, isAtBottom, scrollToBottom } = useScrollToBottom<HTMLDivElement>();
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);

  useEffect(() => {
    scrollToBottom('smooth');
    setSelectedMessageIds(messages.map((message) => message.id));
  }, [messages, scrollToBottom]);

  return (
    <div ref={containerRef} className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4">
      {messages.length === 0 && <Overview />}

      <AccordionRoot
        type="multiple"
        value={selectedMessageIds}
        onValueChange={setSelectedMessageIds}
      >
        {messages.map((message, index) => (
          <div key={message.id} className="mb-4">
            <MessageContainer
              status={status}
              message={message}
              user={user}
              isLastMessage={index === messages.length - 1}
            />
          </div>
        ))}
      </AccordionRoot>

      {(status === ChatStatus.SUBMITTED ||
        (messages[messages.length - 1]?.content === '' &&
          messages[messages.length - 1]?.type === MessageType.AI &&
          status === ChatStatus.STREAMING)) && <ThinkingMessage />}

      <div ref={endRef} className="shrink-0 min-h-[24px]" />

      {!isAtBottom && (
        <button
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-[20%] right-1/2 z-10 rounded-full bg-white shadow-md border border-gray-300 p-2 hover:bg-gray-100 transition"
        >
          <ArrowDown className="size-5 text-gray-600" />
        </button>
      )}
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.status && nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;

  return true;
});
