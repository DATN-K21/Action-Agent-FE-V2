'use client'

import type { User } from 'next-auth'
import { useRouter } from 'next/navigation'

import { PlusIcon } from '@/components/icons'
import SidebarHistory from '@/components/sidebar-history'
import { SidebarUserNav } from '@/components/sidebar-user-nav'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { NavCustom } from '@/components/nav-custom'

import { HiOutlineViewGrid, HiOutlineChatAlt } from 'react-icons/hi'

type navCustomItemProps = {
  title: string
  url: string
  icon: any
}

const navCustomItems: navCustomItemProps[] = [
  {
    title: 'New Chat',
    url: '/',
    icon: HiOutlineChatAlt,
  },
  {
    title: 'Extensions',
    url: '/extensions',
    icon: HiOutlineViewGrid,
  },
]

export function AppSidebar({ user }: { user: User }) {
  const router = useRouter()
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false)
              }}
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                Botion
              </span>
            </Link>
            {/* <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={() => {
                    setOpenMobile(false)
                    router.push('/')
                    router.refresh()
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip> */}
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavCustom items={navCustomItems} />
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  )
}
