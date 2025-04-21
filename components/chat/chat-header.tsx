'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ChatHeader({
  chatId,
}: {
  chatId: string;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="flex items-center h-14 px-4 border-b shrink-0 md:px-6">
      <div className="flex items-center gap-2 flex-1">
        <h1 className="text-xl font-semibold">Chat</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={isHomePage ? '/chat' : '/'}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
