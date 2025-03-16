'use client';

interface CodeBlockProps {
  node: any;
  className: string;
  children: any;
}

export function CodeBlock({
  node,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const match = /language-(\w+)/.exec(className || "");

  if (match) {
    return (
      <div className="text-sm w-full overflow-y-auto dark:bg-zinc-900 p-4 border border-zinc-3 bg-zinc-50 dark:border-zinc-700 rounded-xl dark:text-zinc-50 text-zinc-900">
        <code className="whitespace-pre-wrap break-words">{children}</code>
      </div>
    );
  } else {
    return (
      <code
        className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
        {...props}
      >
        {children}
      </code>
    );
  }
}
