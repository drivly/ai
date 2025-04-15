import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export interface UserAvatarProps {
  image: string
}

export const UserAvatar = (props: UserAvatarProps) => {
  return (
    <Avatar>
      <AvatarImage src={props.image || ''} alt='User avatar' />
      <AvatarFallback>👤</AvatarFallback>
    </Avatar>
  )
}
