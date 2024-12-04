import { AI } from 'ai-props'
import { geolocation } from '@vercel/functions'

export const Item = ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>

export default function Page({ idea }: { idea: string }) {
  const { city, country } = geolocation()
  const month = new Date().toLocaleString('default', { month: 'long' })
  return (
    <AI list='10 fun things to do this place and time of year' args={{ city, country, month }}>
      <Item />
    </AI>
  )
}