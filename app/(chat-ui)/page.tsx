import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/payload-auth';

export default async function ChatPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  redirect('/chat/new');
}
