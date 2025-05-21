import { Button } from '@/components/ui/button'
import { capitalizeFirstLetter } from '@/lib/utils'

export interface OAuthCardProps {
  integrationName: string
  redirectUrl: string
  onCancel?: () => void
  onConnect: (app: string, url: string) => void | Window | null
}

export const OAuthCard = ({ integrationName, redirectUrl, onCancel, onConnect }: OAuthCardProps) => {
  const displayName = capitalizeFirstLetter(integrationName)

  return (
    <div>
      <div className='flex w-full items-center justify-center gap-2'>
        {onCancel && (
          <Button variant='ghost' onClick={onCancel} className='w-full flex-1 cursor-pointer text-gray-400 hover:bg-gray-900 hover:text-white'>
            Cancel
          </Button>
        )}
        <Button onClick={() => onConnect(integrationName, redirectUrl)} className='w-full flex-1 cursor-pointer'>
          Connect with {displayName}
        </Button>
      </div>
      <p className='mt-1.5 text-xs text-gray-500'>You'll be redirected to {displayName} to authorize access</p>
    </div>
  )
}
