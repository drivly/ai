import { titleCase } from '@/lib/utils' // For title-casing createdBy keys
import { useVirtualizer } from '@tanstack/react-virtual' // Keep one import
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { setGptdoCookieAction } from '../actions/gpt.action'
import { SELECTION_STEP_ALIASES } from '../lib/constants'
import type { ChatConfigChangeType, ConfigOption, Integration } from '../lib/types'
import { groupAndSortOptions, KEY_FOR_INVALID_DATES } from '../lib/utils'

export interface DisplayGroup {
  displayKey: string
  options: ConfigOption[] | ReadonlyArray<ConfigOption>
}

export interface UseOptionListPanelProps {
  title: ChatConfigChangeType
  data: ConfigOption[] | Integration[] | ReadonlyArray<ConfigOption> // Models - 'createdAt', Tools - 'createdBy'
  groupingStrategy: 'groupByKey' | 'none'
  groupKeyForFlatList?: keyof ConfigOption // e.g., 'createdAt' or 'createdBy'
  selectedItem?: ConfigOption | null
  updateOption: (type: ChatConfigChangeType, option: ConfigOption | Integration | null) => void
}

const GROUP_HEADER_ESTIMATED_HEIGHT = 36
const BUTTON_CONTENT_HEIGHT = 40
const SEPARATOR_AREA_HEIGHT = 9
const ITEM_ROW_HEIGHT_WITH_SEPARATOR = BUTTON_CONTENT_HEIGHT + SEPARATOR_AREA_HEIGHT
const ITEM_ROW_HEIGHT_NO_SEPARATOR = BUTTON_CONTENT_HEIGHT

export type VirtualDisplayListItem =
  | { id: string; type: 'groupHeader'; data: { displayKey: string } }
  | { id: string; type: 'item'; data: ConfigOption | Integration; originalIndexInNavigableFlatItems: number }

// Helper to group by a generic key (like 'createdBy')
const groupByKeyGeneric = (options: ReadonlyArray<ConfigOption>, keyName: keyof ConfigOption): DisplayGroup[] => {
  const grouped: Record<string, ConfigOption[]> = {}
  options.forEach((option) => {
    const keyValue = option[keyName] as string | undefined
    const groupDisplayKey = keyValue ? titleCase(keyValue) : KEY_FOR_INVALID_DATES
    if (!grouped[groupDisplayKey]) {
      grouped[groupDisplayKey] = []
    }
    grouped[groupDisplayKey].push(option)
  })
  // Simple sort by displayKey, or could be more complex if needed
  return Object.keys(grouped)
    .sort()
    .map((displayKey) => ({
      displayKey,
      options: grouped[displayKey],
    }))
}

export function useOptionListPanel({
  title,
  data, // This is now always ConfigOption[]
  groupingStrategy,
  groupKeyForFlatList, // Used when groupingStrategy is 'groupByKey'
  selectedItem,
  updateOption,
}: UseOptionListPanelProps) {
  // --- Local State ---
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchMode, setIsSearchMode] = useState(!selectedItem)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false)

  // --- Refs ---
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const parentScrollRef = useRef<HTMLDivElement>(null)

  // --- Derived Data ---
  // When in search mode, filter items by search query.
  const navigableFlatItems = useMemo(
    () => (isSearchMode ? data.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase())) : data),
    [isSearchMode, data, searchQuery],
  )

  const internalDisplayGroup: DisplayGroup[] = useMemo(() => {
    const itemsToGroup = isSearchMode ? navigableFlatItems : data

    if (groupingStrategy === 'groupByKey' && groupKeyForFlatList) {
      if (groupKeyForFlatList === 'createdAt') {
        return itemsToGroup.length > 0 ? groupAndSortOptions(itemsToGroup) : []
      }
      if (groupKeyForFlatList === 'createdBy') {
        return itemsToGroup.length > 0 ? groupByKeyGeneric(itemsToGroup, 'createdBy') : []
      }
    }

    return [{ displayKey: KEY_FOR_INVALID_DATES, options: itemsToGroup }]
  }, [groupingStrategy, groupKeyForFlatList, isSearchMode, data, navigableFlatItems])

  const virtualizableDisplayList: VirtualDisplayListItem[] = useMemo(() => {
    const list: VirtualDisplayListItem[] = []
    internalDisplayGroup.forEach((group) => {
      if (groupingStrategy === 'groupByKey' || group.displayKey !== KEY_FOR_INVALID_DATES) {
        list.push({ id: `group-${group.displayKey}`, type: 'groupHeader', data: { displayKey: group.displayKey } })
      }
      group.options.forEach((item: ConfigOption) => {
        const originalIndex = navigableFlatItems.findIndex((fi) => fi.value === item.value && fi.label === item.label)
        list.push({ id: item.value, type: 'item', data: item, originalIndexInNavigableFlatItems: originalIndex })
      })
    })
    return list
  }, [internalDisplayGroup, navigableFlatItems, groupingStrategy])

  const rowVirtualizer = useVirtualizer({
    count: virtualizableDisplayList.length,
    getScrollElement: () => parentScrollRef.current,
    estimateSize: (index) => {
      if (index < 0 || index >= virtualizableDisplayList.length) return 0
      const displayItem = virtualizableDisplayList[index]
      if (displayItem.type === 'groupHeader') {
        return GROUP_HEADER_ESTIMATED_HEIGHT
      }
      // It's an 'item' type
      // Check if it needs a separator (i.e., not the last in navigableFlatItems)
      if (displayItem.originalIndexInNavigableFlatItems < navigableFlatItems.length - 1) {
        return ITEM_ROW_HEIGHT_WITH_SEPARATOR
      }
      return ITEM_ROW_HEIGHT_NO_SEPARATOR // Last item, no separator space needed
    },
    overscan: 5,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()

  // --- Effects ---
  // When selectedItem changes (from URL), update our view mode
  useEffect(() => {
    if (selectedItem) {
      setIsSearchMode(false)
      setSearchQuery('')
      setFocusedIndex(-1)
    } else setIsSearchMode(true)
  }, [selectedItem])

  // Reset focus index when the filtered items list changes
  useEffect(() => {
    setFocusedIndex(-1)
    itemRefs.current = itemRefs.current.slice(0, navigableFlatItems.length)
  }, [searchQuery, isSearchMode, navigableFlatItems.length])

  // Modify the useEffect to only scroll for keyboard navigation
  useEffect(() => {
    // Only scroll when focused index changes due to keyboard navigation
    if (isKeyboardNavigation && focusedIndex >= 0 && focusedIndex < navigableFlatItems.length) {
      const targetItemInNavigableList = navigableFlatItems[focusedIndex]
      const targetVirtualIndex = virtualizableDisplayList.findIndex((virtItem) => virtItem.type === 'item' && virtItem.data.value === targetItemInNavigableList.value)

      if (targetVirtualIndex !== -1) {
        // Scroll to item with additional offset to ensure it's fully visible
        rowVirtualizer.scrollToIndex(targetVirtualIndex, {
          align: 'center', // Center the item in the viewport
          behavior: 'smooth',
        })
      }
    }
  }, [focusedIndex, navigableFlatItems, virtualizableDisplayList, rowVirtualizer, virtualItems, isKeyboardNavigation])

  // --- Handlers ---
  // Clear button ("X") handler
  const handleClear = useCallback(async () => {
    await setGptdoCookieAction({ type: SELECTION_STEP_ALIASES[title], option: null, pathname })
    updateOption(title, null) // Clear selection in parent/URL
    setIsSearchMode(true) // Switch to search mode
    setSearchQuery('')

    inputRef.current?.focus()
  }, [pathname, title, updateOption])

  const handleInputFocus = useCallback(() => {
    if (!isSearchMode && selectedItem) setSearchQuery(selectedItem.label)
    setIsSearchMode(true)
  }, [isSearchMode, selectedItem])

  const handleInputBlur = useCallback(() => {
    setTimeout(() => {
      if (isSearchMode && selectedItem && document.activeElement !== inputRef.current) {
        setIsSearchMode(false)
        setSearchQuery('') // Clear query when returning to input
      }
    }, 0)
  }, [isSearchMode, selectedItem])

  const handleItemClick = useCallback(
    (item: ConfigOption, isItemSelected: boolean) => {
      const isIntegrationWithoutAction = title === 'integration' && !item.value.includes('.')

      if (isItemSelected) {
        handleClear()
      } else {
        updateOption(title, item)

        if (!isIntegrationWithoutAction) {
          setIsSearchMode(false)
        }
      }
    },
    [title, handleClear, updateOption],
  )

  const handleItemMouseEnter = useCallback((originalItemIndex: number) => {
    setIsKeyboardNavigation(false)
    setFocusedIndex(originalItemIndex)
  }, [])

  const handleItemMouseLeave = useCallback(() => {
    setIsKeyboardNavigation(false)
    setFocusedIndex(-1)
  }, [])

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        if (isSearchMode && searchQuery) setSearchQuery('')
        else if (!isSearchMode && selectedItem) updateOption(title, null)
        return
      }
      if (!isSearchMode || navigableFlatItems.length === 0) return
      let newIndex = focusedIndex
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setIsKeyboardNavigation(true)

          if (focusedIndex === -1) newIndex = 0
          else if (focusedIndex < navigableFlatItems.length - 1) newIndex = focusedIndex + 1
          else newIndex = navigableFlatItems.length - 1

          setFocusedIndex(newIndex)
          break
        case 'ArrowUp':
          e.preventDefault()
          setIsKeyboardNavigation(true)

          if (focusedIndex <= 0) newIndex = 0
          else newIndex = focusedIndex - 1

          setFocusedIndex(newIndex)
          break
        case 'Enter':
          e.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < navigableFlatItems.length) {
            updateOption(title, navigableFlatItems[focusedIndex])
          }
          break
        default:
          break
      }
    },
    [focusedIndex, isSearchMode, navigableFlatItems, searchQuery, selectedItem, title, updateOption],
  )

  // Input value - derived from current mode
  const inputValue = isSearchMode ? searchQuery : selectedItem?.label || ''

  // Input change handler
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isSearchMode) {
        setSearchQuery(e.target.value)
      }
    },
    [isSearchMode],
  )

  return {
    inputRef,
    itemRefs,
    parentScrollRef,
    isSearchMode,
    focusedIndex,
    virtualizableDisplayList,
    virtualItems,
    totalSize: rowVirtualizer.getTotalSize(),
    navigableFlatItems,
    inputValue,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handleInputKeyDown,
    handleClearClick: handleClear,
    handleItemClick,
    handleItemMouseEnter,
    handleItemMouseLeave,
  }
}
