CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT generateUUID(),
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
ORDER BY (timestamp, type);

CREATE TABLE IF NOT EXISTS generations (
  id UUID DEFAULT generateUUID(),
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
ORDER BY (timestamp, status);

CREATE TABLE IF NOT EXISTS requests (
  id UUID DEFAULT generateUUID(),
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
ORDER BY (timestamp, path);
