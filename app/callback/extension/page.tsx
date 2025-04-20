'use client';

import { useEffect } from 'react';
import { toast } from '@/components/toast';
import { useRouter } from 'next/navigation';

function CallbackExtensionPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success') === 'true';

    if (success) {
      toast({
        type: 'success',
        description: 'Connected to extension successfully.',
      });
    } else {
      toast({
        type: 'error',
        description: 'Failed to connect to extension.',
      });
    }

    const timeout = setTimeout(() => {
      router.push('/extensions');
    }, 1000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-2xl font-bold">Processing extension connection...</h1>
      <p className="text-gray-500 mt-2" role="status" aria-live="polite">
        Please wait while we process your request.
      </p>
      <div className="loader mt-4" />
    </div>
  );
}

export default CallbackExtensionPage;
