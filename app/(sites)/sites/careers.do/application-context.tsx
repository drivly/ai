'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { ApplicationSuccess } from './application-success'

type ApplicationData = {
  position: string
  applicant: string
  email: string
}

interface ApplicationContextType {
  showSuccessDialog: (data: ApplicationData) => void
  hideSuccessDialog: () => void
  isProcessingCallback: boolean
  setIsProcessingCallback: (value: boolean) => void
  hasProcessedCallback: boolean
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined)

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null)
  const [isProcessingCallback, setIsProcessingCallback] = useState(false)
  const hasProcessedCallbackRef = useRef(false)

  const showSuccessDialog = (data: ApplicationData) => {
    hasProcessedCallbackRef.current = true
    setApplicationData(data)
    setDialogOpen(true)
  }

  const hideSuccessDialog = () => {
    setDialogOpen(false)
    setIsProcessingCallback(false)

    setTimeout(() => {
      setApplicationData(null)

      if (window.location.search) {
        router.replace(pathname)
      }
    }, 100)
  }

  useEffect(() => {
    return () => {
      setIsProcessingCallback(false)
      hasProcessedCallbackRef.current = false
    }
  }, [pathname])

  return (
    <ApplicationContext.Provider
      value={{
        showSuccessDialog,
        hideSuccessDialog,
        isProcessingCallback,
        setIsProcessingCallback,
        hasProcessedCallback: hasProcessedCallbackRef.current,
      }}>
      {children}

      {applicationData && (
        <ApplicationSuccess isOpen={dialogOpen} onClose={hideSuccessDialog} position={applicationData.position} name={applicationData.applicant} email={applicationData.email} />
      )}
    </ApplicationContext.Provider>
  )
}

export function useApplication() {
  const context = useContext(ApplicationContext)
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider')
  }
  return context
}
