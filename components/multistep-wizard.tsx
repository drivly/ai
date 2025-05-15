import { useState, useCallback } from 'react'
import * as ResizablePanel from './resizable-panel'
import { Button } from './ui/button'
import { Step } from './ui/step'

export default function MultistepWizard({ children, complete }: { children: React.ReactNode; complete: React.ReactNode }) {
  let [step, setStep] = useState(1)

  const handleBack = useCallback(() => {
    setStep(step < 2 ? step : step - 1)
  }, [step])

  const handleContinue = useCallback(() => {
    setStep(step > 3 ? step : step + 1)
  }, [step])

  return (
    <div className='flex min-h-full flex-1 flex-col items-center justify-center backdrop-blur-xl'>
      <div className='mx-auto w-full max-w-md rounded-lg shadow-xl'>
        <div className='flex justify-between rounded px-3 py-8 sm:p-8'>
          <Step step={1} currentStep={step} />
          <Step step={2} currentStep={step} />
          <Step step={3} currentStep={step} />
        </div>

        <ResizablePanel.Root value={step.toString()}>
          <ResizablePanel.Content value={step.toString()} className='px-3 py-2 sm:px-8'>
            <div className='group flex h-full w-full flex-col' data-step={step}>
              {children}
            </div>
          </ResizablePanel.Content>
          <ResizablePanel.Content value='4' className='px-3 py-2 sm:px-8'>
            {complete}
          </ResizablePanel.Content>
        </ResizablePanel.Root>

        <div className='px-3 pb-8 sm:px-8'>
          <div className='mt-8 flex justify-between'>
            <Button
              variant='outline'
              onClick={handleBack}
              className={`${step === 1 ? 'pointer-events-none opacity-50' : ''} cursor-pointer rounded border-none px-2 py-1 text-neutral-400 transition duration-350 hover:bg-transparent hover:text-neutral-700`}>
              Back
            </Button>
            <Button
              variant='outline'
              onClick={handleContinue}
              className={`${
                step > 3 ? 'pointer-events-none opacity-50' : ''
              } text-muted-foreground h-10 cursor-pointer rounded-sm transition duration-350 hover:bg-[#1A1A1D] hover:text-white active:bg-[#1A1A1D]`}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
