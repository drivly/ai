# triggers.do

[![npm version](https://img.shields.io/npm/v/triggers.do.svg)](https://www.npmjs.com/package/triggers.do)
[![npm downloads](https://img.shields.io/npm/dm/triggers.do.svg)](https://www.npmjs.com/package/triggers.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?logo=discord&logoColor=white)](https://discord.gg/tafnNeUQdm)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)
[![GitHub Stars](https://img.shields.io/github/stars/drivly/ai.svg)](https://github.com/drivly/ai)

SDK for creating and managing event-based triggers for workflows and functions with APIs.do integration.

## The Challenge

Implementing event-based triggers presents several challenges:

- **Event Detection**: Identifying and capturing relevant events
- **Conditional Logic**: Determining when to trigger actions
- **Scheduling**: Executing triggers at specific times
- **Reliability**: Ensuring triggers fire consistently
- **Integration**: Connecting triggers to workflows and functions

## The Solution

triggers.do provides a clean, type-safe interface for implementing event-based triggers:

- Create triggers based on various event types
- Define conditional logic for trigger activation
- Schedule triggers for specific times
- Ensure reliable trigger execution
- Integrate with Workflows.do and Functions.do

## Installation

```bash
npm install triggers.do
# or
yarn add triggers.do
# or
pnpm add triggers.do
```

## API Overview

The triggers.do SDK exports:

- `triggers`: A client for interacting with event-based triggers
- Types for strong typing support

## Related Projects

- [functions.do](https://functions.do) - Typesafe AI Functions
- [workflows.do](https://workflows.do) - Business Process Automation
- [agents.do](https://agents.do) - Autonomous Digital Workers
- [apis.do](https://apis.do) - Clickable Developer Experiences

## License

MIT © [Drivly](https://driv.ly)

## Dependencies

- [apis.do](https://www.npmjs.com/package/apis.do) - Unified API Gateway for all domains and services in the `.do` ecosystem
