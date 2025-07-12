'use client'

import { getUserProfile, IUserProfile } from '@/services/user-service'
import type { User } from 'next-auth'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '@/services/payment-service';
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

import { toast } from '@/components/toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


interface ProfileDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDialog({ user, open, onOpenChange }: ProfileDialogProps) {
  const [profile, setProfile] = useState<IUserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState<string>(user.username || '')
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('10');
  const [depositLoading, setDepositLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  // Polling for credits after payment
  const [polling, setPolling] = useState(false);
  const [pollAttempts, setPollAttempts] = useState(0);
  const maxPollAttempts = 10;
  const pollInterval = 2000; // 5 seconds
  const [initialBalance, setInitialBalance] = useState<number | null>(null);
  const pollAttemptsRef = React.useRef(0);
  useEffect(() => { pollAttemptsRef.current = pollAttempts }, [pollAttempts]);

  // Polling effect in parent (must not be nested)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (polling && pollAttempts < maxPollAttempts) {
      interval = setInterval(async () => {
        const currentAttempt = pollAttemptsRef.current + 1;
        console.log('[Polling] Fetching user profile for credits update, attempt:', currentAttempt);
        const updated = await getUserProfile(user);
        if (initialBalance !== null && updated.balance !== initialBalance) {
          setPolling(false);
          setPollAttempts(maxPollAttempts); // stop polling
          setProfile(updated);
          toast({ type: 'success', description: 'Payment succeeded' });
        } else {
          setPollAttempts((prev) => prev + 1);
          if (currentAttempt >= maxPollAttempts) {
            setPolling(false);
          }
        }
      }, pollInterval);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [polling, pollAttempts, initialBalance, user]);

  useEffect(() => {
    if (!open) return;
    if (!user.id) {
      toast({ type: 'error', description: 'User ID is missing' });
      return;
    }
    setLoading(true);
    getUserProfile(user)
      .then((data) => {
        setProfile(data);
        setName(data.username || '');
      })
      .catch(() => {
        toast({ type: 'error', description: 'Failed to fetch profile' });
      })
      .finally(() => setLoading(false));
  }, [user, open]);

  const handleSave = () => {
    toast({ type: 'success', description: 'Profile updated successfully' });
    onOpenChange(false);
  }

  // Deposit handler
  const handleDeposit = () => {
    setDepositDialogOpen(true);
  };

  const handleConfirmDeposit = async () => {
    if (!user?.id) return toast({ type: 'error', description: 'User ID missing' });
    let amountUsd = parseFloat(depositAmount);
    if (isNaN(amountUsd) || amountUsd <= 0 || amountUsd >= 10000) {
      toast({ type: 'error', description: 'Please enter an amount greater than 0 and less than 10,000.' });
      return;
    }
    setDepositLoading(true);
    try {
      const response = await createPaymentIntent({ user, amountUsd });
      const secret = (response as any)?.data?.clientSecret ?? (response as any)?.clientSecret;
      if (!secret) throw new Error('No client secret');
      setClientSecret(secret);
    } catch (err: any) {
      toast({ type: 'error', description: err.message || 'Payment failed' });
      setDepositDialogOpen(false);
    } finally {
      setDepositLoading(false);
    }
  };

  // Stripe Elements payment form component
  function StripeCardForm({ clientSecret }: { clientSecret: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [isFormReady, setIsFormReady] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;
      setProcessing(true);
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {},
        redirect: 'if_required',
      });
      if (error) {
        toast({ type: 'error', description: error.message || 'Payment failed' });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast({ type: 'success', description: 'Waiting for payment!' });
        setDepositDialogOpen(false);
        setClientSecret(null);
        // Start polling for credits update in parent
        setInitialBalance(profile?.balance ?? null);
        setPollAttempts(0);
        pollAttemptsRef.current = 0;
        setTimeout(() => setPolling(true), 500); // ensure polling starts after dialog closes
      }
      setProcessing(false);
    };

    return (
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 mt-2 max-h-[400px] overflow-y-auto overflow-x-hidden min-w-0"
        style={{ overscrollBehavior: 'contain' }}
      >
        <PaymentElement
          options={{ paymentMethodOrder: ['card'] }}
          onReady={() => setIsFormReady(true)}
        />
        <div className="flex gap-2 justify-end">
          <Button variant="outline" type="button" onClick={() => { setDepositDialogOpen(false); setClientSecret(null); }} disabled={processing}>
            Cancel
          </Button>
          <Button type="submit" disabled={processing || !isFormReady}>
            {processing ? 'Processing...' : 'Pay'}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] max-w-[90%] w-full p-5 sm:p-6">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-xl">My Profile</DialogTitle>
            <DialogDescription>Manage your account information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <Input id="email" type="email" value={profile?.email ?? user.email ?? ''} disabled className="bg-gray-50 border border-gray-200" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-gray-700">Username</Label>
            <Input
              id="name"
              type="text"
              value={name}
              disabled
              className="bg-gray-50 border border-gray-200"
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-gray-700">Full Name</Label>
            <Input
              id="fullname"
              type="text"
              value={profile?.fullname ?? ''}
              onChange={e => setProfile(profile ? { ...profile, fullname: e.target.value } : null)}
              disabled={loading}
              className="bg-gray-50 border border-gray-200"
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-gray-700">Avatar</Label>
            {profile?.avatar && (
              <div className="flex items-center mb-2">
                <label htmlFor="avatar-upload" className="cursor-pointer group relative">
                  <img
                  src={profile.avatar}
                  alt="Avatar"
                  width={56}
                  height={56}
                  className="size-14 rounded-full border border-blue-200 shadow-sm object-cover group-hover:brightness-90 transition"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                    const url = URL.createObjectURL(file);
                    setProfile(profile ? { ...profile, avatar: url } : null);
                    }
                  }}
                  />
                  <span className="absolute bottom-0 inset-x-0 text-xs text-center text-white bg-black/40 rounded-b opacity-0 group-hover:opacity-100 transition">Change</span>
                </label>
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label className="text-gray-700">Credits</Label>
            <div>
              <div className="flex items-center justify-between gap-2 bg-gray-50 rounded px-3 py-2 border border-gray-200">
                <span className="flex items-center gap-2 text-base">
                  <Image src="/images/profile/atm.png" alt="ATM Icon" width={20} height={20} className="size-5 inline-block" />
                  <span className={
                    profile?.balance != null && Math.round(profile.balance) < 0
                      ? 'text-red-600 font-semibold'
                      : 'text-green-700 font-semibold'
                  }>
                    {profile?.balance != null ? Math.round(profile.balance) : '0'}
                  </span>
                  {polling && (
                    <span className="ml-2">
                      {/* @ts-ignore */}
                      {require('./icon').Icons.spinner({ className: 'inline-block animate-spin w-4 h-4 text-pink-500' })}
                    </span>
                  )}
                </span>
                <Button size="sm" variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-medium" type="button" onClick={handleDeposit}>
                  <Image src="/images/profile/atm.png" alt="ATM Icon" width={16} height={16} className="size-4" />
                  Deposit
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-right">
                1,000,000 credits = 1.00$
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:flex-row flex-col gap-2 sm:gap-0 mt-2 pt-2 justify-between">
          <div className="flex-1 flex sm:justify-start justify-center">
            <Button
              variant="outline"
              asChild
              className="w-fit border-pink-500 text-pink-700 bg-pink-50 hover:bg-pink-100 hover:border-pink-600 font-semibold shadow-sm transition-colors"
            >
              <a href="#">
                Change password
              </a>
            </Button>
          </div>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="w-full sm:w-auto order-2 sm:order-1">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSave} className="w-full sm:w-auto order-1 sm:order-2">
              Save
            </Button>
          </div>
        </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Deposit Amount Dialog - moved outside main DialogContent to avoid nested Dialog error */}
      <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <DialogContent className="max-w-md w-full p-5">
          <DialogHeader>
            <DialogTitle>Deposit Credits</DialogTitle>
            <DialogDescription>
                {clientSecret
                ? 'Please complete your payment below to deposit credits to your account.'
                : 'Specify the amount in USD you wish to deposit to your credits balance.'}
            </DialogDescription>
          </DialogHeader>
          {clientSecret ? (
            <Elements stripe={loadStripe(STRIPE_PUBLISHABLE_KEY!)} options={{ clientSecret }}>
              <StripeCardForm clientSecret={clientSecret} />
            </Elements>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              <Input
                type="number"
                min={1}
                step={1}
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                placeholder="Amount in USD"
                disabled={depositLoading}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" type="button" onClick={() => setDepositDialogOpen(false)} disabled={depositLoading}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleConfirmDeposit} disabled={depositLoading}>
                  {depositLoading ? 'Loading...' : 'Continue'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}