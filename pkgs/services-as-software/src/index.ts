import type { ServiceDefinition, RegisteredService } from './types';
import { calculatePrice } from './pricing';

/**
 * Create a service with objectives, key results, and pricing models
 * @param definition Service definition
 * @returns Service object with additional methods
 */
export function Service(definition: ServiceDefinition) {
  validateServiceDefinition(definition);

  const service = {
    ...definition,
    
    /**
     * Calculate the price for this service
     * @param params Parameters for price calculation
     * @returns Calculated price
     */
    calculatePrice(params?: Parameters<typeof calculatePrice>[1]) {
      return calculatePrice(definition.pricing, params);
    },

    /**
     * Register the service with the service registry
     * @returns Promise resolving to the registered service
     */
    async register(): Promise<RegisteredService> {
      return {
        ...definition,
        id: generateId(),
        status: 'active',
        endpoint: `https://api.services.do/services/${generateId()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },

    /**
     * Track progress towards key results
     * @param results Record of key result updates
     */
    trackProgress(results: Record<string, number>) {
      definition.keyResults.forEach(kr => {
        if (kr.description in results) {
          kr.currentValue = results[kr.description];
        }
      });
    },

    /**
     * Check if all key results have been achieved
     * @returns Whether all key results have been achieved
     */
    isObjectiveAchieved(): boolean {
      return definition.keyResults.every(kr => 
        kr.currentValue !== undefined && 
        kr.target !== undefined && 
        kr.currentValue >= kr.target
      );
    }
  };

  return service;
}

/**
 * Validate a service definition
 * @param definition Service definition to validate
 * @throws Error if the definition is invalid
 */
function validateServiceDefinition(definition: ServiceDefinition) {
  const { name, objective, keyResults, pricing, implementation } = definition;

  if (!name) {
    throw new Error('Service name is required');
  }

  if (!objective || !objective.description) {
    throw new Error('Service objective with description is required');
  }

  if (!keyResults || !Array.isArray(keyResults) || keyResults.length === 0) {
    throw new Error('At least one key result is required');
  }

  if (!pricing || !pricing.model) {
    throw new Error('Service pricing model is required');
  }

  if (!implementation || !implementation.type || !implementation.id) {
    throw new Error('Service implementation details are required');
  }

  switch (pricing.model) {
    case 'cost-based':
      if (pricing.costBase === undefined) {
        throw new Error('Cost base is required for cost-based pricing');
      }
      break;
    case 'margin-based':
      if (pricing.costBase === undefined || pricing.marginPercentage === undefined) {
        throw new Error('Cost base and margin percentage are required for margin-based pricing');
      }
      break;
    case 'activity-based':
      if (!pricing.activities || !Array.isArray(pricing.activities) || pricing.activities.length === 0) {
        throw new Error('At least one activity is required for activity-based pricing');
      }
      break;
    case 'outcome-based':
      if (!pricing.outcomes || !Array.isArray(pricing.outcomes) || pricing.outcomes.length === 0) {
        throw new Error('At least one outcome is required for outcome-based pricing');
      }
      break;
    default:
      throw new Error(`Unsupported pricing model: ${(pricing as any).model}`);
  }
}

/**
 * Generate a unique ID
 * @returns Unique ID string
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export * from './types';
export * from './pricing';
