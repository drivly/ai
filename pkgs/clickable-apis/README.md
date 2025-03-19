# `clickable-apis`

This package enables the creation of simple, self-describing APIs that can be navigated by a developer/user via URLs in the browser:

```json
{
  "api": {
    "name": "APIs.do",
    "description": "Economically valuable work delivered through simple APIs",
    "url": "https://apis.do",
    "login": "https://apis.do/login",
    "signup": "https://apis.do/signup",
    "docs": "https://apis.do/docs",
    "repo": "https://github.com/drivly/ai",
    "from": "https://driv.ly",
    "with": "https://agi.do"
  },
  "featured": {
    "Functions - Typesafe Results without Complexity": "https://functions.do",
    "Workflows - Reliably Execute Business Processes": "https://workflows.do",
    "Agents - Autonomous Digital Workers with Autonomy": "https://agents.do"
  },
  "events": {
    "Triggers - Initiate workflows based on events": "https://triggers.do",
    "Searches - Query and retrieve data": "https://searches.do",
    "Actions - Perform tasks within workflows": "https://actions.do"
  },
  "core": {
    "LLM - Intelligent AI Gateway": "https://llm.do",
    "Evals - Evaluate Functions, Workflows, and Agents": "https://evals.do",
    "Experiments - Economically Validate Workflows": "https://experiments.do",
    "Database - Persistent Data Storage": "https://database.do",
    "Integrations - Connect External APIs and Systems": "https://integrations.do"
  },
  "user": {
    "authenticated": false,
    "plan": "Free",
    "browser": "Safari",
    "os": "macOS",
    "ip": "",
    "isp": "",
    "flag": "🇺🇸",
    "zipcode": "",
    "city": "Bloomington",
    "metro": "Minneapolis-St. Paul",
    "region": "Minnesota",
    "country": "United States",
    "continent": "North America",
    "requestId": "922b15355d4d2b4b-ORD",
    "localTime": "3/19/2025, 1:58:42 AM",
    "timezone": "America/Chicago",
    "edgeLocation": "Chicago",
    "edgeDistanceMiles": 343,
    "latencyMilliseconds": 31,
    "recentInteractions": 0,
    "serviceLatency": 0
  }
}
```

This package uses WHATWG Request/Response objects, so it is compatible with Cloudflare Workers, Deno, NextJS/Vercel, etc.