'use client'

import { LoginForm } from '@/app/(auth)/_components/login-form'
import { toast } from '@/components/toast'
import { useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

function LoginPageContent() {
  const searchParams = useSearchParams()
  const activated = searchParams ? searchParams.get('activated') : null

  useEffect(() => {
    if (activated === 'success') {
      toast({
        type: 'success',
        description: 'Account activated successfully. Please log in.',
      })
    } else if (activated === 'error') {
      toast({
        type: 'error',
        description: 'Account activation failed. Please request a new link.',
      })
    }
  }, [activated])

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
