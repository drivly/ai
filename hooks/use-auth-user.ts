import { useSession } from 'next-auth/react'

export const useAuthUser = () => {
  const { data: session, status } = useSession()

  return session?.user
}
