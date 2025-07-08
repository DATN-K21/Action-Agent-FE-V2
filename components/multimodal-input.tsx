'use client';

import type { Attachment } from 'ai';
import cx from 'classnames';
import type React from 'react';
import { memo, useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useWindowSize } from 'usehooks-ts';

import { toast } from '@/components/toast';
import { ChatStatus, MessageType, TeamType } from '@/constants/ai-constant';
import { AssistantType } from '@/constants/assistant-constant';
import { generateTitle, handleUploadFile, recognizeVoice } from '@/services/thread-service';
import useChatStore from '@/store/chat-store';
import { useThreadStore } from '@/store/thread-store';
import { Brain, Check, Mic, X } from 'lucide-react';
import { User } from 'next-auth';
import { ArrowUpIcon, BotIcon, GlobeIcon, PaperclipIcon, StopIcon } from './icons';
import { PreviewAttachment } from './preview-attachment';
import { SuggestedActions } from './suggested-actions';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface MultimodalInputProps {
  user: User;
  status: ChatStatus;
  className?: string;
}

function PureMultimodalInput(props: MultimodalInputProps) {
  const { user, status, className } = props;

  const messages = useChatStore((state) => state.messages);
  const input = useChatStore((state) => state.input);
  const assistant = useChatStore((state) => state.assistant);
  const threadId = useChatStore((state) => state.threadId);
  const teamId = useChatStore((state) => state.teamId);
  const setInput = useChatStore((state) => state.setInput);
  const setTeamId = useChatStore((state) => state.setTeamId);
  const append = useChatStore((state) => state.appendMessage);
  const stop = useChatStore((state) => state.stopStream);
  const setStatus = useChatStore((state) => state.setStatus);
  const setThreadId = useChatStore((state) => state.setThreadId);
  const createThread = useChatStore((state) => state.createThread);
  const handleStreamTeam = useChatStore((state) => state.handleStreamTeam);

  const renameThread = useThreadStore((state) => state.renameThread);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const [pendingFiles, setPendingFiles] = useState<Array<File>>([]);

  const isAdvancedAssistant = assistant?.assistantType === AssistantType.ADVANCED_ASSISTANT;

  const getTeamIdByWorkflowType = (workflowType: TeamType): string => {
    const team = assistant?.teams?.find((team: any) => team.workflow_type === workflowType);
    return team?.id || assistant?.teams?.[0].id!;
  };

  // Auto-generate title when two messages are sent and status is ready and threadId is set
  useEffect(() => {
    const generateTitleForNewThread = async () => {
      if (messages.length === 2 && threadId && status === ChatStatus.READY) {
        try {
          const newThread = await generateTitle({ user, threadId });
          await renameThread(user, threadId, newThread.title, { callApi: false });
          document.title = newThread.title;
        } catch (error) {
          console.error('Error generating title:', error);
        }
      }
    };

    generateTitleForNewThread();
  }, [messages, status, threadId, user, renameThread]);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '98px';
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const uploadFile = useCallback(
    async (file: File) => {
      try {
        //Create new thread if on home page
        if (window.location.pathname === '/') {
          const thread = await createThread(user, 'New Chat', assistant!.id);
          setThreadId(thread.id);
          window.history.replaceState({}, '', `/chat/${thread.id}`);
        }

        const response = await handleUploadFile({
          user,
          threadId,
          payload: { file },
        });

        if (response.isSuccess) {
          return {
            url: response.output,
            name: file.name,
            contentType: file.type,
          };
        } else {
          toast({
            type: 'error',
            description: 'Error uploading file, please try again!',
          });
          // Apend error message to chat
          append({
            id: 'upload-file-error',
            type: MessageType.AI,
            name: '',
            content: 'Error uploading file, please try again!',
            documents: null,
            imgdata: '',
            tool_calls: [],
            tool_output: null,
            next: '',
          });
          return undefined;
        }
      } catch (error) {
        toast({
          type: 'error',
          description: 'Error uploading file, please try again!',
        });
        // Apend error message to chat
        append({
          id: 'error',
          type: MessageType.AI,
          name: '',
          content: 'Error uploading file, please try again!',
          documents: null,
          imgdata: '',
          tool_calls: [],
          tool_output: null,
          next: '',
        });
      }
    },
    [append, assistant, createThread, setThreadId, threadId, user],
  );

  const submitForm = useCallback(async () => {
    setStatus(ChatStatus.SUBMITTED);
    resetHeight();

    try {
      //Upload files before sending message
      if (pendingFiles.length > 0) {
        setUploadQueue(pendingFiles.map((file) => file.name));

        const uploadPromises = pendingFiles.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);

        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined,
        );

        // Set attachments after uploading
        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);

        //Delete Queue
        setPendingFiles([]);
        setUploadQueue([]);
      }

      // Check if is a home page, create a new thread
      if (window.location.pathname === '/') {
        const thread = await createThread(user, 'New Chat', assistant!.id);
        setThreadId(thread.id);
        window.history.replaceState({}, '', `/chat/${thread.id}`);
      }

      await handleStreamTeam(user);

      if (width && width > 768) {
        textareaRef.current?.focus();
      }
    } catch (error) {
      console.error('Error in stream:', error);
      setInput('');
      toast({
        type: 'error',
        description: 'Error sending message, please try again!',
      });
      // Apend error message to chat
      append({
        id: 'error',
        type: MessageType.AI,
        name: '',
        content: 'Error sending message, please try again!',
        documents: null,
        imgdata: '',
        tool_calls: [],
        tool_output: null,
        next: '',
      });
    }
  }, [
    append,
    assistant,
    createThread,
    handleStreamTeam,
    pendingFiles,
    setInput,
    setStatus,
    setThreadId,
    uploadFile,
    user,
    width,
  ]);

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    setPendingFiles((prev) => [...prev, ...files]);
    setUploadQueue((prev) => [...prev, ...files.map((file) => file.name)]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  function handleRemoveFile(filename: string): void {
    setPendingFiles((prev) => prev.filter((file) => file.name !== filename));
    setUploadQueue((prev) => prev.filter((file) => file !== filename));
    setAttachments((prev) => prev.filter((attachment) => attachment.name !== filename));
  }

  const [micPermission, setMicPermission] = useState<boolean>(false);

  const [streaming, setStreaming] = useState<MediaStream | null>(null);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const getMicrophonePermission = async (): Promise<MediaStream | null> => {
    if ('MediaRecorder' in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermission(true);
        setStreaming(streamData);
        return streamData;
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setMicPermission(false);
        return null;
      }
    } else {
      alert('Your browser does not support the MediaRecorder API');
      return null;
    }
  };

  const handleStartRecord = async () => {
    let currentStream = streaming;

    if (!micPermission || !currentStream) {
      const permissionStream = await getMicrophonePermission();
      if (!permissionStream) {
        return;
      }
      currentStream = permissionStream;
      setStreaming(currentStream);
      setMicPermission(true);
    }

    const mediaRecorder = new MediaRecorder(currentStream!, { mimeType: 'audio/webm' });

    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audioFile', blob, 'voice.webm');

      try {
        const response = await recognizeVoice({ formData });

        if ((response as any)?.status === 200) {
          setInput((response as any).data as string);
          adjustHeight();
        } else {
          toast({
            type: 'error',
            description: 'Recognition failed, please try again!',
          });
        }
      } catch (error) {
        console.error('Voice recognition error:', error);
        toast({
          type: 'error',
          description: 'Error recognizing voice, please try again!',
        });
      }
    };

    setMediaRecorder(mediaRecorder);
    setIsRecording(true);

    mediaRecorder.start();
  };

  const stopAndSend = async () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop(); // Triggers onstop and sends
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    setInput('');
    setIsRecording(false);
  };

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 && attachments.length === 0 && uploadQueue.length === 0 && (
        <SuggestedActions onSubmission={submitForm} />
      )}

      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
        accept=".txt, .pdf"
      />

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div
          data-testid="attachments-preview"
          className="flex flex-row gap-2 overflow-x-scroll items-end"
        >
          {attachments.map((attachment) => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
          ))}

          {uploadQueue.map((filename) => (
            <PreviewAttachment
              key={filename}
              attachment={{
                url: '',
                name: filename,
                contentType: '',
              }}
              isUploading={false}
              onRemove={() => handleRemoveFile(filename)}
            />
          ))}
        </div>
      )}

      <Textarea
        data-testid="multimodal-input"
        ref={textareaRef}
        placeholder="Send a message..."
        value={input}
        onChange={handleInput}
        className={cx(
          'min-h-[24px] max-h-[calc(50dvh)] overflow-y-auto resize-none rounded-2xl !text-base bg-muted pb-10 dark:border-zinc-700',
          className,
        )}
        rows={2}
        autoFocus
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();

            if (status === ChatStatus.STREAMING) {
              toast({
                type: 'info',
                description:
                  'Please wait for the current response to finish before sending another message.',
              });
            } else {
              submitForm();
            }
          }
        }}
      />

      <div className="absolute bottom-0 p-2 w-fit flex flex-row justify-start">
        <AttachmentsButton fileInputRef={fileInputRef} status={status} />
        {isAdvancedAssistant && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="search-agent-button"
                className={cx(
                  'rounded-md p-[7px] h-fit dark:border-zinc-700',
                  teamId === getTeamIdByWorkflowType(TeamType.HIERARCHICAL)
                    ? 'bg-zinc-600 text-white hover:bg-zinc-800 hover:text-white dark:hover:bg-zinc-700'
                    : 'hover:bg-zinc-300 dark:hover:bg-zinc-900',
                )}
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  const hierarchicalTeamId = getTeamIdByWorkflowType(TeamType.HIERARCHICAL);
                  const mainTeamId = getTeamIdByWorkflowType(TeamType.CHATBOT);
                  setTeamId(teamId === hierarchicalTeamId ? mainTeamId : hierarchicalTeamId);
                }}
              >
                <BotIcon size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Hierarchical</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="search-agent-button"
              className={cx(
                'rounded-md p-[7px] h-fit dark:border-zinc-700',
                teamId === getTeamIdByWorkflowType(TeamType.SEARCHBOT)
                  ? 'bg-zinc-600 text-white hover:bg-zinc-800 hover:text-white dark:hover:bg-zinc-700'
                  : 'hover:bg-zinc-300 dark:hover:bg-zinc-900',
              )}
              onClick={(e) => {
                e.preventDefault();
                const searchbotTeamId = getTeamIdByWorkflowType(TeamType.SEARCHBOT);
                const mainTeamId = getTeamIdByWorkflowType(TeamType.CHATBOT);
                setTeamId(teamId === searchbotTeamId ? mainTeamId : searchbotTeamId);
              }}
              variant="ghost"
            >
              <GlobeIcon size={14} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Search the web</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="rag-agent-button"
              className={cx(
                'rounded-md p-[7px] h-fit dark:border-zinc-700',
                teamId === getTeamIdByWorkflowType(TeamType.RAGBOT)
                  ? 'bg-zinc-600 text-white hover:bg-zinc-800 hover:text-white dark:hover:bg-zinc-700'
                  : 'hover:bg-zinc-300 dark:hover:bg-zinc-900',
              )}
              onClick={(e) => {
                e.preventDefault();
                const ragbotTeamId = getTeamIdByWorkflowType(TeamType.RAGBOT);
                const mainTeamId = getTeamIdByWorkflowType(TeamType.CHATBOT);
                setTeamId(teamId === ragbotTeamId ? mainTeamId : ragbotTeamId);
              }}
              variant="ghost"
            >
              <Brain size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Real-time retrival</TooltipContent>
        </Tooltip>
      </div>

      <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="mic-button"
              className="rounded-md p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200"
              onClick={async (e) => {
                e.preventDefault();
                await handleStartRecord();
              }}
              variant="ghost"
              disabled={isRecording}
            >
              <Mic size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Dictate</TooltipContent>
        </Tooltip>

        {isRecording && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="rounded-md p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200"
                  onClick={() => stopAndSend()}
                  variant="ghost"
                >
                  <Check size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Done</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="rounded-md p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200"
                  onClick={() => cancelRecording()}
                  variant="ghost"
                >
                  <X size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cancel</TooltipContent>
            </Tooltip>
          </>
        )}
        {!isRecording &&
          (status === ChatStatus.STREAMING || status == ChatStatus.SUBMITTED ? (
            <StopButton stop={stop} />
          ) : (
            <SendButton input={input} submitForm={submitForm} uploadQueue={uploadQueue} />
          ))}
      </div>
    </div>
  );
}

export const MultimodalInput = memo(PureMultimodalInput, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;

  return true;
});

function PureAttachmentsButton({
  fileInputRef,
  status,
}: {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  status: ChatStatus;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-testid="attachments-button"
          className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200"
          onClick={(event) => {
            event.preventDefault();
            fileInputRef.current?.click();
          }}
          disabled={status !== ChatStatus.READY}
          variant="ghost"
        >
          <PaperclipIcon size={14} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Attach a file</TooltipContent>
    </Tooltip>
  );
}

const AttachmentsButton = memo(PureAttachmentsButton);

function PureStopButton({ stop }: { stop: () => void }) {
  return (
    <Button
      data-testid="stop-button"
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault();
        stop();
      }}
    >
      <StopIcon size={14} />
    </Button>
  );
}

const StopButton = memo(PureStopButton);

function PureSendButton({
  submitForm,
  input,
  uploadQueue,
}: {
  submitForm: () => void;
  input: string;
  uploadQueue: Array<string>;
}) {
  return (
    <Button
      data-testid="send-button"
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault();
        submitForm();
      }}
      disabled={input.length === 0 && uploadQueue.length === 0}
    >
      <ArrowUpIcon size={14} />
    </Button>
  );
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length) return false;
  if (prevProps.input !== nextProps.input) return false;
  return true;
});
