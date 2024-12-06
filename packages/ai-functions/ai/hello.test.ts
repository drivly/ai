import { test, expect } from 'vitest'
import * as Hello from './hello.mdx' // Import your MDX file

test('renders MDX content', () => {
  console.log(Hello.data)
  expect(Hello.data).toBeDefined()
  // render(<Hello />)
  // expect(screen.getByText('Hello, MDX!'))
})

// test('renders MDX exported component', () => {
//   // render(<Hello />)
//   // expect(screen.getByText('Hello, MDX!'))
// })