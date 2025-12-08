import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
  Alert,
  Linking,
  Share,
} from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { colors } from '../../lib/constants/colors'
import { getSupabase } from '../../lib/supabase/client'
import {
  FAB,
  EmptyState,
  Card,
  Badge,
  ConfirmDialog,
  FilterBar,
  BottomActionBar,
  SkeletonList,
} from '../../components/ui'
import { ItemFormSheet } from '../../components/items/ItemFormSheet'
import { useGiftItems } from '../../hooks/useGiftItems'
import { useToast } from '../../providers/ToastProvider'
import { useHaptics } from '../../hooks/useHaptics'
import { usePrivacy } from '../../providers/PrivacyProvider'
import type { GiftList, GiftItemWithLinks, CreateItemInput, UpdateItemInput, FilterType } from '../../lib/types'

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { items, isLoading, error, fetch, create, update, remove, toggleComplete, bulkMarkComplete } = useGiftItems()
  const { showToast } = useToast()
  const haptics = useHaptics()
  const { isBlurred } = usePrivacy()

  const [list, setList] = useState<GiftList | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<GiftItemWithLinks | undefined>()

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<GiftItemWithLinks | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter state
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  // Selection state
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isBulkUpdating, setIsBulkUpdating] = useState(false)

  // Fetch list details and items
  const fetchAll = useCallback(async () => {
    if (!id) return

    try {
      const supabase = getSupabase()

      // Fetch list details
      const { data: listData, error: listError } = await supabase
        .from('gift_lists')
        .select('id, user_id, name, color, created_at, updated_at')
        .eq('id', id)
        .single()

      if (listError) throw listError
      setList(listData)

      // Fetch items
      await fetch(id)
    } catch (err) {
      console.error('Fetch error:', err)
    }
  }, [id, fetch])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await fetchAll()
    setIsRefreshing(false)
  }, [fetchAll])

  // Filter counts
  const filterCounts = useMemo(() => {
    return {
      all: items.length,
      required: items.filter(i => i.status === 'required').length,
      optional: items.filter(i => i.status === 'optional').length,
      'high-value': items.filter(i => i.value_tag === 'HIGH').length,
    }
  }, [items])

  // Filtered items
  const filteredItems = useMemo(() => {
    switch (activeFilter) {
      case 'required':
        return items.filter(i => i.status === 'required')
      case 'optional':
        return items.filter(i => i.status === 'optional')
      case 'high-value':
        return items.filter(i => i.value_tag === 'HIGH')
      default:
        return items
    }
  }, [items, activeFilter])

  // Calculate running totals (from filtered items)
  const totals = useMemo(() => {
    let lowTotal = 0
    let highTotal = 0
    let purchasedCount = 0

    filteredItems.forEach(item => {
      if (item.price_low) lowTotal += item.price_low
      if (item.price_high) highTotal += item.price_high
      if (item.is_completed) purchasedCount++
    })

    return { lowTotal, highTotal, purchasedCount, total: filteredItems.length }
  }, [filteredItems])

  // Filter options
  const filterOptions = useMemo(() => [
    { value: 'all' as FilterType, label: 'All', count: filterCounts.all },
    { value: 'required' as FilterType, label: 'Required', count: filterCounts.required },
    { value: 'optional' as FilterType, label: 'Optional', count: filterCounts.optional },
    { value: 'high-value' as FilterType, label: 'High Value', count: filterCounts['high-value'] },
  ], [filterCounts])

  // Selection helpers
  const toggleSelection = useCallback((itemId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }, [])

  const enterSelectionMode = useCallback((initialItemId?: string) => {
    setIsSelectionMode(true)
    if (initialItemId) {
      setSelectedIds(new Set([initialItemId]))
    }
  }, [])

  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false)
    setSelectedIds(new Set())
  }, [])

  // Bulk actions
  const handleBulkMarkPurchased = async () => {
    if (selectedIds.size === 0) return

    setIsBulkUpdating(true)
    const result = await bulkMarkComplete(Array.from(selectedIds), true)
    setIsBulkUpdating(false)

    if (result.success) {
      haptics.success()
      showToast(`${selectedIds.size} items marked as purchased`, 'success')
      exitSelectionMode()
    } else {
      haptics.error()
      showToast(result.error || 'Failed to update items', 'error')
    }
  }

  const handleShareLinks = async () => {
    const selectedItems = items.filter(i => selectedIds.has(i.id))
    const links: string[] = []

    selectedItems.forEach(item => {
      if (item.retailer_links && item.retailer_links.length > 0) {
        item.retailer_links.forEach(link => {
          links.push(`${item.name} - ${link.store_name}: ${link.url}`)
        })
      }
    })

    if (links.length === 0) {
      showToast('No retailer links to share', 'info')
      return
    }

    try {
      await Share.share({
        message: links.join('\n\n'),
        title: `Gift Links from ${list?.name || 'List'}`,
      })
    } catch (err) {
      console.error('Share error:', err)
    }
  }

  const handleCreateItem = async (data: CreateItemInput) => {
    const result = await create(data)
    if (result.success) {
      haptics.success()
      showToast('Item added!', 'success')
    } else {
      haptics.error()
    }
    return result
  }

  const handleUpdateItem = async (data: UpdateItemInput) => {
    if (!editingItem) return { success: false, error: 'No item selected' }
    const result = await update(editingItem.id, data)
    if (result.success) {
      haptics.success()
      showToast('Item updated', 'success')
    } else {
      haptics.error()
    }
    return result
  }

  const handleDeleteItem = async () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    const result = await remove(deleteTarget.id)
    setIsDeleting(false)
    setDeleteTarget(null)

    if (result.success) {
      haptics.success()
      showToast('Item deleted', 'success')
    } else {
      haptics.error()
      showToast(result.error || 'Failed to delete', 'error')
    }
  }

  const handleToggleComplete = async (item: GiftItemWithLinks) => {
    haptics.light()
    const result = await toggleComplete(item.id, item.is_completed)
    if (result.success) {
      showToast(
        item.is_completed ? 'Marked as not purchased' : 'Marked as purchased!',
        'success'
      )
    }
  }

  const handleItemPress = (item: GiftItemWithLinks) => {
    if (isSelectionMode) {
      haptics.selection()
      toggleSelection(item.id)
    } else {
      handleToggleComplete(item)
    }
  }

  const handleLongPress = (item: GiftItemWithLinks) => {
    haptics.medium()
    if (isSelectionMode) {
      // In selection mode, just toggle
      toggleSelection(item.id)
    } else {
      // Show action sheet
      Alert.alert(
        item.name,
        'What would you like to do?',
        [
          {
            text: 'Select',
            onPress: () => enterSelectionMode(item.id),
          },
          {
            text: 'Edit',
            onPress: () => {
              setEditingItem(item)
              setShowForm(true)
            },
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => setDeleteTarget(item),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      )
    }
  }

  const openCreateForm = () => {
    haptics.light()
    setEditingItem(undefined)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingItem(undefined)
  }

  const openRetailerLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      showToast('Could not open link', 'error')
    })
  }

  const renderItem = ({ item }: { item: GiftItemWithLinks }) => {
    const isSelected = selectedIds.has(item.id)

    return (
      <Card
        completed={item.is_completed}
        selected={isSelectionMode && isSelected}
        onPress={() => handleItemPress(item)}
        onLongPress={() => handleLongPress(item)}
        style={styles.itemCard}
      >
        <View style={styles.itemHeader}>
          {isSelectionMode && (
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <FontAwesome name="check" size={12} color="#fff" />}
            </View>
          )}
          <Text style={[styles.itemName, item.is_completed && styles.itemNameCompleted]}>
            {item.name}
          </Text>
          <Badge variant={item.status === 'required' ? 'required' : 'optional'} />
        </View>

        {item.notes && (
          <Text style={styles.itemNotes} numberOfLines={2}>
            {item.notes}
          </Text>
        )}

        {(item.price_low || item.price_high) && (
          <Text style={[styles.itemPrice, isBlurred && styles.blurred]}>
            {isBlurred
              ? '••••'
              : item.price_low && item.price_high
              ? `$${item.price_low} - $${item.price_high}`
              : item.price_low
              ? `$${item.price_low}+`
              : `Up to $${item.price_high}`}
          </Text>
        )}

        {/* Retailer Links */}
        {item.retailer_links && item.retailer_links.length > 0 && (
          <View style={styles.retailerSection}>
            <Text style={styles.retailerLabel}>
              {item.retailer_links.length} {item.retailer_links.length === 1 ? 'store' : 'stores'}
            </Text>
            <View style={styles.retailerGrid}>
              {item.retailer_links.slice(0, 4).map((link) => (
                <Pressable
                  key={link.id}
                  style={styles.retailerCard}
                  onPress={() => openRetailerLink(link.url)}
                >
                  <Text style={styles.retailerName} numberOfLines={1}>
                    {link.store_name}
                  </Text>
                  {link.price && (
                    <Text
                      style={[
                        styles.retailerPrice,
                        link.is_best_price && styles.retailerBestPrice,
                        isBlurred && styles.blurred,
                      ]}
                    >
                      {isBlurred ? '••' : `$${link.price}`}
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {item.is_completed && (
          <Badge variant="purchased" style={styles.purchasedBadge} />
        )}
      </Card>
    )
  }

  if (isLoading && items.length === 0) {
    return (
      <>
        <Stack.Screen
          options={{
            title: list?.name || 'Loading...',
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
          }}
        />
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
          <SkeletonList count={5} />
        </SafeAreaView>
      </>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: list?.name || 'List',
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerRight: isSelectionMode
            ? () => (
                <Pressable onPress={exitSelectionMode} style={styles.headerButton}>
                  <Text style={styles.headerButtonText}>Cancel</Text>
                </Pressable>
              )
            : undefined,
        }}
      />
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        {/* Filter Bar */}
        {items.length > 0 && (
          <FilterBar
            options={filterOptions}
            selected={activeFilter}
            onSelect={setActiveFilter}
          />
        )}

        {/* Running Totals Header */}
        {filteredItems.length > 0 && (
          <View style={styles.totalsBar}>
            <View>
              <Text style={styles.totalsCount}>
                {totals.purchasedCount}/{totals.total} purchased
              </Text>
            </View>
            <View>
              <Text style={[styles.totalsPrice, isBlurred && styles.blurred]}>
                {isBlurred ? '••••' : `$${totals.lowTotal.toFixed(0)} - $${totals.highTotal.toFixed(0)}`}
              </Text>
            </View>
          </View>
        )}

        {error ? (
          <EmptyState
            icon="⚠️"
            title="Something went wrong"
            subtitle={error}
            actionLabel="Try Again"
            onAction={fetchAll}
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon="📝"
            title="No items yet"
            subtitle="Add gift ideas to this list"
            actionLabel="Add Item"
            onAction={openCreateForm}
          />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No matching items"
            subtitle={`No ${activeFilter === 'high-value' ? 'high value' : activeFilter} items found`}
            actionLabel="Show All"
            onAction={() => setActiveFilter('all')}
          />
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={[
              styles.listContent,
              isSelectionMode && styles.listContentWithBar,
            ]}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={colors.accent}
              />
            }
          />
        )}

        {!isSelectionMode && (
          <FAB
            onPress={openCreateForm}
            accessibilityLabel="Add new item"
          />
        )}

        {isSelectionMode && selectedIds.size > 0 && (
          <BottomActionBar
            selectedCount={selectedIds.size}
            onMarkPurchased={handleBulkMarkPurchased}
            onShareLinks={handleShareLinks}
            onCancel={exitSelectionMode}
            loading={isBulkUpdating}
          />
        )}

        <ItemFormSheet
          visible={showForm}
          listId={id || ''}
          item={editingItem}
          onSave={async (data) => {
            if (editingItem) {
              return handleUpdateItem(data as UpdateItemInput)
            }
            return handleCreateItem(data as CreateItemInput)
          }}
          onClose={closeForm}
        />

        <ConfirmDialog
          visible={!!deleteTarget}
          title={`Delete "${deleteTarget?.name}"?`}
          message="This item and all its retailer links will be permanently deleted."
          confirmLabel="Delete"
          onConfirm={handleDeleteItem}
          onCancel={() => setDeleteTarget(null)}
          loading={isDeleting}
        />
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerButtonText: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '500',
  },
  totalsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  totalsCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  totalsPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  listContentWithBar: {
    paddingBottom: 140,
  },
  itemCard: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  itemNameCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  itemNotes: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
    marginTop: 4,
  },
  retailerSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  retailerLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  retailerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  retailerCard: {
    backgroundColor: colors.border,
    borderRadius: 8,
    padding: 10,
    minWidth: '47%',
    flex: 1,
  },
  retailerName: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  retailerPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accent,
  },
  retailerBestPrice: {
    color: colors.success,
  },
  purchasedBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  blurred: {
    opacity: 0.4,
    letterSpacing: 2,
  },
})
