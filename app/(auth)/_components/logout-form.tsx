'use client';

import { toast } from '@/components/toast';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';

export const LogoutForm = () => {
    const router = useRouter();

    useEffect(() => {
        handleLogOut();
    }, []);

    const handleLogOut = async () => {
        try {
            toast({
                type: 'success',
                description: 'You need to log in again',
            });
        } catch (error: any) {
            console.log(error);
            toast({
                type: 'error',
                description: error?.json?.message || 'An unexpected error occurred',
            });
        } finally {
            await signOut();
            router.push('/login');
        }
    };

    return <h1 className="text-4xl">Logging out...</h1>;
};
