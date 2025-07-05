import { ChatStatus, MessageType } from '@/constants/ai-constant';
import { IMessage } from '@/types/ai';
import {
  Content as AccordionContent,
  Item as AccordionItem,
  Trigger as AccordionTrigger,
} from '@radix-ui/react-accordion';
import { motion } from 'framer-motion';
import { SparklesIcon } from 'lucide-react';
import { User } from 'next-auth';
import { useMemo, useState } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { ActionConfirmation } from './action-confirmation';
import { PreviewMessage } from './message';

export interface MessageNameProps {
  status: ChatStatus;
  message: IMessage;
  user: User;
  isLastMessage: boolean;
}

function MessageContainer(props: MessageNameProps) {
  const { status, message, user, isLastMessage } = props;
  const [isOpen, setIsOpen] = useState(false);

  const title = useMemo<string>((): string => {
    let name = message?.name || 'Unknown';
    if (name.includes('-')) {
      name = name.split('-')[0];
    }
    name = name.replace(/_/g, ' ');
    return name.charAt(0).toUpperCase() + name.slice(1);
  }, [message?.name]);

  if (message.content === null && message.type !== MessageType.INTERRUPT) {
    return null;
  }
  if (message.type === MessageType.HUMAN) {
    return (
      <PreviewMessage
        message={message}
        isLoading={status === ChatStatus.STREAMING && isLastMessage}
      />
    );
  }

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-4xl px-4 group/message rounded-lg p-1 border border-[#cccccc]"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={message.type}
    >
      <AccordionItem value={message.id}>
        <AccordionTrigger
          className="flex justify-between items-center gap-4 w-full rounded-lg pb-1 border-b-2 border-dashed"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
            <span className="font-semibold text-lg">{title}</span>
          </div>

          {/* <HiOutlineChevronDown className="transition-transform duration-300 data-[state=open]:rotate-180" /> */}
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <HiOutlineChevronDown />
          </motion.div>
        </AccordionTrigger>
        <AccordionContent>
          {message.type === MessageType.AI && (
            <PreviewMessage
              message={message}
              isLoading={status === ChatStatus.STREAMING && isLastMessage}
            />
          )}

          {message.type === MessageType.INTERRUPT && (message.tool_calls || message.content) && (
            <ActionConfirmation message={message} user={user} />
          )}
        </AccordionContent>
      </AccordionItem>
    </motion.div>
  );
}

export default MessageContainer;
