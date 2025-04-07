import { describe, it, expect } from 'vitest'
import { projects, ProjectsClient } from './index.js'

describe('projects.do SDK', () => {
  it('exports a default client instance', () => {
    expect(projects).toBeInstanceOf(ProjectsClient)
  })

  it('allows creating a custom client', () => {
    const client = new ProjectsClient({ baseUrl: 'https://custom.projects.do' })
    expect(client).toBeInstanceOf(ProjectsClient)
  })
})
