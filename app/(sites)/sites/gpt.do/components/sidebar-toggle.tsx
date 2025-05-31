import { Button } from '@/components/ui/button'
import { type SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { PanelLeftIcon } from 'lucide-react'
import type { ComponentProps } from 'react'

export function SidebarToggle({ className }: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-testid='sidebar-toggle-button'
          onClick={toggleSidebar}
          variant='outline'
          className={cn('cursor-pointer bg-transparent hover:bg-gray-100/80 md:h-fit md:px-2 dark:bg-transparent dark:hover:bg-zinc-800/50', className)}>
          <PanelLeftIcon size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent align='start'>Toggle Sidebar</TooltipContent>
    </Tooltip>
  )
}
