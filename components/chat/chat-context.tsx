'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';

/** Type representing all values returned by Vercel's useChat hook */
type ChatContextValue = ReturnType<typeof useChat>;

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatContextProvider');
  }
  return context;
}

/**
 * Hook to access chat status and control
 */
export function useChatStatus() {
  const { status, stop } = useChatContext();
  const isThinking = status === 'submitted';
  const isLoading = status === 'streaming' || status === 'submitted';
  return { status, stop, isThinking, isLoading };
}

/**
 * Hook to access chat messages and message-related functionality
 */
export function useChatMessages() {
  const { error, messages, reload } = useChatContext();
  const { isThinking } = useChatStatus();

  const displayMessages: UIMessage[] = isThinking 
    ? [...messages, { role: 'assistant', content: '', id: 'thinking', experimental_attachments: [], parts: [] }] 
    : messages;

  return { error, messages: displayMessages, reload };
}

/**
 * Hook to access chat input functionality and state
 */
export function useChatInput() {
  const { input, handleInputChange, handleSubmit, append } = useChatContext();

  return { input, append, handleInputChange, handleSubmit };
}

export function ChatContextProvider({ children }: { children: ReactNode }) {
  const chat = useChat({
    maxSteps: 3,
    onError: (error) => console.error('Chat error:', error),
  });

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
}
