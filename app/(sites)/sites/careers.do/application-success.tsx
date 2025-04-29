import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog'
import { Check } from 'lucide-react'

interface ApplicationSuccessProps {
  isOpen: boolean
  onClose: () => void
  position: string
  name: string
  email: string
}

export function ApplicationSuccess({ isOpen, onClose, position, name, email }: ApplicationSuccessProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className='bg-black/60' />
      <DialogContent className='rounded-md p-8 sm:max-w-md'>
        <DialogHeader>
          <div className='text-center'>
            <Check className='mx-auto my-4 h-6 w-6 text-green-600' />
            <DialogTitle className='mb-1 text-xl'>Application Submitted!</DialogTitle>
            <DialogDescription>
              Thank you for applying to the <span className='font-semibold'>{position}</span> position.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className='text-muted-foreground space-y-3 py-4 text-sm'>
          <p>
            We've sent a confirmation to <span className='text-foreground font-medium'>{email}</span>.
          </p>
          <p>Our team will review your profile and reach out if there's a potential match.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
