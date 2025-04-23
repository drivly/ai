// This file provides a compatible interface for Sentry to use with OpenTelemetry
import { InstrumentationBase } from '@opentelemetry/instrumentation';
import { VERSION } from '@opentelemetry/instrumentation-http/build/src/version.js';

/**
 * HttpInstrumentation shim class that provides a compatible interface
 * for Sentry while avoiding conflicts with OpenTelemetry
 */
class HttpInstrumentation extends InstrumentationBase {
  constructor(config = {}) {
    super('@opentelemetry/instrumentation-http', VERSION, config);
  }

  init() {
    // Minimal implementation to prevent errors
    return this;
  }

  // Add minimal required methods to satisfy the interface
  setConfig() {}
  _getHttpInstrumentation() {}
  _getHttpsInstrumentation() {}
}

export { HttpInstrumentation };
