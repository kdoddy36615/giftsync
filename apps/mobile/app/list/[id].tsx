import { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../lib/constants/colors'
import { getSupabase } from '../../lib/supabase/client'

interface GiftItem {
  id: string
  name: string
  description: string | null
  status: 'required' | 'optional'
  min_price: number | null
  max_price: number | null
  is_completed: boolean
}

interface GiftList {
  id: string
  name: string
  description: string | null
}

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [list, setList] = useState<GiftList | null>(null)
  const [items, setItems] = useState<GiftItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')

  const fetchListAndItems = useCallback(async () => {
    if (!id) return

    try {
      const supabase = getSupabase()

      // Fetch list details
      const { data: listData, error: listError } = await supabase
        .from('gift_lists')
        .select('id, name, description')
        .eq('id', id)
        .single()

      if (listError) throw listError
      setList(listData)

      // Fetch items
      const { data: itemsData, error: itemsError } = await supabase
        .from('gift_items')
        .select('id, name, description, status, min_price, max_price, is_completed')
        .eq('list_id', id)
        .order('sort_order', { ascending: true })

      if (itemsError) throw itemsError
      setItems(itemsData || [])
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch list')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [id])

  useEffect(() => {
    fetchListAndItems()
  }, [fetchListAndItems])

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    fetchListAndItems()
  }, [fetchListAndItems])

  const toggleComplete = async (itemId: string, currentValue: boolean) => {
    try {
      const supabase = getSupabase()

      // Optimistic update
      setItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, is_completed: !currentValue } : item
      ))

      const { error } = await supabase
        .from('gift_items')
        .update({ is_completed: !currentValue })
        .eq('id', itemId)

      if (error) throw error
    } catch (err) {
      // Revert on error
      setItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, is_completed: currentValue } : item
      ))
    }
  }

  const renderItem = ({ item }: { item: GiftItem }) => (
    <Pressable
      style={({ pressed }) => [
        styles.itemCard,
        item.is_completed && styles.itemCompleted,
        pressed && styles.itemPressed,
      ]}
      onPress={() => toggleComplete(item.id, item.is_completed)}
    >
      <View style={styles.itemHeader}>
        <Text style={[
          styles.itemName,
          item.is_completed && styles.itemNameCompleted,
        ]}>
          {item.name}
        </Text>
        <View style={[
          styles.statusBadge,
          item.status === 'required' ? styles.requiredBadge : styles.optionalBadge,
        ]}>
          <Text style={[
            styles.statusText,
            item.status === 'required' && styles.requiredText,
          ]}>
            {item.status === 'required' ? 'Required' : 'Optional'}
          </Text>
        </View>
      </View>

      {item.description && (
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      {(item.min_price || item.max_price) && (
        <Text style={styles.itemPrice}>
          {item.min_price && item.max_price
            ? `$${item.min_price} - $${item.max_price}`
            : item.min_price
            ? `$${item.min_price}+`
            : `Up to $${item.max_price}`}
        </Text>
      )}

      {item.is_completed && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>Purchased</Text>
        </View>
      )}
    </Pressable>
  )

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: list?.name || 'List',
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }}
      />
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={fetchListAndItems}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No items yet</Text>
            <Text style={styles.emptySubtitle}>
              Add items to this gift list
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={colors.accent}
              />
            }
          />
        )}
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  itemCompleted: {
    opacity: 0.6,
  },
  itemPressed: {
    backgroundColor: colors.cardDark,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  itemNameCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  requiredBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  optionalBadge: {
    backgroundColor: colors.border,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  requiredText: {
    color: colors.accent,
  },
  itemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  completedBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completedText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.success,
    textTransform: 'uppercase',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 14,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: colors.text,
    fontWeight: '600',
  },
})
