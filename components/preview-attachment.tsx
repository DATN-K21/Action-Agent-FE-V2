import type { Attachment } from 'ai'

import { LoaderIcon } from './icons'
import { X } from 'lucide-react'

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
  onRemove,
}: {
  attachment: Attachment
  isUploading?: boolean
  onRemove?: () => void
}) => {
  const { name, url, contentType } = attachment

  return (
    <div data-testid="input-attachment-preview" className="flex flex-col gap-2 relative">
      <div className="w-20 h-16 aspect-video bg-muted rounded-md relative flex flex-col items-center justify-center">
        {contentType ? (
          contentType.startsWith('image') ? (
            // NOTE: it is recommended to use next/image for images
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt={name ?? 'An image attachment'}
              className="rounded-md size-full object-cover"
            />
          ) : (
            <div className="" />
          )
        ) : (
          <div className="" />
        )}

        {isUploading && (
          <div
            data-testid="input-attachment-loader"
            className="animate-spin absolute text-zinc-500"
          >
            <LoaderIcon />
          </div>
        )}
      </div>
      <div className="text-xs text-zinc-500 max-w-16 truncate">{name}</div>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute top-0 right-0 p-1 bg-blue-500 text-white rounded-full size-5 flex items-center justify-center"
          aria-label="Remove file"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
