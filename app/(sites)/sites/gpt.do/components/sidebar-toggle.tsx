import { Button } from '@/components/ui/button'
import { type SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { PanelLeftIcon } from 'lucide-react'
import type { ComponentProps } from 'react'

export function SidebarToggle({ className }: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button data-testid='sidebar-toggle-button' onClick={toggleSidebar} variant='outline' className='cursor-pointer md:h-fit md:px-2'>
          <PanelLeftIcon size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent align='start'>Toggle Sidebar</TooltipContent>
    </Tooltip>
  )
}
