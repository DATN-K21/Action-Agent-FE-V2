import { PreviewMessage, ThinkingMessage } from './message'
import { useScrollToBottom } from './use-scroll-to-bottom'
import { Overview } from './overview'
import { memo } from 'react'
import equal from 'fast-deep-equal'
import { ChatStatus, MessageRole } from '@/constants/ai-constant'
import { IMessage } from '@/types/ai'

interface MessagesProps {
  chatId: string
  status: ChatStatus
  messages: Array<IMessage>
}

function PureMessages({ chatId, status, messages }: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>()

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {messages.length === 0 && <Overview />}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          chatId={chatId}
          message={message}
          isLoading={
            status === ChatStatus.STREAMING && messages.length - 1 === index
          }
        />
      ))}

      {status === ChatStatus.SUBMITTED &&
        messages.length > 0 &&
        messages[messages.length - 1].role === MessageRole.HUMAN && (
          <ThinkingMessage />
        )}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  )
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false
  if (prevProps.status && nextProps.status) return false
  if (prevProps.messages.length !== nextProps.messages.length) return false
  if (!equal(prevProps.messages, nextProps.messages)) return false

  return true
})
