import * as React from 'react'

import { SearchForm } from '@/components/search-form'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar'

import Image from 'next/image'

import Link from 'next/link'
import { SidebarData } from './sidebar-data'

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href='/dashboard' className='flex items-center gap-2 pl-2'>
          <Image src='/noteforge-logo.png' alt='Logo' width={32} height={32} />
          <h2>NoteForge</h2>
        </Link>

        <React.Suspense>
          <SearchForm />
        </React.Suspense>
      </SidebarHeader>
      <SidebarContent className='gap-0'>
        <SidebarData />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
