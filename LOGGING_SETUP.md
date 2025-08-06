# Logging Setup with SigNoz

This document explains how to configure logging to send logs to SigNoz along with traces.

## Environment Variables Required

Create a `.env` file in the root directory with the following variables:

```env
# OpenTelemetry Configuration
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/logs
OTEL_SERVICE_NAME=1851-admin-be-api

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=1851_admin_be_api

# Node Environment
NODE_ENV=development
```

## How It Works

1. **Winston Logger**: We use Winston as the logging library with structured JSON logging
2. **OpenTelemetry Integration**: Winston logs are automatically instrumented and sent to SigNoz
3. **Log Exporter**: Uses `@opentelemetry/exporter-logs-otlp-http` to send logs to SigNoz
4. **Structured Logging**: All logs include metadata like service name, timestamp, and custom fields

## Usage Examples

### Basic Logging
```typescript
import logger from './logger';

logger.info('User logged in', { userId: 123, email: 'user@example.com' });
logger.error('Database connection failed', { error: error.message, retryCount: 3 });
logger.warn('High memory usage detected', { memoryUsage: '85%' });
```

### With Trace Correlation
The logs will automatically be correlated with traces when used within a traced operation.

## Docker Setup

Make sure your SigNoz collector is running and accessible at the configured endpoint. The default setup uses:
- **Endpoint**: `http://localhost:4318/v1/logs`
- **Protocol**: HTTP (not gRPC)

## Verification

1. Start your API application
2. Make a request to any endpoint
3. Check SigNoz UI for logs in the "Logs" section
4. You should see structured logs with metadata

## Troubleshooting

1. **Logs not appearing**: Check if SigNoz collector is running and accessible
2. **Connection errors**: Verify the `OTEL_EXPORTER_OTLP_ENDPOINT` URL
3. **Missing metadata**: Ensure `OTEL_SERVICE_NAME` is set correctly 