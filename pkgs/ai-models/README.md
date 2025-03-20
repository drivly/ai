# ai-utils
Utilities and Tools for the AI SDK, Functions, Workflows, Observability, and Evals

open questions:

    We need to support provider/creator/model
    Do we need or want a @ sign?
    Do we also support a creator/model syntax without provider? I think probably
    I think we should follow/embrace openrouter's syntax wherever possible - extending it though to add our requirements
    Do we also have our own version of openrouter/auto, openrouter/auto:online
        Can we tie the routing into the contents of the message and/or priority? (like performance, latency, throughput, cost, etc?)
    How do we handle reasoning? Follow the :reasoning flag from openrouter?
    Many new open models do not initially support tools or structured output, as that requires a lot of work by the hosting provider to make that function ... do we want a composite type tool that could use a fast/cheap model like gemini-2-flash-lite or 4o-mini to transform the output of the first model into the specified structured output?
    How do we want to handle other capabilities/tools?
    Should we route :online to native search models like gemini, perplexity, or the new 4o-search? or do we just follow the OpenRouter convention of injecting the Search results into the context window before calling?
    Do we want to support more general purpose tools? (like https://agentic.so/intro)
    How can we also support our own secure code execution tool (JS not python like Google / OAI)

Clearly we will need to phase and iterate ... but we have to think very carefully because once we start using the API across multiple projects, it's going to be hard to change

@{provider}/{creator}/{model}:{config,capabilities,tools,priorities}

{creator}/{model}:{config,capabilities,tools,priorities}
?model=deepseek-ai/deepseek-r1-distill-qwen-32b

?model=@openai/openai/gpt-4o-search-preview

?model=openai/gpt-4o:code,online

@openrouter/deepseek-ai/deepseek-r1-distill-qwen-32b
@cloudflare/deepseek-ai/deepseek-r1-distill-qwen-32b
@google-vertex/deepseek-ai/deepseek-r1-distill-qwen-32b
@google-ai-studio/anthropic/claude-3.7-sonnet:thinking
@google-vertex/anthropic/claude-3.7-sonnet:thinking
@open-router/anthropic/claude-3.7-sonnet:thinking-low,online,nitro

Use Cases:

    Evals - we need to easily and dynamically/programmatically change models, settings, tools, configuration, and mode
    (for example - we need to test if something does better with or without reasoning ... and within reasoning, we need low, medium, and high models ... We also in some cases must force structured outputs to be structured outputs, because if tool use is required, say by an anthropic model, that supports structured outputs via tools, then that is incompatible ... but also, there are essentially 4 different ways to get Objects that match a certain schema:
        structured_output: the best by far, but very limited support ... I think only 3 providers support this today
        tool_use: There is support for many more providers with tool use, but only a subset actually enforces guaranteed schema ... but also has limitations on number of tools and forced tool to use
        response_format: Supported on a majority of providers and models - but not universal - this guarantees valid JSON responses, but not any guarantee about the schema. This JSON mode can also be used without a schema to just force the model to respond in a structured data form vs normal text/markdown
        system prompt: If the model/provider does not support any of the first 3, then you can just ask nicely ... but depending on the model, this will fail 10-50% of the time
    Experimentation - Humans or LLM-as-Judge can pick the preferred response from 2 or more models (ie. compare 4o, o2, 3.7, 3.7:reasoning, flash 2, flash 2.0 reasoning
    Specify best model - no cost/price requirements ... 4.5, o1-high, o3-mini-high, r1, 3.7, 3.7:reasoning-high, Flash 2 Pro, Flash 2 Reasoning
    Specify only reasoning:
    at runtime, be able to tweak provider/model/settings/tools via a simple query param for example ... ?model=*:reasoning+code would route that to any and all models with reasoning and a code execution tool ... currently adding tool, changing config, etc requires code changes ... we need all of these variables to be tweaked/edited/stored/evaluated at runtime without code changes
    also we need to opt in/out of caching (and maybe even logging req/res bodies in sensitive PII situations)
    also probably seed ...

## Usage

Examples:

```ts
// The name of the exported function should be changed, I just wanted to get the ball rolling
import { getSupportedModel } from '@drivly/ai-utils'

const model = getSupportedModel('@openai/openai/gpt-4o:code,online')
const model = getSupportedModel('@anthropic/anthropic/claude-3.7-sonnet:thinking,code,online')
const model = getSupportedModel([
  // Fallback support if a certain model is down / doesnt have the full capabilities supported
  req.args.model, // Attempt to use the model from the request, otherwise fallback to the next one
  '@openai/openai/gpt-4o:code,online,thinking',
  '@anthropic/anthropic/claude-3.7-sonnet:thinking,code,online',
])
```