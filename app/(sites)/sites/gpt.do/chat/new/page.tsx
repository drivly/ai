import { redirect } from 'next/navigation';
import { auth } from '@/auth.config';
import { getCurrentURL } from '@/lib/utils/url';
import { headers } from 'next/headers';

export default async function NewChatPage() {
  const session = await auth();

  if (!session) {
    const headersList = await headers();
    const currentURL = getCurrentURL(headersList);
    const callbackUrl = new URL('/gpt.do/chat/new', currentURL).toString();
    const githubSignInUrl = new URL('/api/auth/signin/github', currentURL);
    githubSignInUrl.searchParams.set('callbackUrl', callbackUrl);
    
    redirect(githubSignInUrl.toString());
  }

  const newChatId = crypto.randomUUID();
  redirect(`/gpt.do/chat/${newChatId}`);
}
