import { redirect } from 'next/navigation';
import { auth } from '@/auth.config';

export default async function ChatPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  redirect('/chat-ui/chat/new');
}
