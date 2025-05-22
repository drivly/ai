import { getUserCredit } from '@/lib/actions/user.action'
import { useQuery } from '@tanstack/react-query'

export const useCreditQuery = (token?: string) =>
  useQuery({
    queryKey: ['user-credit', token],
    queryFn: getUserCredit,
  })
