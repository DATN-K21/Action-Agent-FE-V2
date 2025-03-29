'use client'

import { toast } from '@/components/toast';
import { logout } from '@/services/auth-service';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const LogoutForm = ({ user }: { user: User | undefined }) => {
  const router = useRouter()

  useEffect(() => {
    handleLogOut()
  }, [])

  const handleLogOut = async () => {
    try {
      if (user) {
        logout(user)
      }

      toast({
        type: 'success',
        description: 'You need to log in again',
      })
    } catch (error: any) {
      toast({
        type: 'error',
        description: error?.json?.message || 'An unexpected error occurred',
      })
    } finally {
      await signOut()
      router.push('/login')
    }
  }

  return <h1 className="text-4xl">Logging out...</h1>
}
