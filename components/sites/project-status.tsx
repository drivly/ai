import { getProjectStatus, ProjectStatusResponse } from '@/lib/actions/status-page.action'
import Link from 'next/link'

interface ProjectStatusProps {
  statusPageId?: string
}

const getStatusConfig = (status: ProjectStatusResponse) => {
  switch (status) {
    case 'operational':
      return {
        bgColor: 'bg-emerald-500',
        bgColorOpacity: 'bg-emerald-500/20',
        text: 'All systems operational',
      }
    case 'downtime':
      return {
        bgColor: 'bg-red-500',
        bgColorOpacity: 'bg-red-500/20',
        text: 'System outage detected',
      }
    case 'degraded':
      return {
        bgColor: 'bg-amber-500',
        bgColorOpacity: 'bg-amber-500/20',
        text: 'Degraded performance',
      }
    case 'maintenance':
      return {
        bgColor: 'bg-blue-500',
        bgColorOpacity: 'bg-blue-500/20',
        text: 'Scheduled maintenance',
      }
    default:
      return {
        bgColor: 'bg-emerald-500',
        bgColorOpacity: 'bg-emerald-500/20',
        text: 'All systems operational',
      }
  }
}

export const ProjectStatus = async ({ statusPageId = '213156' }: ProjectStatusProps) => {
  const pageStatus = await getProjectStatus(statusPageId)

  const { bgColor, bgColorOpacity, text } = getStatusConfig(pageStatus)

  return (
    <div className='rounded-full border border-gray-800 py-1 pr-2 pl-1'>
      <div className='flex items-center gap-1.5'>
        <div className='relative size-4 shrink-0'>
          <div className={`absolute inset-[1px] rounded-full ${bgColorOpacity}`} />
          <div className={`absolute inset-1 rounded-full ${bgColor}`} />
        </div>
        <Link href='https://status.workflows.do' className='text-xs text-white' target='_blank' rel='noopener noreferrer'>
          {text}
        </Link>
      </div>
    </div>
  )
}
