# services.do

Service Registry and Management for the .do ecosystem

## Installation

```bash
npm install services.do
# or
yarn add services.do
# or
pnpm add services.do
```

## Usage

```typescript
import { Services } from 'services.do'

// Initialize the client
const services = new Services({
  apiKey: 'your-api-key', // Optional
  baseUrl: 'https://api.services.do', // Optional
})

// Register a new service
const service = await services.register({
  name: 'user-service',
  description: 'User management service',
  endpoint: 'https://users.api.example.com',
  version: '1.0.0',
  metadata: {
    owner: 'team-a',
    documentation: 'https://docs.example.com/user-service',
  },
})

// Discover services
const userServices = await services.discover({ name: 'user-service' })
const activeServices = await services.discover({ status: 'active' })
const allServices = await services.discover()

// Get service details
const serviceDetails = await services.get('service-id')

// Update service details
const updatedService = await services.update('service-id', {
  description: 'Updated description',
  endpoint: 'https://new-endpoint.example.com',
})

// Deregister a service
await services.deregister('service-id')
```

## API Reference

### `Services`

#### `constructor(options?: { apiKey?: string, baseUrl?: string })`

Creates a new Services client.

- `options.apiKey`: API key for authentication (optional)
- `options.baseUrl`: Base URL for the API (optional, defaults to 'https://apis.do')

#### `discover(query?: ServiceQuery): Promise<Service[]>`

Discovers services based on query parameters.

- `query`: Optional query parameters to filter services

#### `register(service: ServiceDefinition): Promise<Service>`

Registers a new service.

- `service`: Service definition to register

#### `get(id: string): Promise<Service>`

Gets service details by ID.

- `id`: Service ID

#### `update(id: string, updates: Partial<ServiceDefinition>): Promise<Service>`

Updates service details.

- `id`: Service ID
- `updates`: Partial service definition with updates

#### `deregister(id: string): Promise<Service>`

Deregisters a service.

- `id`: Service ID

#### `calculatePrice(id: string, usageData: UsageData): Promise<{ price: number; breakdown?: Record<string, number> }>`

Calculates the price for a service based on usage data.

- `id`: Service ID
- `usageData`: Usage data for price calculation
- Returns: Total price and breakdown by component

#### `recordUsage(id: string, usageData: UsageData): Promise<any>`

Records usage data for a service.

- `id`: Service ID
- `usageData`: Usage data to record

## Types

### `ServiceDefinition`

```typescript
interface ServiceDefinition {
  name: string
  description?: string
  endpoint: string
  version?: string
  pricing?: PricingScheme
  metadata?: Record<string, any>
}
```

### `Service`

```typescript
interface Service extends ServiceDefinition {
  id: string
  status: 'active' | 'inactive' | 'degraded'
  createdAt: string
  updatedAt: string
}
```

### `ServiceQuery`

```typescript
interface ServiceQuery {
  name?: string
  status?: 'active' | 'inactive' | 'degraded'
  [key: string]: any
}
```

### `PricingScheme`

```typescript
type PricingScheme = 
  | { type: 'input', ratePerInputUnit: number, unitName: string } 
  | { type: 'output', ratePerOutputUnit: number, unitName: string }
  | { type: 'usage', metric: 'time'|'calls'|'compute', rate: number, unitName: string }
  | { type: 'action', actions: Record<string, number> }
  | { type: 'outcome', outcomes: Record<string, number> }
  | { type: 'costPlus', markupPercent: number } 
  | { type: 'margin', percentOfValue: number }
  | { type: 'hybrid', baseFee: number, variableScheme: PricingScheme }
```

### `UsageData`

```typescript
interface UsageData {
  inputs?: number
  outputs?: number
  actions?: Record<string, number>
  outcomes?: Record<string, boolean | number>
  directCost?: number
  outcomeValue?: number
  usageTimeHours?: number
  apiCalls?: number
  computeUnits?: number
}
```

## License

MIT
