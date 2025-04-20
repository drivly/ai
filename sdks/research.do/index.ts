import { ResearchClient } from './src/client'
export { ResearchClient } from './src/client'
export type { ResearchClientOptions, ResearchOptions, ResearchResponse, ResearchError } from './types'

export const research = new ResearchClient()

export default ResearchClient
