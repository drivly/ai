import React from 'react';
import { cookies } from 'next/headers';
import { auth } from '@/auth.config';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="flex min-h-screen">
        <div className="flex-1">{children}</div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
