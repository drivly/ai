# Vercel Log Drain Worker

This Cloudflare worker receives log drain events from Vercel and sends them to Clickhouse for storage and analysis.

## Overview

Vercel Log Drains allow you to forward logs from your Vercel deployments to external services. This worker acts as a receiver for these logs and forwards them to a Clickhouse database for storage and analysis.

## Configuration

### Environment Variables

The worker requires the following environment variables:

- `CLICKHOUSE_HOST`: The URL of your Clickhouse instance
- `CLICKHOUSE_DB`: The Clickhouse database name
- `CLICKHOUSE_TABLE`: The Clickhouse table name

### Secrets

The worker requires the following secrets:

- `CLICKHOUSE_USER`: The Clickhouse username
- `CLICKHOUSE_PASSWORD`: The Clickhouse password

## Deployment

To deploy the worker:

```bash
cd workers/vercel-log-drain
pnpm install
pnpm deploy
```

## Usage

Once deployed, configure your Vercel project to send logs to the worker's URL:

1. Go to your Vercel project settings
2. Navigate to the "Log Drains" section
3. Add a new Log Drain with the worker's URL
4. Select the log types you want to forward

## Clickhouse Schema

Create the following table in your Clickhouse database:

```sql
CREATE TABLE vercel_logs.log_events (
  id String,
  timestamp DateTime64(3),
  project_id String,
  deployment_id Nullable(String),
  build_id Nullable(String),
  message String,
  source String,
  host Nullable(String),
  level Enum('debug', 'info', 'warn', 'error'),
  region Nullable(String),
  raw_event String
) ENGINE = MergeTree()
ORDER BY (timestamp, id);
```

## References

- [Vercel Log Drains Reference](https://vercel.com/docs/log-drains/log-drains-reference)
- [Clickhouse Documentation](https://clickhouse.com/docs)
