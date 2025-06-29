import { PreviewMessage, ThinkingMessage } from './message';
import { useScrollToBottom } from './use-scroll-to-bottom';
import { Overview } from './overview';
import { Fragment, memo, useEffect } from 'react';
import equal from 'fast-deep-equal';
import { ChatStatus, MessageType } from '@/constants/ai-constant';
import { IMessage } from '@/types/ai';
import { ActionConfirmation } from '@/components/action-confirmation';
import { User } from 'next-auth';
import { ArrowDown } from 'lucide-react';

interface MessagesProps {
  status: ChatStatus;
  messages: Array<IMessage>;
  user: User;
}

function PureMessages({ status, messages, user }: MessagesProps) {
  const { containerRef, endRef, isAtBottom, scrollToBottom } = useScrollToBottom<HTMLDivElement>();

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length]);

  return (
    <div ref={containerRef} className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4">
      {messages.length === 0 && <Overview />}

      {messages.map((message, index) => (
        <Fragment key={message.id}>
          {message.content &&
            (message.type === MessageType.AI || message.type === MessageType.HUMAN) && (
              <PreviewMessage
                message={message}
                isLoading={status === ChatStatus.STREAMING && index === messages.length - 1}
              />
            )}

          {message.interrupted && message.tool_calls && (
            <ActionConfirmation toolCalls={message.tool_calls} user={user} />
          )}
        </Fragment>
      ))}

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
