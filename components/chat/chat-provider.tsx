'use client';

import React, { ReactNode } from 'react';
import { ChatContextProvider, useChatMessages } from './chat-context';
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
    <ChatContextProvider>
      <ChatRedirect chatId={chatId} isNewChat={isNewChat}>
        {children}
      </ChatRedirect>
    </ChatContextProvider>
  );
}

function ChatRedirect({
  children,
  chatId,
  isNewChat,
}: {
  children: ReactNode;
  chatId: string;
  isNewChat: boolean;
}) {
  const router = useRouter();
  const { messages } = useChatMessages();
  
  React.useEffect(() => {
    if (isNewChat && messages.length > 0 && chatId === 'new') {
      const newChatId = crypto.randomUUID();
      const pathname = window.location.pathname;
      if (pathname.startsWith('/gpt.do')) {
        router.replace(`/gpt.do/chat/${newChatId}`);
      } else if (pathname.startsWith('/chat-ui')) {
        router.replace(`/chat-ui/chat/${newChatId}`);
      } else {
        router.replace(`/chat/${newChatId}`);
      }
    }
  }, [isNewChat, messages.length, chatId, router]);

  return <>{children}</>;
}
