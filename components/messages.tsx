import { PreviewMessage, ThinkingMessage } from './message';
import { useScrollToBottom } from './use-scroll-to-bottom';
import { Overview } from './overview';
import { Fragment, memo, useEffect } from 'react';
import equal from 'fast-deep-equal';
import { ChatStatus, MessageRole } from '@/constants/ai-constant';
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
    scrollToBottom();
  }, [messages.length]);

  return (
    <div ref={containerRef} className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4">
      {messages.length === 0 && <Overview />}

      {messages.map((message, index) => (
        <Fragment key={message.id}>
          {message.content &&
            (message.role === MessageRole.AI || message.role === MessageRole.HUMAN) && (
              <PreviewMessage
                message={message}
                isLoading={status === ChatStatus.STREAMING && index === messages.length - 1}
              />
            )}

          {message.interrupted && message.toolcalls && (
            <ActionConfirmation toolCalls={message.toolcalls} user={user} />
          )}
        </Fragment>
      ))}

      {(status === ChatStatus.SUBMITTED ||
        (messages[messages.length - 1]?.content === '' &&
          messages[messages.length - 1]?.role === MessageRole.AI &&
          status === ChatStatus.STREAMING)) && <ThinkingMessage />}

      <div ref={endRef} className="shrink-0 min-h-[24px]" />

      {!isAtBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-[20%] right-1/2 z-10 rounded-full bg-white shadow-md border border-gray-300 p-2 hover:bg-gray-100 transition"
        >
          <ArrowDown className="w-5 h-5 text-gray-600" />
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
