import { cookies } from 'next/headers';
import { auth } from '@/lib/auth/payload-auth';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
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
      <SidebarProvider defaultOpen={!isCollapsed}>
        {/* TODO: Implement AppSidebar component if needed */}
        <div className="flex min-h-screen">
          <div className="flex-1">{children}</div>
        </div>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  );
}
