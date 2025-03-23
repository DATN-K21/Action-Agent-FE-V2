import type { Metadata } from 'next';
import { SignOutForm } from '@/app/(auth)/_components/signout-form';

export const metadata: Metadata = {
    title: 'Sign Out - Botion',
    description: 'Sign Out Page',
};

export default function Page() {
    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <SignOutForm />
        </div>
    );
}
