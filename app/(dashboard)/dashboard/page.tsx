import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { GiftList, GiftItem, RetailerLink } from '@/types/database'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch gift lists for the authenticated user
  const { data: lists, error: listsError } = await supabase
    .from('gift_lists')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at')

  if (listsError) {
    console.error('Error fetching gift lists:', listsError)
  }

  const giftLists: GiftList[] = lists || []
  const listIds = giftLists.map((list) => list.id)

  // Fetch gift items for these lists
  let giftItems: GiftItem[] = []
  if (listIds.length > 0) {
    const { data: items, error: itemsError } = await supabase
      .from('gift_items')
      .select('*')
      .in('list_id', listIds)
      .order('sort_order')

    if (itemsError) {
      console.error('Error fetching gift items:', itemsError)
    }

    giftItems = items || []
  }

  const itemIds = giftItems.map((item) => item.id)

  // Fetch retailer links for these items
  let retailerLinks: RetailerLink[] = []
  if (itemIds.length > 0) {
    const { data: links, error: linksError } = await supabase
      .from('retailer_links')
      .select('*')
      .in('item_id', itemIds)
      .order('created_at')

    if (linksError) {
      console.error('Error fetching retailer links:', linksError)
    }

    retailerLinks = links || []
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <DashboardShell
        lists={giftLists}
        items={giftItems}
        links={retailerLinks}
      />
    </div>
  )
}
