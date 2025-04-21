'use client';

import React, { Fragment, useRef } from 'react';
import { useChatMessages } from './chat-context';
import { Message, ThinkingMessage } from './message';
import { ChatInput } from './chat-input';

export function ChatContent() {
  const { messages } = useChatMessages();
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  return (
    <Fragment>
      <div className="flex flex-1 flex-col overflow-y-auto px-2 py-4" ref={containerRef}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold">Welcome to Chat</h2>
            <p className="text-muted-foreground">
              Start a conversation by typing a message below.
            </p>
          </div>
        )}
        {messages.length > 0 && (
          <>
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isLoading={false}
              />
            ))}
          </>
        )}
      </div>
      <ChatInput />
      <div ref={bottomRef} />
    </Fragment>
  );
}
