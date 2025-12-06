import type { Metadata } from 'next'
import { LogoutButton } from './logout-button'

export const metadata: Metadata = {
  title: 'Dashboard | GiftWise',
  description: 'Manage your gift lists',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e4e4e7]">
      <header className="border-b border-[#2d2d2d] bg-[#141414]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#6366f1]">GiftWise</h1>
          <div className="flex items-center gap-4">
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
