import { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  SectionList,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { colors } from '../../lib/constants/colors'
import { FAB, EmptyState, Card, ConfirmDialog, SkeletonList, Badge } from '../../components/ui'
import { ListFormSheet } from '../../components/lists/ListFormSheet'
import { useGiftLists } from '../../hooks/useGiftLists'
import { useToast } from '../../providers/ToastProvider'
import { useHaptics } from '../../hooks/useHaptics'
import type { GiftList } from '../../lib/types'

interface GiftListWithMeta extends GiftList {
  is_shared?: boolean
  is_owner?: boolean
  role?: 'viewer' | 'editor'
}

interface Section {
  title: string
  data: GiftListWithMeta[]
}

export default function DashboardScreen() {
  const { lists, sharedLists, isLoading, error, fetch, create, update, remove } = useGiftLists()
  const { showToast } = useToast()
  const haptics = useHaptics()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingList, setEditingList] = useState<GiftListWithMeta | undefined>()

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<GiftListWithMeta | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetch()
  }, [fetch])

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await fetch()
    setIsRefreshing(false)
  }, [fetch])

  const handleCreateList = async (data: { name: string; color: string }) => {
    const result = await create(data)
    if (result.success) {
      haptics.success()
      showToast(`"${data.name}" created!`, 'success')
    } else {
      haptics.error()
    }
    return result
  }

  const handleUpdateList = async (data: { name: string; color: string }) => {
    if (!editingList) return { success: false, error: 'No list selected' }
    const result = await update(editingList.id, data)
    if (result.success) {
      haptics.success()
      showToast('List updated', 'success')
    } else {
      haptics.error()
    }
    return result
  }

  const handleDeleteList = async () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    const result = await remove(deleteTarget.id)
    setIsDeleting(false)
    setDeleteTarget(null)

    if (result.success) {
      haptics.success()
      showToast('List deleted', 'success')
    } else {
      haptics.error()
      showToast(result.error || 'Failed to delete', 'error')
    }
  }

  const handleListPress = (list: GiftListWithMeta) => {
    haptics.light()
    router.push(`/list/${list.id}`)
  }

  const handleLongPress = (list: GiftListWithMeta) => {
    haptics.medium()

    // Can't edit/delete shared lists (unless editor)
    if (list.is_shared && list.role === 'viewer') {
      Alert.alert(
        list.name,
        'You have view-only access to this shared list.',
        [{ text: 'OK' }]
      )
      return
    }

    const options: { text: string; onPress?: () => void; style?: 'destructive' | 'cancel' }[] = []

    if (list.is_owner) {
      options.push({
        text: 'Edit',
        onPress: () => {
          setEditingList(list)
          setShowForm(true)
        },
      })
      options.push({
        text: 'Delete',
        style: 'destructive',
        onPress: () => setDeleteTarget(list),
      })
    } else if (list.role === 'editor') {
      options.push({
        text: 'Edit',
        onPress: () => {
          setEditingList(list)
          setShowForm(true)
        },
      })
    }

    options.push({ text: 'Cancel', style: 'cancel' })

    Alert.alert(list.name, 'What would you like to do?', options)
  }

  const openCreateForm = () => {
    haptics.light()
    setEditingList(undefined)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingList(undefined)
  }

  const renderListCard = ({ item }: { item: GiftListWithMeta }) => (
    <Card
      accentColor={item.color || colors.accent}
      onPress={() => handleListPress(item)}
      onLongPress={() => handleLongPress(item)}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${item.item_count || 0} items${item.is_shared ? ', shared with you' : ''}. Double tap to open, long press for options.`}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        {item.is_shared && (
          <View style={styles.sharedBadge}>
            <FontAwesome name="users" size={10} color={colors.accent} />
          </View>
        )}
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.cardMeta}>
          {item.item_count || 0} {item.item_count === 1 ? 'item' : 'items'}
        </Text>
        {item.is_shared && (
          <Text style={styles.roleBadge}>
            {item.role === 'editor' ? 'Can edit' : 'View only'}
          </Text>
        )}
      </View>
    </Card>
  )

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length}</Text>
    </View>
  )

  // Build sections
  const sections: Section[] = []
  if (lists.length > 0) {
    sections.push({ title: 'My Lists', data: lists })
  }
  if (sharedLists.length > 0) {
    sections.push({ title: 'Shared with Me', data: sharedLists })
  }

  const hasAnyLists = lists.length > 0 || sharedLists.length > 0

  // Show skeleton loading on initial load
  if (isLoading && !hasAnyLists) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <SkeletonList count={4} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {error ? (
        <EmptyState
          icon="⚠️"
          title="Something went wrong"
          subtitle={error}
          actionLabel="Try Again"
          onAction={fetch}
        />
      ) : !hasAnyLists ? (
        <EmptyState
          icon="🎁"
          title="No gift lists yet"
          subtitle="Create your first list to start tracking gifts for someone special"
          actionLabel="Create List"
          onAction={openCreateForm}
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderListCard}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
            />
          }
        />
      )}

      <FAB
        onPress={openCreateForm}
        accessibilityLabel="Create new gift list"
      />

      <ListFormSheet
        visible={showForm}
        list={editingList}
        onSave={editingList ? handleUpdateList : handleCreateList}
        onClose={closeForm}
      />

      <ConfirmDialog
        visible={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        message={`This will permanently delete this list and all ${deleteTarget?.item_count || 0} items. This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteList}
        onCancel={() => setDeleteTarget(null)}
        loading={isDeleting}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Space for FAB
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCount: {
    fontSize: 12,
    color: colors.textMuted,
    backgroundColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  sharedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: colors.textMuted,
  },
  roleBadge: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '500',
  },
})
