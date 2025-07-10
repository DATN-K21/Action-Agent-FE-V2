'use client'

import { getUserProfile, IUserProfile } from '@/services/user-service'
import type { User } from 'next-auth'
import { useEffect, useState } from 'react'

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[90%] w-full p-5 sm:p-6">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-xl">My Profile</DialogTitle>
          <DialogDescription>Manage your account information.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={profile?.email ?? user.email ?? ''} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label>Full Name</Label>
            <Input id="fullname" type="text" value={profile?.fullname ?? ''} disabled />
          </div>
          <div className="grid gap-2">
            <Label>Avatar</Label>
            <Input id="avatar" type="text" value={profile?.avatar ?? ''} disabled />
          </div>
          <div className="grid gap-2">
            <Label>Remaining Balance</Label>
            <div className="flex items-center justify-between gap-2">
              <span>${profile?.balance?.toFixed(2) ?? '0.00'}</span>
              <Button size="sm" variant="outline" asChild>
                <a href="#">Pay more</a>
              </Button>
            </div>
          </div>
          <Button variant="outline" asChild className="w-fit">
            <a href="#">Change password</a>
          </Button>
        </div>
        <DialogFooter className="sm:flex-row flex-col gap-2 sm:gap-0 mt-2 pt-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full sm:w-auto order-2 sm:order-1">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} className="w-full sm:w-auto order-1 sm:order-2">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}