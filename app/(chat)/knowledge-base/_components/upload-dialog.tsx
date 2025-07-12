'use client';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { InfoIcon } from '@/components/icons';
import { useState, useEffect } from 'react';
import {toast} from '@/components/toast';
import * as Accordion from '@radix-ui/react-accordion';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useThreadStore } from '@/store/thread-store';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (
    file: File,
    name: string,
    description: string,
    is_global: boolean,
    thread_id?: string | null,
    chunkSize?: number,
    chunkOverlap?: number
  ) => void;
  user?: any;
}

export function UploadDialog({ open, onOpenChange, onUpload, user }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [descError, setDescError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGlobal, setIsGlobal] = useState(true);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [threadError, setThreadError] = useState<string | null>(null);
  const [chunkSize, setChunkSize] = useState<number>(1000);
  const [chunkOverlap, setChunkOverlap] = useState<number>(100);
  const [advancedError, setAdvancedError] = useState<string | null>(null);
  const threads = useThreadStore((state) => state.threads);
  const fetchThreads = useThreadStore((state) => state.fetchThreads);

  useEffect(() => {
    if (open && user) fetchThreads(user);
  }, [open, user, fetchThreads]);

  useEffect(() => {
    if (isGlobal) setThreadId(null);
  }, [isGlobal]);

  const handleSubmit = async () => {
    setDescError(null);
    setThreadError(null);
    setAdvancedError(null);
    if (!file) {
      toast({ type: 'error', description: 'Select a file' });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast({ type: 'error', description: 'File too large (max 50MB)' });
      return;
    }
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !['txt', 'md', 'pdf', 'docx', 'xlsx', 'pptx'].includes(ext)) {
      toast({ type: 'error', description: 'Invalid file type' });
      return;
    }
    // Description validation: required, <= 100 words, <= 500 chars
    const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
    if (!description.trim()) {
      setDescError('Description is required');
      return;
    }
    if (wordCount > 100) {
      setDescError('Description must be 100 words or fewer');
      return;
    }
    if (description.length > 500) {
      setDescError('Description must be 500 characters or fewer');
      return;
    }
    if (!isGlobal && !threadId) {
      setThreadError('Please select a thread');
      return;
    }
    // Advanced settings validation
    if (chunkSize <= 0) {
      setAdvancedError('Chunk size must be greater than 0');
      return;
    }
    if (chunkOverlap < 0) {
      setAdvancedError('Chunk overlap must be 0 or greater');
      return;
    }
    if (chunkOverlap >= chunkSize) {
      setAdvancedError('Chunk overlap must be less than chunk size');
      return;
    }
    setLoading(true);
    try {
      await onUpload(
        file,
        file.name,
        description,
        isGlobal,
        isGlobal ? null : threadId,
        chunkSize,
        chunkOverlap
      );
      setFile(null);
      setDescription('');
      setIsGlobal(true);
      setThreadId(null);
      setChunkSize(1000);
      setChunkOverlap(100);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 px-1">
          <div className="flex items-center gap-2 justify-between">
            <Label htmlFor="global-upload" className="flex items-center gap-1">
              Global
              <span className="group relative inline-flex">
                <span className="text-muted-foreground cursor-pointer">
                  <InfoIcon size={11} />
                </span>
                <span className="absolute left-1/2 z-10 mt-2 hidden w-[260px] -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:block group-hover:opacity-100 transition-opacity pointer-events-none">
                  This file could be accessed by all threads
                </span>
              </span>
            </Label>
            <Switch id="global-upload" checked={isGlobal} onCheckedChange={setIsGlobal} />
          </div>
          {!isGlobal && (
            <div className="flex flex-col w-full gap-1.5">
              <Label htmlFor="thread">Thread <span className="text-red-500">*</span></Label>
              <div className="w-full">
                <select
                  id="thread"
                  className={`w-full border rounded px-2 py-1 ${threadError ? 'border-red-500' : ''}`}
                  value={threadId || ''}
                  onChange={(e) => setThreadId(e.target.value || null)}
                >
                  <option value="">Select a thread</option>
                  {threads.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>
              {threadError && <span className="text-xs text-red-500">{threadError}</span>}
            </div>
          )}
          <div className="grid w-full gap-1.5 relative">
            <Label htmlFor="file" className="flex items-center gap-1">
              File
              <span className="group relative inline-flex">
                <InfoIcon size={11} />
                <span className="absolute left-1/2 z-10 mt-2 hidden w-[260px] -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:block group-hover:opacity-100 transition-opacity pointer-events-none">
                  Accepted: .txt, .md, .pdf, .docx, .xlsx, .pptx. Max size: 50MB
                </span>
              </span>
            </Label>
            <Input id="file" type="file" accept=".txt,.md,.pdf,.docx,.xlsx,.pptx" onChange={handleFile} />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="desc">Description <span className="text-red-500">*</span></Label>
            <Textarea
              id="desc"
              placeholder="Brief description (required, ≤ 100 words, ≤ 500 characters)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              className={descError ? 'border-red-500' : ''}
            />
            {descError && <span className="text-xs text-red-500">{descError}</span>}
          </div>
        </div>
        <Accordion.Root type="single" collapsible className="w-full">
          <Accordion.Item value="advanced" className="border rounded">
            <Accordion.Header>
              <Accordion.Trigger className="w-full flex items-center justify-between px-2 py-2 font-medium text-left">
                Advanced settings
                <span className="ml-2">▼</span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="px-2 pb-2 flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <Label htmlFor="chunk-size">Chunk size</Label>
                <Input
                  id="chunk-size"
                  type="number"
                  min={1}
                  value={chunkSize}
                  onChange={e => setChunkSize(Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="chunk-overlap">Chunk overlap</Label>
                <Input
                  id="chunk-overlap"
                  type="number"
                  min={0}
                  value={chunkOverlap}
                  onChange={e => setChunkOverlap(Number(e.target.value))}
                />
              </div>
              {advancedError && <span className="text-xs text-red-500 mt-1">{advancedError}</span>}
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
