# ai-props

Magically generate props for your React Server Components.

## Usage

```tsx
import { AI } from 'ai-props'
import { Hero } from './components/Hero'

export default function Page({ topic }: { topic: string }) {
  return (
    <AI
      args={{ topic }}
      model='gpt-4o'
      schema={{
        headline: 'Problem-agitating headline',
        subhead: 'Solution-focused description',
        primaryAction: 'Direct call-to-action',
        secondaryAction: 'Transitionary call-to-action',
      }}
    >
      <Hero />
    </AI>
  )
}
```

```tsx
import { AIList } from 'ai-props'
import { geolocation, locale } from '@vercel/functions'

export const Item = ({ children }) => <h3>{children}</h3>

export default function Page({ idea }: { idea: string }) {
  const { city, country } = geolocation()
  const month = new Date().toLocaleString('default', { month: 'long' })
  return (
    <AI list='10 fun things to do this place and time of year' args={{ city, country, month }}>
      <Item />
    </AI>
  )
}
```

## Roadmap

- [ ] Generate Props Object from Zod Schema
- [ ] Generate Props Object from simplified schema w/ prompt
- [ ] Support string array generation
- [ ] Support object array generation
- [ ] Support object streaming with Promise for each prop element
- [ ] Integrate support for 'use cache'
- [ ] Automatically generate default skeleton
