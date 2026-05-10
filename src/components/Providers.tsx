'use client'

import { LayoutProvider } from '@/context/LayoutContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <LayoutProvider>{children}</LayoutProvider>
}