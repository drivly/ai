import { DateFunctionWrapper } from '../wrapper'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DateFunctionWrapper>
      {children}
    </DateFunctionWrapper>
  )
}
