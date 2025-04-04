
export const eventsTableSchema = `
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT generateULID(),
  timestamp Int32 DEFAULT toInt32(now()),
  type String,
  source String,
  subjectId String,
  data JSON,
  metadata JSON,
  actionId String,
  triggerId String,
  searchId String,
  functionId String,
  workflowId String,
  agentId String
) ENGINE = MergeTree()
ORDER BY (timestamp, type)
`;

export const generationsTableSchema = `
CREATE TABLE IF NOT EXISTS generations (
  id UUID DEFAULT generateULID(),
  timestamp Int32 DEFAULT toInt32(now()),
  actionId String,
  settingsId String,
  request JSON,
  response JSON,
  error JSON,
  status String,
  duration Float64,
  tokensInput Int32,
  tokensOutput Int32,
  cost Float64
) ENGINE = MergeTree()
ORDER BY (timestamp, status)
`;

export const requestsTableSchema = `
CREATE TABLE IF NOT EXISTS requests (
  id UUID DEFAULT generateULID(),
  timestamp Int32 DEFAULT toInt32(now()),
  method String,
  path String,
  hostname String,
  status Int32,
  latency Float64,
  userId String,
  ip String,
  userAgent String,
  referer String,
  requestBody JSON,
  responseBody JSON
) ENGINE = MergeTree()
ORDER BY (timestamp, path)
`;

export const tableSchemas: Record<string, string> = {
  events: eventsTableSchema,
  generations: generationsTableSchema,
  requests: requestsTableSchema,
};

export const tableNames = Object.keys(tableSchemas);
