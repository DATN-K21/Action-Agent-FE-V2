import { ChatStatus, MessageType } from '@/constants/ai-constant';
import { IMessage } from '@/types/ai';
import { motion } from 'framer-motion';
import { SparklesIcon } from 'lucide-react';
import { User } from 'next-auth';
import { useMemo } from 'react';
import { PreviewMessage } from './message';

export interface MessageNameProps {
  status: ChatStatus;
  message: IMessage;
  user: User;
  isLastMessage: boolean;
}

function MessageContainer(props: MessageNameProps) {
  const { status, message, isLastMessage } = props;

  const title = useMemo<string>((): string => {
    let name = message?.name || 'Unknown';

    // Remove UUID patterns from the name
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
    name = name.replace(uuidRegex, '');

    // Clean up remaining hyphens and underscores
    name = name.replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    name = name.replace(/-+/g, ' '); // Replace multiple hyphens with space
    name = name.replace(/_+/g, ' '); // Replace underscores with space
    name = name.replace(/\s+/g, ' '); // Replace multiple spaces with single space
    name = name.trim(); // Remove leading/trailing spaces

    // Handle special cases
    if (name === '' || name === 'user') {
      return name === 'user' ? 'User' : 'Assistant';
    }

    // Capitalize each word
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }, [message?.name]);

  if (message.type === MessageType.HUMAN) {
    return (
      <PreviewMessage
        message={message}
        isLoading={status === ChatStatus.STREAMING && isLastMessage}
      />
    );
  }

  if (!message.content) {
    return null;
  }

  return (
    <motion.div
      data-testid={`message-${message.type}`}
      className="w-full mx-auto max-w-4xl group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={message.type}
    >
      {(message.type === MessageType.AI || message.type === MessageType.TOOL) &&
        message.content && (
          <div>
            <div className="flex justify-between items-center gap-3 w-full rounded-lg cursor-pointer mb-2">
              <div className="flex items-center gap-2">
                <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
                  <div className="translate-y-px">
                    <SparklesIcon size={14} />
                  </div>
                </div>
                <span className="font-semibold text-base">{title}</span>
              </div>
            </div>
            <div>
              <PreviewMessage
                message={message}
                isLoading={status === ChatStatus.STREAMING && isLastMessage}
              />
            </div>
          </div>
        )}
    </motion.div>
  );
}

export default MessageContainer;
