'use client';

import { AttachmentIcon, BoxIcon, GlobeIcon } from '@/components/icons';
import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import {
  deleteUpload,
  getUploads,
  initiateUpload,
  processUpload,
  reInitiateUpload,
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

  const handleUpload = async (file: File, name: string, description: string) => {
    try {
      const initRes = await initiateUpload({
        user,
        payload: {
          filename: file.name,
          file_size_bytes: file.size,
          name,
          description,
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
          <p className="text-sm md:text-base text-muted-foreground">Your uploaded files</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-2 size-4" /> New
        </Button>
      </div>
      <div className="mt-4">
        {loading ? (
          <p className="text-sm">Loading...</p>
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
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">Status:</span>
                {up.status === 'Uploading' && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-medium text-xs animate-pulse">Uploading</span>
                )}
                {up.status === 'Ingesting' && (
                  <span className="px-2 py-0.5 rounded-md bg-yellow-100 text-yellow-800 font-medium text-xs animate-pulse">Ingesting</span>
                )}
                {up.status === 'Completed' && (
                  <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-800 font-medium text-xs">Completed</span>
                )}
                {up.status === 'Failed' && (
                  <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-medium text-xs">Failed</span>
                )}
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
      />
    </div>
  );
}