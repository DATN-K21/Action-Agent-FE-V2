'use client'

import type { Attachment } from 'ai'
import cx from 'classnames'
import type React from 'react'
import {
  useRef,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
  memo,
} from 'react'
import { useWindowSize } from 'usehooks-ts'

import { ArrowUpIcon, PaperclipIcon, StopIcon, GlobeIcon } from './icons'
import { PreviewAttachment } from './preview-attachment'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { SuggestedActions } from './suggested-actions'
import equal from 'fast-deep-equal'
import { AgentName, ChatStatus, MessageRole } from '@/constants/ai-constant'
import { User } from 'next-auth'
import useChatStore from '@/store/chat-store'
import { toast } from '@/components/toast'
import { Brain } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip'
import { handleUploadFile } from '@/services/thread-service'

interface MultimodalInputProps {
  chatId: string
  user: User
  status: ChatStatus
  attachments: Array<Attachment>
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>
  className?: string
}

function PureMultimodalInput(props: MultimodalInputProps) {
  const { chatId, user, status, attachments, setAttachments, className } = props
  const {
    agent,
    messages,
    input,
    setAgent,
    setInput,
    append,
    stop,
    createThread,
    handleStreamChat,
  } = useChatStore()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { width } = useWindowSize()

  const [pendingFiles, setPendingFiles] = useState<Array<File>>([])

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`
    }
  }

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = '98px'
    }
  }

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
    adjustHeight()
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([])

  const submitForm = useCallback(async () => {
    try {
      //Upload files before sending message
      if (pendingFiles.length > 0) {
        setUploadQueue(pendingFiles.map((file) => file.name)) // Hiển thị trạng thái đang upload

        const uploadPromises = pendingFiles.map((file) => uploadFile(file))
        const uploadedAttachments = await Promise.all(uploadPromises)

        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined,
        )

        // Set attachments after uploading
        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ])

        //Delete Queue
        setPendingFiles([])
        setUploadQueue([])
      }

      // Check if is a home page, create a new thread
      if (window.location.pathname === '/') {
        await createThread(user, chatId)
        window.history.replaceState({}, '', `/chat/${chatId}`)
      }

      await handleStreamChat(user)

      setAttachments([])
      resetHeight()

      if (width && width > 768) {
        textareaRef.current?.focus()
      }
    } catch (error) {
      setInput('')
      toast({
        type: 'error',
        description: 'Error sending message, please try again!',
      })
      // Apend error message to chat
      append({
        id: 'error',
        role: MessageRole.AI,
        content: 'Error sending message, please try again!',
      })
    }
  }, [
    attachments,
    handleStreamChat,
    setAttachments,
    width,
    chatId,
    pendingFiles,
  ])

  const uploadFile = async (file: File) => {
    try {
      //Create new thread if on home page
      if (window.location.pathname === '/') {
        await createThread(user, chatId)
        window.history.replaceState({}, '', `/chat/${chatId}`)
      }

      const response = await handleUploadFile({
        user,
        threadId: chatId,
        payload: { file },
      })

      if (response.isSuccess) {
        return {
          url: response.output,
          name: file.name,
          contentType: file.type,
        }
      } else {
        toast({
          type: 'error',
          description: 'Error uploading file, please try again!',
        })
        // Apend error message to chat
        append({
          id: 'upload-file-error',
          role: MessageRole.AI,
          content: 'Error uploading file, please try again!',
        })
        return undefined
      }
    } catch (error) {
      toast({
        type: 'error',
        description: 'Error uploading file, please try again!',
      })
      // Apend error message to chat
      append({
        id: 'error',
        role: MessageRole.AI,
        content: 'Error uploading file, please try again!',
      })
    }
  }

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || [])

      setPendingFiles((prev) => [...prev, ...files]) // Thêm file vào queue
      setUploadQueue((prev) => [...prev, ...files.map((file) => file.name)]) // Cập nhật danh sách tên file để hiển thị

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [],
  )

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
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
          'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10 dark:border-zinc-700',
          className,
        )}
        rows={2}
        autoFocus
        onKeyDown={(event) => {
          if (
            event.key === 'Enter' &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault()

            if (status === ChatStatus.STREAMING) {
              toast({
                type: 'infor',
                description:
                  'Please wait for the current response to finish before sending another message.',
              })
            } else {
              submitForm()
            }
          }
        }}
      />

      <div className="absolute bottom-0 p-2 w-fit flex flex-row justify-start">
        <AttachmentsButton fileInputRef={fileInputRef} status={status} />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="search-agent-button"
              className={cx(
                'rounded-md p-[7px] h-fit dark:border-zinc-700',
                agent === AgentName.SEARCH
                  ? 'bg-zinc-600 text-white hover:bg-zinc-800 hover:text-white dark:hover:bg-zinc-700'
                  : 'hover:bg-zinc-300 dark:hover:bg-zinc-900',
              )}
              onClick={(e) => {
                e.preventDefault()
                setAgent(
                  agent === AgentName.SEARCH
                    ? AgentName.CHAT
                    : AgentName.SEARCH,
                )
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
                agent === AgentName.RAG
                  ? 'bg-zinc-600 text-white hover:bg-zinc-800 hover:text-white dark:hover:bg-zinc-700'
                  : 'hover:bg-zinc-300 dark:hover:bg-zinc-900',
              )}
              onClick={(e) => {
                e.preventDefault()
                setAgent(
                  agent === AgentName.RAG ? AgentName.CHAT : AgentName.RAG,
                )
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
        {status === ChatStatus.STREAMING ? (
          <StopButton stop={stop} />
        ) : (
          <SendButton
            input={input}
            submitForm={submitForm}
            uploadQueue={uploadQueue}
          />
        )}
      </div>
    </div>
  )
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.status !== nextProps.status) return false
    if (!equal(prevProps.attachments, nextProps.attachments)) return false

    return true
  },
)

function PureAttachmentsButton({
  fileInputRef,
  status,
}: {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>
  status: ChatStatus
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-testid="attachments-button"
          className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200"
          onClick={(event) => {
            event.preventDefault()
            fileInputRef.current?.click()
          }}
          disabled={status !== ChatStatus.READY}
          variant="ghost"
        >
          <PaperclipIcon size={14} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Attach a file</TooltipContent>
    </Tooltip>
  )
}

const AttachmentsButton = memo(PureAttachmentsButton)

function PureStopButton({ stop }: { stop: () => void }) {
  return (
    <Button
      data-testid="stop-button"
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault()
        stop()
      }}
    >
      <StopIcon size={14} />
    </Button>
  )
}

const StopButton = memo(PureStopButton)

function PureSendButton({
  submitForm,
  input,
  uploadQueue,
}: {
  submitForm: () => void
  input: string
  uploadQueue: Array<string>
}) {
  return (
    <Button
      data-testid="send-button"
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault()
        submitForm()
      }}
      disabled={input.length === 0 && uploadQueue.length === 0}
    >
      <ArrowUpIcon size={14} />
    </Button>
  )
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
    return false
  if (prevProps.input !== nextProps.input) return false
  return true
})
