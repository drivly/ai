import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { toast } from 'sonner'
import { githubApplyAction } from './action'
import { useApplication } from './application-context'
import { JobPosition, jobPositionSchema } from './schema'

export const useGithubApply = (props: { position: JobPosition }) => {
  const { showSuccessDialog } = useApplication()

  return useHookFormAction(githubApplyAction, zodResolver(jobPositionSchema), {
    actionProps: {
      onSuccess: (args) => {
        if (args.data?.success && args.data?.applicationData) {
          showSuccessDialog(args.data.applicationData)
        } else {
          toast.success('Application submitted successfully')
        }
      },
      onError: (error) => {
        console.error('Application error:', error)
        toast.error('Failed to submit application. Please try again.')
      },
    },
    formProps: {
      defaultValues: {
        position: props.position,
      },
    },
    errorMapProps: {},
  })
}
