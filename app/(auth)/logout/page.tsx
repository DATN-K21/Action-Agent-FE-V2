import { LogoutForm } from '@/app/(auth)/_components/logout-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign Out - Botion',
    description: 'Sign Out Page',
};

export default function Page() {
    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <LogoutForm />
        </div>
    );
}
