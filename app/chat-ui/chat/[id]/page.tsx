import React from 'react';
import { ChatHeader } from '@/components/chat/chat-header';
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { ChatContent } from '@/components/chat/chat-content';
import { ChatProvider } from '@/components/chat/chat-provider';

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const { id } = await params;

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader chatId={id} />
      <ChatProvider chatId={id}>
        <div className="flex-1 overflow-hidden">
          <ChatContent />
        </div>
      </ChatProvider>
    </div>
  );
}
