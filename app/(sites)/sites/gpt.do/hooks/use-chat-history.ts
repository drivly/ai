'use client'

import { generateTitleFromUserMessage } from '@/app/(sites)/sites/gpt.do/actions/gpt.action'
import { useAuthUser } from '@/hooks/use-auth-user'
import type { UIMessage } from 'ai'
import { useLocalStorage } from 'usehooks-ts'
import type { Chat, Chats, Message, Messages, SearchOption } from '../lib/types'

// Helper function to safely extract text from parts
function getTextFromParts(parts: UIMessage['parts'] | undefined): string {
  if (!parts || parts.length === 0) return ''

  for (const part of parts) {
    // Handle TextUIPart structure
    if (part.type === 'text' && 'text' in part && part.text) {
      return part.text
    }

    if ('content' in part && typeof part.content === 'string') {
      return part.content
    }

    if (typeof part === 'string') {
      return part
    }
  }

  try {
    if (parts[0]) {
      return JSON.stringify(parts[0])
    }
  } catch (e) {
    // Silent fail if we can't stringify
  }

  return ''
}

/**
 * Generates a title locally from the first user message
 */
function generateTitleFromMessages(messages: Message[]): string {
  const firstUserMessage = messages.find((m) => m.role === 'user')
  if (!firstUserMessage) {
    return 'New Chat'
  }

  const content = getTextFromParts(firstUserMessage.parts)
  const title = content.substring(0, 30).trim()
  return title + (content.length > 30 ? '...' : '')
}

export function useChatHistory() {
  const [chats, setChats] = useLocalStorage<Chats>('gpt-do-chats', {})
  const [messages, setMessages] = useLocalStorage<Messages>('gpt-do-messages', {})
  const user = useAuthUser()

  // Add a new chat
  const addChatSession = (id: string, model: SearchOption) => {
    setChats((prev) => ({
      ...prev,
      [id]: {
        id,
        title: `New Chat ${Object.keys(prev).length + 1}`,
        model,
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
    setChats((prev) => {
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
        const newMessage: Message = {
          id: uiMessagesOrMessage.id || `${chatId}-${existingMessages.length}`,
          chatId,
          role: uiMessagesOrMessage.role,
          parts: uiMessagesOrMessage.parts || (uiMessagesOrMessage.content ? [{ type: 'text', text: uiMessagesOrMessage.content as string }] : []),
          attachments: uiMessagesOrMessage.experimental_attachments || [],
          createdAt: uiMessagesOrMessage.createdAt || new Date(),
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
    const formattedMessages: Message[] = uiMessages.map((msg, index) => {
      // Prioritize using parts if available
      const msgParts = msg.parts || []

      // If there are no parts but there is content, create a text part
      if (msgParts.length === 0 && msg.content) {
        // Create a TextUIPart from the content
        return {
          id: msg.id || `${chatId}-${index}`,
          chatId,
          role: msg.role,
          parts: [{ type: 'text', text: msg.content as string }],
          attachments: msg.experimental_attachments || [],
          createdAt: msg.createdAt || new Date(),
        }
      }

      return {
        id: msg.id || `${chatId}-${index}`,
        chatId,
        role: msg.role,
        parts: msgParts,
        attachments: msg.experimental_attachments || [],
        createdAt: msg.createdAt || new Date(),
      }
    })

    setMessages((prev) => ({
      ...prev,
      [chatId]: formattedMessages,
    }))

    // Auto-generate title if this is a new chat with default title
    if (formattedMessages.length > 0) {
      setChats((prev) => {
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
  const generateAITitle = async (chatId: string, message: Message) => {
    try {
      // Get the text content from the message parts
      const textContent = getTextFromParts(message.parts)

      // If no text was extracted, use a fallback
      if (!textContent) {
        console.warn('No text content extracted from message parts for title generation')
        updateChatTitle(chatId, generateTitleFromMessages([message]))
        return
      }

      // Construct UIMessage with both content and parts for the server action
      const uiMessage: UIMessage = {
        id: message.id,
        role: message.role,
        // Include both content and parts to be safe
        content: textContent,
        parts: message.parts || [],
        createdAt: message.createdAt,
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
      updateChatTitle(chatId, generateTitleFromMessages([message]))
    }
  }

  // Remove a chat session and its messages
  const removeChatSession = (id: string) => {
    setChats((prev) => {
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
    const chat = chats[id]
    const chatMessages = messages[id] || []

    if (!chat) return null

    // Convert to UIMessages for compatibility with existing code
    const uiMessages = chatMessages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      // Include both content and parts for compatibility with different components
      content: getTextFromParts(msg.parts),
      parts: msg.parts,
      experimental_attachments: msg.attachments,
      createdAt: msg.createdAt,
    }))

    // Return in format compatible with previous implementation
    return {
      ...chat,
      messages: uiMessages,
    }
  }

  // Get all chats as an array sorted by updatedAt (most recent first)
  const getAllChatSessions = () => {
    return Object.values(chats).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
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
    chats,
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
