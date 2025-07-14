'use client';
import { ChevronUp } from 'lucide-react';
import type { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import { ProfileDialog } from '@/components/profile-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { logout } from '@/services/auth-service';

export function SidebarUserNav({ user }: { user: User }) {
  const [openProfile, setOpenProfile] = useState(false);

  const handleLogOut = async () => {
    try {
      await logout(user);
    } catch (error: any) {
      console.error(error);
    } finally {
      await signOut();
    }
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10">
                <span className="truncate">{user?.email}</span>
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
            <DropdownMenuItem className="cursor-pointer" onSelect={() => setOpenProfile(true)}>
              My profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                type="button"
                className="w-full cursor-pointer"
                onClick={() => handleLogOut()}
              >
                Sign out
              </button>
            </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <ProfileDialog user={user} open={openProfile} onOpenChange={setOpenProfile} />
    </>
  );
}