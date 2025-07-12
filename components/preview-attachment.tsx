import { LoaderIcon } from './icons'
import { X } from 'lucide-react'
import Image from 'next/image';
import type { Attachment } from 'ai';

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
  onRemove,
}: {
  attachment: Attachment
  isUploading?: boolean
  onRemove?: () => void
}) => {
  const { name, url, contentType } = attachment;
  // Filetype icon logic (as in upload-list)
  const ext = (name?.split('.').pop() || '').toLowerCase();
  const knownTypes = ['csv','docx','html','json','pdf','ppt','txt','xls'];
  const iconType = knownTypes.includes(ext) ? ext : 'question';

  return (
    <div data-testid="input-attachment-preview" className="flex flex-col gap-2 relative">
      <div className="w-20 h-16 aspect-video bg-muted rounded-md relative flex flex-col items-center justify-center">
        {contentType && contentType.startsWith('image') && url ? (
          <img
            key={url}
            src={url}
            alt={name ?? 'An image attachment'}
            className="rounded-md size-full object-cover"
          />
        ) : (
          <Image
            src={`/images/filetypes/${iconType}.png`}
            alt={iconType}
            width={40}
            height={40}
            className="object-contain"
          />
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
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-0 right-0 p-1 bg-blue-500 text-white rounded-full size-5 flex items-center justify-center"
          aria-label="Remove file"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
