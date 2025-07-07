import { ChatStatus, MessageType } from '@/constants/ai-constant';
import { IMessage } from '@/types/ai';
import equal from 'fast-deep-equal';
import { ArrowDown } from 'lucide-react';
import { User } from 'next-auth';
import { memo, useEffect } from 'react';
import { ThinkingMessage } from './message';
import MessageContainer from './message-container';
import { Overview } from './overview';
import { useScrollToBottom } from './use-scroll-to-bottom';
import useChatStore from '@/store/chat-store';
import { ActionConfirmation } from './action-confirmation';

interface MessagesProps {
  status: ChatStatus;
  messages: Array<IMessage>;
  user: User;
}

function PureMessages({ status, messages, user }: MessagesProps) {
  const { containerRef, endRef, isAtBottom, scrollToBottom } = useScrollToBottom<HTMLDivElement>();
  const isInterrupting = useChatStore((state) => state.isInterrupting);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, scrollToBottom]);

  return (
    <div ref={containerRef} className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4">
      {messages.length === 0 && <Overview />}

      {messages.map((message, index) => (
        <div key={message.id}>
          <MessageContainer
            status={status}
            message={message}
            user={user}
            isLastMessage={index === messages.length - 1}
          />
        </div>
      ))}

      {(status === ChatStatus.SUBMITTED ||
        (!messages[messages.length - 1]?.content && status === ChatStatus.STREAMING)) && (
        <ThinkingMessage />
      )}

      {messages[messages.length - 1]?.type === MessageType.INTERRUPT &&
        (messages[messages.length - 1]?.tool_calls || messages[messages.length - 1]?.content) &&
        isInterrupting && (
          <ActionConfirmation message={messages[messages.length - 1]} user={user} />
        )}

      <div ref={endRef} className="shrink-0 min-h-[4px]" />

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
