# analytics.do

[![npm version](https://img.shields.io/npm/v/analytics.do.svg)](https://www.npmjs.com/package/analytics.do)
[![npm downloads](https://img.shields.io/npm/dm/analytics.do.svg)](https://www.npmjs.com/package/analytics.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?logo=discord&logoColor=white)](https://discord.gg/tafnNeUQdm)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)
[![GitHub Stars](https://img.shields.io/github/stars/drivly/ai.svg)](https://github.com/drivly/ai)

A framework for collecting, analyzing, and acting on user feedback and analytics data for AI applications.

## Overview

analytics.do provides a lightweight, privacy-focused approach to collecting and analyzing user interactions with AI applications. It's designed to:

- Track key performance indicators (KPIs) for AI-driven processes
- Measure return on investment (ROI) of AI initiatives
- Compare performance across A/B tests and experiments
- Align technical metrics with business objectives (OKRs)

## Features

- **Business Metrics**: Track KPIs that matter to stakeholders
- **ROI Analysis**: Calculate financial impact of AI investments
- **Experiment Tracking**: Compare performance across A/B tests
- **OKR Alignment**: Connect AI performance to business objectives
- **Custom Dashboards**: Create reports for different stakeholders

## Installation

```bash
npm install analytics.do
# or
yarn add analytics.do
# or
pnpm add analytics.do
```

## Basic Usage

```typescript
import { trackMetric, defineExperiment } from 'analytics.do';

// Track metrics for business KPIs
await trackMetric({
  name: 'conversion',
  value: 1,
  metadata: {
    userId: 'user123',
    productId: 'prod456',
    revenue: 99.99,
  },
});
```

## Experiment Tracking

```typescript
import { defineExperiment } from 'analytics.do';

// Define an A/B test experiment
const productRecommendationTest = defineExperiment({
  name: 'product_recommendation_algorithm',
  description: 'Test different recommendation algorithms',
  variants: [
    { id: 'control', description: 'Current algorithm' },
    { id: 'collaborative', description: 'Collaborative filtering' },
    { id: 'content_based', description: 'Content-based filtering' },
  ],
  metrics: {
    primary: 'conversion_rate',
    secondary: ['revenue_per_user', 'click_through_rate'],
  },
});

// Determine which variant to show to a user
const userId = 'user123';
const variant = productRecommendationTest.getVariant(userId);

// Track experiment metrics
await productRecommendationTest.trackMetric({
  name: 'conversion',
  value: 1,
  variant: variant,
  userId: userId,
  metadata: {
    revenue: 99.99,
  },
});
```

## React Component for Page Views

```tsx
import { Analytics } from 'analytics.do';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

## Advanced Configuration

```typescript
import { initAnalytics } from 'analytics.do';

const analytics = initAnalytics({
  endpoint: '/custom-analytics-endpoint',
  debug: true,
  mode: 'production',
  beforeSend: (event) => {
    // Filter out sensitive URLs
    if (event.url.includes('/private')) {
      return null;
    }
    return event;
  },
});

// Use the configured instance
analytics.track('custom_event', {
  property1: 'value1',
  property2: 'value2',
});
```

## Server-Side Integration

The analytics.do SDK is designed to work with both client-side and server-side implementations. For server-side data collection and processing, it integrates with the Clickhouse-based analytics server.

## License

MIT
