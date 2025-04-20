import { PreviewMessage, ThinkingMessage } from './message';
import { useScrollToBottom } from './use-scroll-to-bottom';
import { Overview } from './overview';
import { Fragment, memo } from 'react';
import equal from 'fast-deep-equal';
import { ChatStatus, MessageRole } from '@/constants/ai-constant';
import { IMessage } from '@/types/ai';
import { ActionConfirmation } from '@/components/action-confirmation';
import { User } from 'next-auth';

interface MessagesProps {
  status: ChatStatus;
  messages: Array<IMessage>;
  user: User;
}

function PureMessages({ status, messages, user }: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {messages.length === 0 && <Overview />}

      {messages.map((message, index) => {
        return (
          <Fragment key={message.id}>
            {message.content &&
              (message.role === MessageRole.AI || message.role === MessageRole.HUMAN) && (
                <PreviewMessage
                  message={message}
                  isLoading={status === ChatStatus.STREAMING && messages.length - 1 === index}
                />
              )}

            {message.interrupted && message.toolcalls && (
              <ActionConfirmation toolCalls={message.toolcalls} user={user} />
            )}
          </Fragment>
        );
      })}

      {status === ChatStatus.SUBMITTED ||
        (messages[messages.length - 1]?.content === '' &&
          messages[messages.length - 1]?.role === MessageRole.AI &&
          status === ChatStatus.STREAMING) ? (
        <ThinkingMessage />
      ) : null}

      <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
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
