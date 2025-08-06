// Simple test script to verify logging setup
require('dotenv').config();

const winston = require('winston');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { LoggerProvider, SimpleLogRecordProcessor } = require('@opentelemetry/sdk-logs');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { WinstonInstrumentation } = require('@opentelemetry/instrumentation-winston');

// Create OpenTelemetry Logger Provider
const logExporter = new OTLPLogExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/logs',
});

const loggerProvider = new LoggerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || '1851-admin-be-api',
  }),
});

loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(logExporter));

// Create Winston logger
const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: process.env.OTEL_SERVICE_NAME || '1851-admin-be-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Initialize Winston instrumentation
const winstonInstrumentation = new WinstonInstrumentation({
  logger: winstonLogger,
});

// Start the instrumentation
winstonInstrumentation.enable();

console.log('Testing logging setup...');
console.log('OTEL_EXPORTER_OTLP_ENDPOINT:', process.env.OTEL_EXPORTER_OTLP_ENDPOINT);
console.log('OTEL_SERVICE_NAME:', process.env.OTEL_SERVICE_NAME);

// Test different log levels
winstonLogger.info('Test info message', { 
  test: true, 
  timestamp: new Date().toISOString(),
  level: 'info'
});

winstonLogger.warn('Test warning message', { 
  test: true, 
  timestamp: new Date().toISOString(),
  level: 'warn'
});

winstonLogger.error('Test error message', { 
  test: true, 
  timestamp: new Date().toISOString(),
  level: 'error',
  error: new Error('Test error')
});

console.log('Logging test completed. Check SigNoz UI for logs.');

// Shutdown after a delay to ensure logs are sent
setTimeout(() => {
  loggerProvider.shutdown().then(() => {
    console.log('Logger provider shutdown successfully');
    process.exit(0);
  }).catch((error) => {
    console.error('Error shutting down logger provider:', error);
    process.exit(1);
  });
}, 2000); 