import type { 
  ServicePricing, 
  CostBasedPricing, 
  MarginBasedPricing, 
  ActivityBasedPricing, 
  OutcomeBasedPricing 
} from '../types';

/**
 * Calculate price for cost-based pricing model
 * @param pricing Cost-based pricing configuration
 * @param quantity Number of units
 * @returns Calculated price
 */
export function calculateCostBasedPrice(pricing: CostBasedPricing, quantity: number = 1): number {
  const { costBase, fixedCosts = 0, variableCosts = 0 } = pricing;
  return costBase + fixedCosts + (variableCosts * quantity);
}

/**
 * Calculate price for margin-based pricing model
 * @param pricing Margin-based pricing configuration
 * @param quantity Number of units
 * @returns Calculated price
 */
export function calculateMarginBasedPrice(pricing: MarginBasedPricing, quantity: number = 1): number {
  const { costBase, marginPercentage } = pricing;
  const cost = costBase * quantity;
  const margin = cost * (marginPercentage / 100);
  return cost + margin;
}

/**
 * Calculate price for activity-based pricing model
 * @param pricing Activity-based pricing configuration
 * @param activities Record of activity names and their quantities
 * @returns Calculated price
 */
export function calculateActivityBasedPrice(
  pricing: ActivityBasedPricing, 
  activities: Record<string, number>
): number {
  return pricing.activities.reduce((total, activity) => {
    const quantity = activities[activity.name] || 0;
    return total + (activity.rate * quantity);
  }, 0);
}

/**
 * Calculate price for outcome-based pricing model
 * @param pricing Outcome-based pricing configuration
 * @param outcomes Record of metric names and their achieved values
 * @returns Calculated price
 */
export function calculateOutcomeBasedPrice(
  pricing: OutcomeBasedPricing, 
  outcomes: Record<string, number>
): number {
  return pricing.outcomes.reduce((total, outcome) => {
    const achievedValue = outcomes[outcome.metric] || 0;
    if (achievedValue >= outcome.targetValue) {
      return total + outcome.price;
    }
    return total;
  }, 0);
}

/**
 * Calculate price based on the pricing model
 * @param pricing Service pricing configuration
 * @param params Additional parameters for price calculation
 * @returns Calculated price
 */
export function calculatePrice(
  pricing: ServicePricing, 
  params: {
    quantity?: number;
    activities?: Record<string, number>;
    outcomes?: Record<string, number>;
  } = {}
): number {
  const { quantity = 1, activities = {}, outcomes = {} } = params;

  switch (pricing.model) {
    case 'cost-based':
      return calculateCostBasedPrice(pricing, quantity);
    case 'margin-based':
      return calculateMarginBasedPrice(pricing, quantity);
    case 'activity-based':
      return calculateActivityBasedPrice(pricing, activities);
    case 'outcome-based':
      return calculateOutcomeBasedPrice(pricing, outcomes);
    default:
      throw new Error(`Unsupported pricing model: ${(pricing as any).model}`);
  }
}
