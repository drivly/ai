import { ExperimentsClient } from './client.js'
import { VercelFlagsProvider } from './provider.js'
import { experiment, cartesian } from './experiment.js'

export * from './types.js'
export { ExperimentsClient, VercelFlagsProvider, experiment, cartesian }
export default ExperimentsClient
