import React from 'react';
import { ChatHeader } from '@/components/chat/chat-header';
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { Content } from '@/pkgs/payload-agent/src/components/chat/chat-container';
import { ChatProvider } from '@/components/chat/chat-provider';
import { getCurrentURL } from '@/lib/utils/url';
import { headers } from 'next/headers';

export default async function ChatPage({
  params,
}: {
  params: Promise<Record<string, string | string[]>>;
}) {
  const session = await auth();

  if (!session) {
    const headersList = await headers();
    const currentURL = getCurrentURL(headersList);
    const callbackUrl = new URL('/gpt.do/chat/new', currentURL).toString();
    const githubSignInUrl = new URL('/api/auth/signin/github', currentURL);
    githubSignInUrl.searchParams.set('callbackUrl', callbackUrl);
    
    redirect(githubSignInUrl.toString());
  }

  const { id: idParam } = await params;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader chatId={id} />
      <ChatProvider chatId={id}>
        <div className="flex-1 overflow-hidden">
          <Content />
        </div>
      </ChatProvider>
    </div>
  );
}
