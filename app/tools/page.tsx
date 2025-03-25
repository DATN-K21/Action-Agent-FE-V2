import ExtensionList from './_components/extension-list'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tools - Botion',
  description: 'Tools Page',
}

export default function Page() {
  return <ExtensionList />
}
