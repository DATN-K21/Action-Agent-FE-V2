'use client';

import { AttachmentIcon, BoxIcon, GlobeIcon } from '@/components/icons';
import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { UploadListSkeleton } from '@/components/skeleton/upload-list-skeleton';
import {
  deleteUpload,
  getUploads,
  initiateUpload,
  processUpload,
  reInitiateUpload,
  getUploadStatus,
} from '@/services/upload-service';
import { IUpload } from '@/types/upload';
import { Plus, RotateCcw, Trash } from 'lucide-react';
import { User } from 'next-auth';
import { useCallback, useEffect, useState } from 'react';
import UploadDialog from './upload-dialog';

export default function UploadList({ user }: { user: User }) {
  const [uploads, setUploads] = useState<IUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchUploads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUploads({ user });
      setUploads(data);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      toast({ type: 'error', description: 'Failed to fetch uploads' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

  const pollUploadStatus = async (uploadId: string) => {
    let polling = true;
    while (polling) {
      try {
        const statusRes = await getUploadStatus({ user, uploadId });
        if (statusRes.uploadStatus === 'Completed' || statusRes.uploadStatus === 'Failed') {
          polling = false;
          fetchUploads();
        } else {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      } catch (err) {
        console.error('Polling upload status failed:', err);
        polling = false;
        fetchUploads();
      }
    }
  };

  const handleUpload = async (
    file: File,
    name: string,
    description: string,
    is_global: boolean,
    thread_id?: string | null
  ) => {
    try {
      const initRes = await initiateUpload({
        user,
        payload: {
          filename: file.name,
          file_size_bytes: file.size,
          name,
          description,
          thread_id: is_global ? null : thread_id,
        },
      });

      // Step 1: create append blob
      const res1 = await fetch(initRes.uploadUrl, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'AppendBlob',
          'Content-Length': '0',
        },
      });

      if (!res1.ok) throw new Error('Failed to create append blob');

      // Step 2: append file data
      const res2 = await fetch(`${initRes.uploadUrl}&comp=appendblock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: file,
      });

      if (!res2.ok) throw new Error('Failed to upload data');

      // Step 3: process upload
      await processUpload({ user, uploadId: initRes.uploadId });
      toast({ type: 'success', description: 'File uploaded' });
      fetchUploads();
      pollUploadStatus(initRes.uploadId);
    } catch (error) {
      console.error('Upload error:', error);
      toast({ type: 'error', description: 'Upload failed' });
    }
  };

  const handleReupload = async (up: IUpload) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,.pdf,.docx';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 50 * 1024 * 1024) {
        toast({ type: 'error', description: 'File too large (max 50MB)' });
        return;
      }
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !['txt', 'md', 'pdf', 'docx'].includes(ext)) {
        toast({ type: 'error', description: 'Invalid file type' });
        return;
      }
      try {
        const initRes = await reInitiateUpload({ user, uploadId: up.id });
        const r1 = await fetch(initRes.uploadUrl, {
          method: 'PUT',
          headers: {
            'x-ms-blob-type': 'AppendBlob',
            'Content-Length': '0',
          },
        });
        if (!r1.ok) throw new Error('Failed to create append blob');
        const r2 = await fetch(`${initRes.uploadUrl}&comp=appendblock`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/octet-stream' },
          body: file,
        });
        if (!r2.ok) throw new Error('Failed to upload data');
        await processUpload({ user, uploadId: up.id });
        toast({ type: 'success', description: 'File uploaded' });
        fetchUploads();
        pollUploadStatus(up.id);
      } catch (err) {
        console.error('Re-upload failed:', err);
        toast({ type: 'error', description: 'Re-upload failed' });
      }
    };
    input.click();
  };

  const handleDelete = async (up: IUpload) => {
    try {
      await deleteUpload({ user, uploadId: up.id });
      toast({ type: 'success', description: 'File deleted' });
      fetchUploads();
    } catch (err) {
      console.error('Delete failed:', err);
      toast({ type: 'error', description: 'Delete failed' });
    }
  };

  return (
    <div className="flex flex-col w-full px-2 md:px-4">
      <div className="flex items-center justify-between mt-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your uploaded files to chat with Action Agent.</p>
        </div>
        <Button className="w-full md:w-auto" size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-2 size-4" /> New
        </Button>
      </div>
      <div className="mt-4">
        {loading ? (
          <UploadListSkeleton />
        ) : uploads.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-sm text-muted-foreground">
            <BoxIcon size={32} />
            <span>No files uploaded yet. Use the &quot;New&quot; button to add one.</span>
          </div>
        ) : (
          <ul className="grid gap-4 pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3">
            {uploads.map((up) => (
              <li key={up.id} className="rounded-lg border p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold">
                    {up.threadId ? <AttachmentIcon /> : <GlobeIcon />}
                    <span className="truncate">{up.name}</span>
                  </div>
                  {up.status === 'Uploading' ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-700 hover:bg-green-100 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 border-0 rounded-md"
                      onClick={() => handleReupload(up)}
                    >
                      <RotateCcw className="size-4" />
                    </Button>
                  ) : (up.status === 'Completed' || up.status === 'Failed') ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-700 hover:bg-red-100 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 border-0 rounded-md"
                      onClick={() => handleDelete(up)}
                    >
                      <Trash className="size-4" />
                    </Button>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground truncate">{up.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Status:</span>
                <span
                  className={
                    `inline-block w-3 h-3 rounded-full border border-gray-300 ` +
                    (up.status === 'Uploading'
                      ? 'bg-yellow-300 animate-pulse'
                      : up.status === 'Ingesting'
                      ? 'bg-orange-400 animate-pulse'
                      : up.status === 'Completed'
                      ? 'bg-green-500'
                      : up.status === 'Failed'
                      ? 'bg-red-500'
                      : 'bg-gray-200')
                  }
                  title={up.status}
                />
                <span className="text-xs">
                  {up.status === 'Uploading' && 'Uploading'}
                  {up.status === 'Ingesting' && 'Ingesting'}
                  {up.status === 'Completed' && 'Completed'}
                  {up.status === 'Failed' && 'Failed'}
                </span>
              </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <UploadDialog
        open={open}
        onOpenChange={setOpen}
        onUpload={handleUpload}
        user={user}
      />
    </div>
  );
}