# Domain Status

This document provides the current status of all domains used in the AI Primitives platform. The status was last updated on April 1, 2025.

## Domains Overview

The AI Primitives platform uses various domains for different services and components. Each domain serves a specific purpose in the platform's architecture.

## Current Status

| Domain | Status | NS Records | Link |
|--------|--------|------------|------|
| functions.do | ✅ Online | gina.ns.cloudflare.com, ernest.ns.cloudflare.com | [https://functions.do](https://functions.do) |
| workflows.do | ✅ Online | ernest.ns.cloudflare.com, gina.ns.cloudflare.com | [https://workflows.do](https://workflows.do) |
| database.do | ✅ Online | dayana.ns.cloudflare.com, sean.ns.cloudflare.com | [https://database.do](https://database.do) |
| agents.do | ✅ Online | sean.ns.cloudflare.com, dayana.ns.cloudflare.com | [https://agents.do](https://agents.do) |
| nouns.do | ✅ Online | dayana.ns.cloudflare.com, sean.ns.cloudflare.com | [https://nouns.do](https://nouns.do) |
| verbs.do | ✅ Online | sean.ns.cloudflare.com, dayana.ns.cloudflare.com | [https://verbs.do](https://verbs.do) |
| things.do | ❌ Offline | ns2.checkdomain.de, ns.checkdomain.de | [https://things.do](https://things.do) |
| triggers.do | ✅ Online | gina.ns.cloudflare.com, ernest.ns.cloudflare.com | [https://triggers.do](https://triggers.do) |
| searches.do | ✅ Online | gina.ns.cloudflare.com, ernest.ns.cloudflare.com | [https://searches.do](https://searches.do) |
| actions.do | ✅ Online | ernest.ns.cloudflare.com, gina.ns.cloudflare.com | [https://actions.do](https://actions.do) |
| llm.do | ✅ Online | dayana.ns.cloudflare.com, sean.ns.cloudflare.com | [https://llm.do](https://llm.do) |
| evals.do | ✅ Online | dayana.ns.cloudflare.com, sean.ns.cloudflare.com | [https://evals.do](https://evals.do) |
| analytics.do | ✅ Online | ernest.ns.cloudflare.com, gina.ns.cloudflare.com | [https://analytics.do](https://analytics.do) |
| experiments.do | ✅ Online | dayana.ns.cloudflare.com, sean.ns.cloudflare.com | [https://experiments.do](https://experiments.do) |
| integrations.do | ✅ Online | sean.ns.cloudflare.com, dayana.ns.cloudflare.com | [https://integrations.do](https://integrations.do) |
| models.do | ✅ Online | sean.ns.cloudflare.com, dayana.ns.cloudflare.com | [https://models.do](https://models.do) |
| databases.do | ❌ Offline | None found | [https://databases.do](https://databases.do) |
| okrs.do | ❌ Offline | None found | [https://okrs.do](https://okrs.do) |
| llms.do | ❌ Offline | None found | [https://llms.do](https://llms.do) |

## Domain Purposes

- **functions.do**: Strongly-typed composable building blocks
- **workflows.do**: Declarative state machines for orchestration
- **agents.do**: Autonomous digital workers
- **database.do**: Persistent data storage with Payload CMS
- **llm.do**: Intelligent AI gateway for routing requests to optimal models
- **evals.do**: Evaluation tools for AI components
- **integrations.do**: Connectors for external systems
- **models.do**: AI model registry and management
- **analytics.do**: Analytics and reporting for AI applications
- **experiments.do**: A/B testing and experimentation platform
- **triggers.do**: Event-based workflow triggers
- **searches.do**: Search functionality across the platform
- **actions.do**: Action definitions for workflows and agents
- **nouns.do**: Noun definitions for language processing
- **verbs.do**: Verb definitions for language processing
- **things.do**: Entity management and storage
- **databases.do**: Alias for database.do
- **okrs.do**: Objectives and Key Results tracking
- **llms.do**: Alias for llm.do

## Vercel Integration Status

Currently, none of the domains are linked in Vercel. This may require proper authentication with the Vercel API to verify.

## Notes

- Domains with a ✅ status are online and responding with a 200 status code
- Domains with a ❌ status are either offline or not responding to HTTP requests
- NS Records show the nameservers responsible for the domain
- Some domains may be aliases or redirects to other primary domains
