import { readFileSync } from 'fs'
import { parse } from 'yaml'
import path from 'path'

interface Blog {
  name: string
  url: string
  category: string
  focus: string[]
  metrics: {
    monthlyVisitors: number
    domainAuthority: number
  }
  contactInfo: {
    email?: string
    contactPage: string
  }
  status: string
  notes: string
}

export const getDomains = () => {
  try {
    const yamlContent = readFileSync(path.resolve(process.cwd(), '../growth/data/target-blogs.yaml'), 'utf8')
    const blogs = parse(yamlContent) as Blog[]
    return blogs.map(blog => blog.url.replace(/^https?:\/\//, ''))
  } catch (error) {
    console.error('Error loading domains from target-blogs.yaml:', error)
    // Fallback to a small set of domains if file can't be loaded
    return [
      'aws.amazon.com',
      'microsoft.com',
      'google.com',
      'apple.com',
      'netflix.com',
      'facebook.com',
      'twitter.com',
      'linkedin.com',
      'github.com',
      'cloudflare.com'
    ]
  }
}
