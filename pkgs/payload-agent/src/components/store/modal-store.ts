import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import type { PayloadAgentAuthResult } from '../../types/auth'
import type { ChatWidgetHeaderProps } from '../../types/chat'

export type Suggestion = {
  title: string
  label: string
  action: string
}

export type ModalConfig = {
  aiAvatar?: string | null
  defaultMessage?: string
  suggestions?: Suggestion[]
} & ChatWidgetHeaderProps

export interface ModalState {
  isOpen: boolean
  config: ModalConfig
  user: {
    avatar: string | null
    authedUser: PayloadAgentAuthResult | null
  }
  actions: {
    open: (open: boolean) => void
    setConfig: (config: ModalConfig) => void
    setUser: (user: PayloadAgentAuthResult | null) => void
  }
}

const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  config: {
    defaultMessage: '',
    logo: '',
    suggestions: [],
  },
  user: {
    avatar: null,
    authedUser: null,
  },

  actions: {
    open: (open) => set({ isOpen: open }),
    setConfig: (config) => set({ config }),
    setUser: (authedUser) =>
      set({
        user: {
          authedUser,
          avatar: authedUser?.user?.email ? `https://www.gravatar.com/avatar/${authedUser.user.email.toLowerCase().trim()}?d=mp` : null,
        },
      }),
  },
}))

// Hooks with specific selectors
/**
 * Hook to access modal open state and control
 * @returns Object containing isOpen state and open action
 * @example
 * ```tsx
 * const { isOpen, open } = useModalControl()
 * ```
 */
export const useModal = () =>
  useModalStore(
    useShallow((s) => ({
      isOpen: s.isOpen,
      open: s.actions.open,
    })),
  )

/**
 * Hook to access and set modal configuration
 * @returns Object containing modal config and setConfig action
 * @example
 * ```tsx
 * const { config, setConfig } = useModalConfig()
 * ```
 */
export const useModalConfig = () =>
  useModalStore(
    useShallow((s) => ({
      config: s.config,
      setConfig: s.actions.setConfig,
    })),
  )

/**
 * Hook to access and set modal user data
 * @returns Object containing user data and setUser action
 * @example
 * ```tsx
 * const { user, setUser } = useModalUser()
 * ```
 */
export const useModalUser = () =>
  useModalStore(
    useShallow((s) => ({
      user: s.user,
      setUser: s.actions.setUser,
    })),
  )
