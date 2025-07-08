import { ChatStatus, MessageType } from '@/constants/ai-constant';
import useChatStore from '@/store/chat-store';
import { IMessage } from '@/types/ai';
import equal from 'fast-deep-equal';
import { ArrowDown } from 'lucide-react';
import { User } from 'next-auth';
import { memo, useEffect, useRef } from 'react';
import { ActionConfirmation } from './action-confirmation';
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
  const isInterrupting = useChatStore((state) => state.isInterrupting);
  const previousMessagesLength = useRef(messages.length);

  useEffect(() => {
    const currentLength = messages.length;
    const hasNewMessage = currentLength > previousMessagesLength.current;
    const lastMessage = messages[messages.length - 1];

    const shouldAutoScroll =
      isAtBottom ||
      (hasNewMessage && lastMessage?.type === MessageType.AI) ||
      status === ChatStatus.STREAMING ||
      status === ChatStatus.SUBMITTED;

    if (shouldAutoScroll) {
      scrollToBottom('smooth');
    }

    previousMessagesLength.current = currentLength;
  }, [messages, scrollToBottom, isAtBottom, status]);

  return (
    <div ref={containerRef} className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4">
      {messages.length === 0 && <Overview />}

      {messages.map((message, index) => (
        <MessageContainer
          key={message.id}
          status={status}
          message={message}
          user={user}
          isLastMessage={index === messages.length - 1}
        />
      ))}

      {(status === ChatStatus.SUBMITTED ||
        (!messages[messages.length - 1]?.content && status === ChatStatus.STREAMING) ||
        (messages[messages.length - 1]?.type === MessageType.TOOL &&
          status === ChatStatus.STREAMING)) && <ThinkingMessage />}

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
