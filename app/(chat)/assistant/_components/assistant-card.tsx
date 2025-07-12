import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IAssistant } from '@/types/assistant';
import { MoreHorizontal, Pencil, Trash, Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useChatStore from '@/store/chat-store';
import { ThreadType } from '@/constants/extension-constant';
import { toast } from '@/components/toast';
import { Icons } from '@/components/icon';
import { User } from 'next-auth';

type AssistantCardProps = {
  user: User;
  assistant: IAssistant;
  onEdit: (assistant: IAssistant) => void;
  onDelete: (assistantId: string) => void;
};

export function AssistantCard({ user, assistant, onEdit, onDelete }: AssistantCardProps) {
  const router = useRouter();
  const createThread = useChatStore((state) => state.createThread);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartChat = async () => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    try {
      const thread = await createThread(user, `Chat with ${assistant.name}`, assistant.id);
      toast({ type: 'success', description: `Starting chat with ${assistant.name}` });
      router.push(`/chat/${thread.id}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast({ type: 'error', description: 'Failed to start chat' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li
      className="rounded-lg border p-4 hover:shadow-md hover:cursor-pointer hover:bg-gray-50 transition-all duration-200 ease-in-out"
      style={{
        boxShadow: `
        inset 0px -3px 0px 0px #D6D6E7,
        0px 4px 8px -3px #2D23424D,
        0px 2px 4px 0px #2C234266
      `,
      }}
    >
      <div className="mb-8 flex items-center justify-between">
        <div className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}>
          {/* <Bot /> */}
          🤖
        </div>

        <div className={`flex size-10 items-center justify-center rounded-lg p-2`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" sideOffset={4}>
              <DropdownMenuItem onClick={() => onEdit(assistant)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-700"
                onClick={() => onDelete(assistant.id)}
              >
                <Trash className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div>
        <h2 className="mb-1 font-semibold">{assistant.name}</h2>
        <p className="line-clamp-2 text-gray-500">{assistant.description || 'No description'}</p>
      </div>
      <div className="flex flex-row justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-green-600 text-white hover:bg-green-700 hover:text-white"
          onClick={handleStartChat}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 size-4 animate-spin" /> Starting...
            </>
          ) : (
            'Start chat'
          )}
        </Button>
      </div>
    </li>
  );
}
