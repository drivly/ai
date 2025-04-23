const { InstrumentationBase } = require('@opentelemetry/instrumentation');
const { VERSION } = require('@opentelemetry/instrumentation-http/build/src/version');

/**
 * HttpInstrumentation shim class that provides a compatible interface
 * for Sentry while avoiding conflicts with OpenTelemetry
 */
class HttpInstrumentation extends InstrumentationBase {
  constructor(config = {}) {
    super('@opentelemetry/instrumentation-http', VERSION, config);
  }

  init() {
    return this;
  }

  setConfig() {}
  _getHttpInstrumentation() {}
  _getHttpsInstrumentation() {}
}

exports.HttpInstrumentation = HttpInstrumentation;
