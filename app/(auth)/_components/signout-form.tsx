'use client';

import { Logout } from '@/services/auth-service';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from '@/components/toast';
import React from 'react';

export const SignOutForm = () => {
  const router = useRouter();

  useEffect(() => {
    handleLogOut();
  }, []);

  const handleLogOut = async () => {
    try {
      await Logout();

      toast({
        type: 'error',
        description: 'You have been successfully logged out.',
      });
    } catch (error: any) {
      toast({
        type: 'error',
        description: error?.message || 'An unexpected error occurred',
      });
    } finally {
      await signOut();
      router.push('/login');
    }
  };

  return <h1 className="text-4xl">Logging out...</h1>;
};
