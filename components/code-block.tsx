'use client'
import { useCopyToClipboard } from 'usehooks-ts'
import { CopyIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/toast'

const languageMap: Record<string, string> = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py',
}

interface CodeBlockProps {
  node: any
  className: string
  children: any
}

export function CodeBlock({
  node,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const match = /language-(\w+)/.exec(className || '')
  const languageLabel = match ? languageMap[match[1]] || match[1] : ''

  console.log('languageLabel', languageLabel)
  console.log('match', match ? match[1] : null)

  const [_, copyToClipboard] = useCopyToClipboard()

  const getCodeString = () => {
    if (typeof children === 'string') return children
    if (Array.isArray(children))
      return children
        .map((child) => {
          if (typeof child === 'string') return child
          if (typeof child === 'object' && 'props' in child)
            return child.props.children || ''
          return ''
        })
        .join('')
    if (typeof children === 'object' && 'props' in children)
      return children.props.children || ''
    return ''
  }

  const handleCopy = async () => {
    const codeToCopy = getCodeString()
    await copyToClipboard(codeToCopy)
    toast({
      type: 'success',
      description: 'Copied to clipboard!',
    })
  }

  if (match) {
    return (
      <div className="relative not-prose flex flex-col">
        <div className="absolute top-1 left-1 text-sm px-2 py-0.5 text-muted-foreground pointer-events-none select-none">
          {languageLabel}
        </div>
        <Button
          className="absolute top-2 right-2 w-fit py-1 px-2 h-fit text-muted-foreground"
          variant="outline"
          onClick={handleCopy}
        >
          <CopyIcon />
        </Button>
        <pre
          {...props}
          className={`text-sm w-full overflow-x-auto dark:bg-zinc-900 px-4 pt-10 pb-4 bg-zinc-100 dark:border-zinc-700 rounded-xl dark:text-zinc-50 text-zinc-900`}
        >
          <code className="whitespace-pre-wrap break-all">{children}</code>
        </pre>
      </div>
    )
  } else {
    return (
      <code
        className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
        {...props}
      >
        {children}
      </code>
    )
  }
}
