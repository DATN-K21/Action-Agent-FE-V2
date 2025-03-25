import { SignUpForm } from '@/app/(auth)/_components/signup-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - Botion',
  description: 'Sign Up Page',
}

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <SignUpForm />
    </div>
  )
}
