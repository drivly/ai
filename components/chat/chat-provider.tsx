'use client';

import React, { ReactNode } from 'react';
import { useChat } from '@ai-sdk/react';
import { ChatProvider as PayloadChatProvider, ChatContextProvider } from '@/pkgs/payload-agent/src/components/store/context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function ChatProvider({
  children,
  chatId,
}: {
  children: ReactNode;
  chatId: string;
}) {
  const router = useRouter();
  const isNewChat = chatId === 'new';

  const chat = useChat({
    id: isNewChat ? crypto.randomUUID() : chatId,
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error);
      toast.error('An error occurred during the chat');
    },
  });

  React.useEffect(() => {
    if (isNewChat && chat.messages.length > 0 && chatId === 'new') {
      router.replace(`/chat/${chat.id}`);
    }
  }, [isNewChat, chat.messages.length, chatId, router, chat.id]);

  return (
    <ChatContextProvider value={chat}>
      {children}
    </ChatContextProvider>
  );
}
