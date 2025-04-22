'use client'

import cx from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { memo } from 'react'
import { SparklesIcon } from './icons'
import { Markdown } from './markdown'
import { cn } from '@/lib/utils'
import { IMessage } from '@/types/ai'
import { MessageRole } from '@/constants/ai-constant'
import { MessageActions } from '@/components/ui/message-actions'

const PurePreviewMessage = ({
  message,
  isLoading,
}: {
  message: IMessage
  isLoading: boolean
}) => {
  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-4xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            'flex gap-4 w-full group-data-[role=human]/message:ml-auto group-data-[role=human]/message:max-w-2xl group-data-[role=human]/message:w-fit',
          )}
        >
          {message.role === MessageRole.AI && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            {/* {message.experimental_attachments && (
              <div
                data-testid={`message-attachments`}
                className="flex flex-row justify-end gap-2"
              >
                {message.experimental_attachments.map((attachment) => (
                  <PreviewAttachment
                    key={attachment.url}
                    attachment={attachment}
                  />
                ))}
              </div>
            )} */}

            {message.content && (
              <div
                data-testid="message-content"
                className="flex flex-row gap-2 items-start"
              >
                <div
                  className={cn('flex flex-col gap-4', {
                    'bg-primary text-primary-foreground px-3 py-2 rounded-xl':
                      message.role === MessageRole.HUMAN,
                  })}
                >
                  <Markdown>{message.content as string}</Markdown>
                </div>
              </div>
            )}

            <MessageActions
              key={`action-${message.id}`}
              message={message}
              isLoading={isLoading}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false
    if (prevProps.message.content !== nextProps.message.content) return false

    return true
  },
)

export const ThinkingMessage = () => {
  const role = MessageRole.AI

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-4xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=human]/message:px-3 w-full group-data-[role=human]/message:w-fit group-data-[role=human]/message:ml-auto group-data-[role=human]/message:max-w-2xl group-data-[role=human]/message:py-2 rounded-xl',
          {
            'group-data-[role=human]/message:bg-muted': true,
          },
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  )
}
