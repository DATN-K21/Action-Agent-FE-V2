'use client';

import { useEffect } from 'react';
import { toast } from '@/components/toast';
import { useRouter } from 'next/navigation';
import { activateAccount } from '@/services/auth-service';

function CallbackAccountActivationPage() {
  const router = useRouter();

  useEffect(() => {
    const activate = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        toast({
          type: 'error',
          description: 'Invalid activation link. Please check your email.',
        });
        router.push('/login');
        return;
      }

      try {
        await activateAccount(token);
        toast({
          type: 'success',
          description: 'Account activated successfully. You can now log in.',
        });
      } catch (error) {
        toast({
          type: 'error',
          description: 'Activation failed. Please try again or contact support.',
        });
      }

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    };

    activate();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-2xl font-bold">Activating your account...</h1>
      <p className="text-gray-500 mt-2" role="status" aria-live="polite">
        Please wait while we complete the activation process.
      </p>
      <div className="loader mt-4" />
    </div>
  );
}

export default CallbackAccountActivationPage;
