import { getUserCredit } from '@/lib/actions/user.action'
import { useQuery } from '@tanstack/react-query'

export const useCreditQuery = () =>
  useQuery({
    queryKey: ['user-credit'],
    queryFn: getUserCredit,
  })
