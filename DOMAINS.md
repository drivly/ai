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

| resources.do | ✅ Online | gina.ns.cloudflare.com, ernest.ns.cloudflare.com | [https://resources.do](https://resources.do) |
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
- **resources.do**: Resource management and storage
- **databases.do**: Alias for database.do
- **okrs.do**: Objectives and Key Results tracking
- **llms.do**: Alias for llm.do

## Vercel Integration Status

Currently, none of the domains are linked in Vercel. This may require proper authentication with the Vercel API to verify.

## Complete Domain List

The AI Primitives platform manages the following domains:

| Domain |
|--------|
| action.do |
| actions.do |
| agents.do |
| agi.do |
| amy.do |
| analytics.do |
| apis.do |
| ari.do |
| barcode.do |
| bdr.do |
| benchmarks.do |
| blogs.do |
| bots.do |
| browse.do |
| browser.do |
| browsers.do |
| careers.do |
| cfo.do |
| clickhouse.do |
| cmo.do |
| colo.do |
| coo.do |
| cpo.do |
| cro.do |
| cto.do |
| ctx.do |
| dara.do |
| dash.do |
| dashboard.do |
| database.do |
| databases.do |
| dealers.do |
| emails.do |
| embeddings.do |
| esbuild.do |
| evals.do |
| events.do |
| experiments.do |
| extract.do |
| function.do |
| functions.do |
| gcp.do |
| gpt.do |
| graph.do |
| humans.do |
| integrations.do |
| issues.do |
| ivy.do |
| kpis.do |
| lena.do |
| lexi.do |
| lists.do |
| llm.do |
| llms.do |
| lodash.do |
| mcp.do |
| mdx.do |
| models.do |
| nat.do |
| nats.do |
| nouns.do |
| oauth.do |
| objects.do |
| okrs.do |
| payload.do |
| pdm.do |
| perf.do |
| photos.do |
| pkg.do |
| programmers.do |
| prxy.do |
| qrcode.do |
| queue.do |
| repo.do |
| requests.do |
| research.do |
| resources.do |
| responses.do |
| scraper.do |
| sdk.do |
| sdr.do |
| searches.do |
| services.do |
| sites.do |
| speak.do |
| state.do |
| studio.do |
| svc.do |
| swe.do |
| tasks.do |
| tom.do |
| trace.do |
| traces.do |
| trigger.do |
| triggers.do |
| vectors.do |
| vehicle.do |
| vera.do |
| verbs.do |
| waitlist.do |
| webhook.do |
| webhooks.do |
| worker.do |
| workers.do |
| workflows.do |

## Notes

- Domains with a ✅ status are online and responding with a 200 status code
- Domains with a ❌ status are either offline or not responding to HTTP requests
- NS Records show the nameservers responsible for the domain
- Some domains may be aliases or redirects to other primary domains
- The complete domain list is sourced from the `domains` export in domains.config.ts
