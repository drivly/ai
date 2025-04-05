/**
 * Configuration options for the Analytics SDK
 */
export interface AnalyticsConfig {
  /** API endpoint for analytics data */
  endpoint?: string;
  /** Debug mode for analytics */
  debug?: boolean;
  /** Environment mode */
  mode?: 'development' | 'production' | 'auto';
  /** Function to run before sending analytics events */
  beforeSend?: (event: BeforeSendEvent) => BeforeSendEvent | null;
  /** Custom event handlers */
  handlers?: Record<string, EventHandler>;
}

/**
 * Event data before sending to the analytics service
 */
export interface BeforeSendEvent {
  /** Event name */
  name: string;
  /** Event properties */
  properties?: Record<string, any>;
  /** URL where the event occurred */
  url: string;
  /** Timestamp of the event */
  timestamp: number;
}

/**
 * Custom event handler function
 */
export type EventHandler = (event: BeforeSendEvent) => void;

/**
 * Metrics tracking options
 */
export interface TrackMetricOptions {
  /** Metric name */
  name: string;
  /** Metric value */
  value: number | string | boolean;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Experiment variant
 */
export interface ExperimentVariant {
  /** Variant ID */
  id: string;
  /** Variant description */
  description: string;
}

/**
 * Experiment metrics configuration
 */
export interface ExperimentMetrics {
  /** Primary metric for the experiment */
  primary: string;
  /** Secondary metrics for the experiment */
  secondary?: string[];
}

/**
 * Experiment definition options
 */
export interface ExperimentOptions {
  /** Experiment name */
  name: string;
  /** Experiment description */
  description: string;
  /** Experiment variants */
  variants: ExperimentVariant[];
  /** Metrics to track for this experiment */
  metrics: ExperimentMetrics;
}

/**
 * Experiment instance returned by defineExperiment
 */
export interface Experiment {
  /** Experiment ID */
  id: string;
  /** Get the variant for a user */
  getVariant: (userId: string) => string;
  /** Track a metric for this experiment */
  trackMetric: (options: TrackMetricOptions & { variant: string, userId: string }) => Promise<void>;
}
