import { LoginForm } from '@/app/(auth)/_components/login-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Botion',
  description: 'Login Page',
};

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
