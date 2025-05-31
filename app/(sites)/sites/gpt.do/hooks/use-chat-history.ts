'use client'

import { useAuthUser } from '@/hooks/use-auth-user'
import type { UIMessage } from 'ai'
import { useLocalStorage } from 'usehooks-ts'
import { generateTitleFromUserMessage } from '../actions/gpt.action'
import type { Chat, Chats, SearchOption } from '../lib/types'

// Helper function to safely extract text from parts
function getTextFromParts(parts: UIMessage['parts'] | undefined): string {
  if (!parts || parts.length === 0) return ''

  const textContents: string[] = []
  for (const part of parts) {
    // Handle TextUIPart structure
    if (part.type === 'text' && typeof part.text === 'string') {
      textContents.push(part.text)
    }
  }

  // Join multiple text parts with a space. Trim any leading/trailing space from the final string.
  return textContents.join(' ').trim()
}

/**
 * Generates a title locally from the first user message
 */
function generateTitleFromMessages(messages: UIMessage[]): string {
  const firstUserMessage = messages.find((m) => m.role === 'user')
  if (!firstUserMessage) {
    return 'New Chat'
  }

  const content = getTextFromParts(firstUserMessage.parts)
  const title = content.substring(0, 30).trim()
  return title + (content.length > 30 ? '...' : '')
}

export function useChatHistory() {
  const [chatSessions, setChatSessions] = useLocalStorage<Chats>('gpt-do-chats', {})
  const [messages, setMessages] = useLocalStorage<{ [key: string]: UIMessage[] }>('gpt-do-messages', {})
  const user = useAuthUser()

  // Add a new chat
  const addChatSession = (id: string, model: SearchOption | null) => {
    setChatSessions((prev) => ({
      ...prev,
      [id]: {
        id,
        title: `New Chat ${Object.keys(prev).length + 1}`,
        model: model ?? null,
        userId: user?.id ?? '',
        visibility: 'private',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }))

    // Initialize empty messages array for this chat
    setMessages((prev) => ({
      ...prev,
      [id]: [],
    }))
  }

  // Update an existing chat
  const updateChatSession = (id: string, updates: Partial<Chat>) => {
    setChatSessions((prev) => {
      if (!prev[id]) return prev

      return {
        ...prev,
        [id]: {
          ...prev[id],
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      }
    })
  }

  // Update chat visibility
  const updateChatVisibility = (id: string, visibility: 'public' | 'private') => {
    updateChatSession(id, { visibility })
  }

  // Update chat messages
  const updateChatMessages = (chatId: string, uiMessagesOrMessage: UIMessage[] | UIMessage) => {
    // Convert input to array if it's a single message
    const uiMessages = Array.isArray(uiMessagesOrMessage) ? uiMessagesOrMessage : [uiMessagesOrMessage]

    // If it's a single message, check if we should append it to existing messages
    if (!Array.isArray(uiMessagesOrMessage)) {
      const existingMessages = messages[chatId] || []

      // Check if this message already exists by ID
      const messageExists = existingMessages.some((msg) => msg.id === uiMessagesOrMessage.id)

      if (!messageExists && existingMessages.length > 0) {
        // This is a new message to append
        const newMessage: UIMessage = {
          id: uiMessagesOrMessage.id || `${chatId}-${existingMessages.length}`,
          role: uiMessagesOrMessage.role,
          parts: uiMessagesOrMessage.parts,
        }

        // Just append the new message
        setMessages((prev) => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), newMessage],
        }))

        // Update chat metadata
        updateChatSession(chatId, { updatedAt: new Date().toISOString() })

        return
      }
    }

    // Process all messages (either full replacement or first message)
    const formattedMessages: UIMessage[] = uiMessages.map((msg, index) => {
      // Prioritize using parts if available
      const msgParts = msg.parts || []

      // If there are no parts but there is content, create a text part
      // Removed logic that accessed msg.content as it's not a standard UIMessage property
      // and causes type errors. UIMessage content should be in msg.parts.

      return {
        id: msg.id || `${chatId}-${index}`,
        chatId, // This was in the original code, but seems redundant if it's a property of the chat session
        role: msg.role,
        parts: msgParts, // Ensure parts are correctly passed through or constructed
      }
    })

    setMessages((prev) => ({
      ...prev,
      [chatId]: formattedMessages,
    }))

    // Auto-generate title if this is a new chat with default title
    if (formattedMessages.length > 0) {
      setChatSessions((prev) => {
        if (!prev[chatId]) return prev

        let title = prev[chatId].title
        if (title.startsWith('New Chat') || title === 'Untitled') {
          // We'll use local title generation initially, then update with AI-generated title if needed
          title = generateTitleFromMessages(formattedMessages)

          // Find the first user message to generate a title from
          const firstUserMessage = formattedMessages.find((m) => m.role === 'user')
          if (firstUserMessage) {
            // Launch AI title generation in the background
            generateAITitle(chatId, firstUserMessage)
          }
        }

        return {
          ...prev,
          [chatId]: {
            ...prev[chatId],
            title,
            updatedAt: new Date().toISOString(),
          },
        }
      })
    }
  }

  // Generate title using the AI server action
  const generateAITitle = async (chatId: string, message: UIMessage | undefined) => {
    try {
      // Get the text content from the message parts
      const textContent = getTextFromParts(message?.parts)

      // If no text was extracted, use a fallback
      if (!textContent) {
        console.warn('No text content extracted from message parts for title generation')
        updateChatTitle(chatId, generateTitleFromMessages(message ? [message] : []))
        return
      }

      // Construct UIMessage with both content and parts for the server action
      const uiMessage: UIMessage = {
        id: message?.id,
        role: message?.role,
        // Include both content and parts to be safe
        content: textContent,
        parts: message?.parts || [],
      } as UIMessage

      // Call the server action to generate a title
      const title = await generateTitleFromUserMessage({ message: uiMessage })

      // Update the chat title with the AI-generated one
      if (title) {
        updateChatTitle(chatId, title)
      }
    } catch (error) {
      console.error('Failed to generate AI title:', error)
      // We don't need to do anything on failure as we already have a basic title
      // Still set a basic title as fallback
      updateChatTitle(chatId, generateTitleFromMessages(message ? [message] : []))
    }
  }

  // Remove a chat session and its messages
  const removeChatSession = (id: string) => {
    setChatSessions((prev) => {
      const { [id]: _, ...rest } = prev
      return rest
    })

    setMessages((prev) => {
      const { [id]: _, ...rest } = prev
      return rest
    })
  }

  // Get a specific chat
  const getChatSession = (id: string) => {
    const chat = chatSessions[id]
    const chatMessages = messages[id] || []

    if (!chat) return null

    // Convert to UIMessages for compatibility with existing code
    const uiMessages = chatMessages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      // Include both content and parts for compatibility with different components
      content: getTextFromParts(msg.parts),
      parts: msg.parts,
    }))

    // Return in format compatible with previous implementation
    return {
      ...chat,
      messages: uiMessages,
    }
  }

  // Get all chats as an array sorted by updatedAt (most recent first)
  const getAllChatSessions = () => {
    return Object.values(chatSessions).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }

  // Explicitly update a chat title
  const updateChatTitle = (id: string, title: string) => {
    updateChatSession(id, { title })
  }

  // Generate a title for a chat using AI
  const generateTitle = async (id: string) => {
    const chatMessages = messages[id] || []
    if (!chatMessages.length) return

    const firstUserMessage = chatMessages.find((m) => m.role === 'user')
    if (firstUserMessage) {
      // Generate title with AI
      await generateAITitle(id, firstUserMessage)
    } else {
      // Fallback to simple title generation
      const title = generateTitleFromMessages(chatMessages)
      updateChatSession(id, { title })
    }
  }

  return {
    chatSessions,
    messages,
    addChatSession,
    updateChatSession,
    updateChatMessages,
    removeChatSession,
    getChatSession,
    getAllChatSessions,
    updateChatTitle,
    updateChatVisibility,
    generateTitle,
  }
}
