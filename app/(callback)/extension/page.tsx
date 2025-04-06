'use client';

import { useEffect, useState } from 'react';
import { toast } from '@/components/toast';
import { useRouter } from 'next/navigation';

function CallbackExtensionPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSuccess(params.get('success') === 'true');
  }, []);

  useEffect(() => {
    if (success) {
      toast({ type: 'success', description: 'Connect to extension successfully' });
    }
    router.push('/extensions');
  }, [success, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Connect extension successfully</h1>
      <p className="text-gray-500">Please wait while we process your request ...</p>
      <div className="loader mt-4"></div>
    </div>
  );
}

export default CallbackExtensionPage;
