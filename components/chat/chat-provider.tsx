'use client';

import React, { ReactNode } from 'react';
import { useChat } from '@ai-sdk/react';
import { ChatProvider as PayloadChatProvider, useChatMessages, useChatInput, useChatStatus } from '@/pkgs/payload-agent/src/components/store/context';
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

  return (
    <PayloadChatProvider>
      <ChatConfiguration chatId={chatId} isNewChat={isNewChat}>
        {children}
      </ChatConfiguration>
    </PayloadChatProvider>
  );
}

function ChatConfiguration({
  children,
  chatId,
  isNewChat,
}: {
  children: ReactNode;
  chatId: string;
  isNewChat: boolean;
}) {
  const router = useRouter();
  const { append } = useChatInput();
  const { messages } = useChatMessages();
  
  React.useEffect(() => {
    const setupChat = async () => {
      try {
        if (isNewChat && messages.length === 0) {
        }
      } catch (error) {
        toast.error('Failed to initialize chat');
      }
    };
    
    setupChat();
  }, [chatId, isNewChat, messages.length, append]);

  React.useEffect(() => {
    if (isNewChat && messages.length > 0 && chatId === 'new') {
      const newChatId = crypto.randomUUID();
      router.replace(`/chat/${newChatId}`);
    }
  }, [isNewChat, messages.length, chatId, router]);

  return <>{children}</>;
}
