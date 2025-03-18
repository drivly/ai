const fs = require('fs')
const path = require('path')

describe('OpenHands Microagent', () => {
  const microagentPath = path.join(__dirname, '..', '.openhands', 'microagents', 'repo.md')
  
  test('Microagent file exists', () => {
    expect(fs.existsSync(microagentPath)).toBe(true)
  })
  
  test('Microagent file has correct format', () => {
    const content = fs.readFileSync(microagentPath, 'utf8')
    
    // Check for frontmatter
    expect(content).toMatch(/^---\s*\n/)
    expect(content).toMatch(/name:\s*repo\s*\n/)
    expect(content).toMatch(/type:\s*repo\s*\n/)
    expect(content).toMatch(/agent:\s*CodeActAgent\s*\n/)
    expect(content).toMatch(/---\s*\n/)
    
    // Check for content sections
    expect(content).toMatch(/Repository Overview/)
    expect(content).toMatch(/Directory Structure/)
    expect(content).toMatch(/Development Guidelines/)
    expect(content).toMatch(/Testing Requirements/)
    expect(content).toMatch(/Setup Instructions/)
  })
})