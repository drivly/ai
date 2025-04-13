# Advanced Scraping Guide
Source: https://docs.firecrawl.dev/advanced-scraping-guide

Learn how to improve your Firecrawl scraping with advanced options.

This guide will walk you through the different endpoints of Firecrawl and how to use them fully with all its parameters.

## Basic scraping with Firecrawl (/scrape)

To scrape a single page and get clean markdown content, you can use the `/scrape` endpoint.

<CodeGroup>
  ```python Python
  # pip install firecrawl-py

  from firecrawl import FirecrawlApp

  app = FirecrawlApp(api_key="YOUR_API_KEY")

  content = app.scrape_url("https://docs.firecrawl.dev")
  ```

  ```JavaScript JavaScript
  // npm install @mendable/firecrawl-js

  import { FirecrawlApp } from 'firecrawl-js';

  const app = new FirecrawlApp({ apiKey: 'YOUR_API_KEY' });

  const content = await app.scrapeUrl('https://docs.firecrawl.dev');
  ```

  ```go Go
  // go get github.com/mendableai/firecrawl-go

  import (
    "fmt"
    "log"

    "github.com/mendableai/firecrawl-go"
  )

  func main() {
    app, err := firecrawl.NewFirecrawlApp("YOUR_API_KEY")
    if err != nil {
      log.Fatalf("Failed to initialize FirecrawlApp: %v", err)
    }

    content, err := app.ScrapeURL("docs.firecrawl.dev", nil)
    if err != nil {
      log.Fatalf("Failed)
    }
  }
  ```

  ```rust Rust
  // Install the firecrawl_rs crate with Cargo

  use firecrawl_rs::FirecrawlApp;
  #[tokio::main]
  async fn main() {
    // Initialize the FirecrawlApp with the API key
    let api_key = "YOUR_API_KEY";
    let api_url = "https://api.firecrawl.dev";
    let app = FirecrawlApp::new(api_key, api_url).expect("Failed to initialize FirecrawlApp");

    let scrape_result = app.scrape_url("https://docs.firecrawl.dev", None).await;
    match scrape_result {
      Ok(data) => println!("Scrape Result:\n{}", data["markdown"]),
      Err(e) => eprintln!("Scrape failed: {}", e),
    }
  }
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "url": "https://docs.firecrawl.dev"
      }'
  ```
</CodeGroup>

## Scraping PDFs

**Firecrawl supports scraping PDFs by default.** You can use the `/scrape` endpoint to scrape a PDF link and get the text content of the PDF. You can disable this by setting `parsePDF` to `false`.

## Scrape Options

When using the `/scrape` endpoint, you can customize the scraping behavior with many parameters. Here are the available options:

### Setting the content formats on response with `formats`

* **Type**: `array`
* **Enum**: `["markdown", "links", "html", "rawHtml", "screenshot", "json"]`
* **Description**: Specify the formats to include in the response. Options include:
  * `markdown`: Returns the scraped content in Markdown format.
  * `links`: Includes all hyperlinks found on the page.
  * `html`: Provides the content in HTML format.
  * `rawHtml`: Delivers the raw HTML content, without any processing.
  * `screenshot`: Includes a screenshot of the page as it appears in the browser.
  * `json`: Extracts structured information from the page using the LLM.
* **Default**: `["markdown"]`

### Getting the full page content as markdown with `onlyMainContent`

* **Type**: `boolean`
* **Description**: By default, the scraper will only return the main content of the page, excluding headers, navigation bars, footers, etc. Set this to `false` to return the full page content.
* **Default**: `true`

### Setting the tags to include with `includeTags`

* **Type**: `array`
* **Description**: Specify the HTML tags, classes and ids to include in the response.
* **Default**: undefined

### Setting the tags to exclude with `excludeTags`

* **Type**: `array`
* **Description**: Specify the HTML tags, classes and ids to exclude from the response.
* **Default**: undefined

### Waiting for the page to load with `waitFor`

* **Type**: `integer`
* **Description**: To be used only as a last resort. Wait for a specified amount of milliseconds for the page to load before fetching content.
* **Default**: `0`

### Setting the maximum `timeout`

* **Type**: `integer`
* **Description**: Set the maximum duration in milliseconds that the scraper will wait for the page to respond before aborting the operation.
* **Default**: `30000` (30 seconds)

### Example Usage

```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
    -H '
    Content-Type: application/json' \
    -H 'Authorization : Bearer YOUR_API_KEY' \
    -d '{
      "url": "https://docs.firecrawl.dev",
      "formats": ["markdown", "links", "html", "rawHtml", "screenshot"],
      "includeTags": ["h1", "p", "a", ".main-content"],
      "excludeTags": ["#ad", "#footer"],
      "onlyMainContent": false,
      "waitFor": 1000,
      "timeout": 15000
    }'
```

In this example, the scraper will:

* Return the full page content as markdown.
* Include the markdown, raw HTML, HTML, links and screenshot in the response.
* The response will include only the HTML tags `<h1>`, `<p>`, `<a>`, and elements with the class `.main-content`, while excluding any elements with the IDs `#ad` and `#footer`.
* Wait for 1000 milliseconds (1 second) for the page to load before fetching the content.
* Set the maximum duration of the scrape request to 15000 milliseconds (15 seconds).

Here is the API Reference for it: [Scrape Endpoint Documentation](https://docs.firecrawl.dev/api-reference/endpoint/scrape)

## Extractor Options

When using the `/scrape` endpoint, you can specify options for **extracting structured information** from the page content using the `extract` parameter. Here are the available options:

### Using the LLM Extraction

### schema

* **Type**: `object`
* **Required**: False if prompt is provided
* **Description**: The schema for the data to be extracted. This defines the structure of the extracted data.

### system prompt

* **Type**: `string`
* **Required**: False
* **Description**: System prompt for the LLM.

### prompt

* **Type**: `string`
* **Required**: False if schema is provided
* **Description**: A prompt for the LLM to extract the data in the correct structure.
* **Example**: `"Extract the features of the product"`

### Example Usage

```bash
curl -X POST https://api.firecrawl.dev/v0/scrape \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
      "url": "https://firecrawl.dev",
      "formats": ["markdown", "json"],
      "json": {
        "prompt": "Extract the features of the product"
      }
    }'
```

```json
{
  "success": true,
  "data": {
    "content": "Raw Content",
    "metadata": {
      "title": "Mendable",
      "description": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
      "robots": "follow, index",
      "ogTitle": "Mendable",
      "ogDescription": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
      "ogUrl": "https://docs.firecrawl.dev/",
      "ogImage": "https://docs.firecrawl.dev/mendable_new_og1.png",
      "ogLocaleAlternate": [],
      "ogSiteName": "Mendable",
      "sourceURL": "https://docs.firecrawl.dev/",
      "statusCode": 200
    },
    "extract": {
      "product": "Firecrawl",
      "features": {
        "general": {
          "description": "Turn websites into LLM-ready data.",
          "openSource": true,
          "freeCredits": 500,
          "useCases": [
            "AI applications",
            "Data science",
            "Market research",
            "Content aggregation"
          ]
        },
        "crawlingAndScraping": {
          "crawlAllAccessiblePages": true,
          "noSitemapRequired": true,
          "dynamicContentHandling": true,
          "dataCleanliness": {
            "process": "Advanced algorithms",
            "outputFormat": "Markdown"
          }
        },
        ...
      }
    }
  }
}
```

## Actions

When using the `/scrape` endpoint, Firecrawl allows you to perform various actions on a web page before scraping its content. This is particularly useful for interacting with dynamic content, navigating through pages, or accessing content that requires user interaction.

### Available Actions

#### wait

* **Type**: `object`
* **Description**: Wait for a specified amount of milliseconds.
* **Properties**:
  * `type`: `"wait"`
  * `milliseconds`: Number of milliseconds to wait.
* **Example**:
  ```json
  {
    "type": "wait",
    "milliseconds": 2000
  }
  ```

#### screenshot

* **Type**: `object`
* **Description**: Take a screenshot.
* **Properties**:
  * `type`: `"screenshot"`
  * `fullPage`: Should the screenshot be full-page or viewport sized? (default: `false`)
* **Example**:
  ```json
  {
    "type": "screenshot",
    "fullPage": true
  }
  ```

#### click

* **Type**: `object`
* **Description**: Click on an element.
* **Properties**:
  * `type`: `"click"`
  * `selector`: Query selector to find the element by.
* **Example**:
  ```json
  {
    "type": "click",
    "selector": "#load-more-button"
  }
  ```

#### write

* **Type**: `object`
* **Description**: Write text into an input field.
* **Properties**:
  * `type`: `"write"`
  * `text`: Text to type.
  * `selector`: Query selector for the input field.
* **Example**:
  ```json
  {
    "type": "write",
    "text": "Hello, world!",
    "selector": "#search-input"
  }
  ```

#### press

* **Type**: `object`
* **Description**: Press a key on the page.
* **Properties**:
  * `type`: `"press"`
  * `key`: Key to press.
* **Example**:
  ```json
  {
    "type": "press",
    "key": "Enter"
  }
  ```

#### scroll

* **Type**: `object`
* **Description**: Scroll the page.
* **Properties**:
  * `type`: `"scroll"`
  * `direction`: Direction to scroll (`"up"` or `"down"`).
  * `amount`: Amount to scroll in pixels.
* **Example**:
  ```json
  {
    "type": "scroll",
    "direction": "down",
    "amount": 500
  }
  ```

For more details about the actions parameters, refer to the [API Reference](https://docs.firecrawl.dev/api-reference/endpoint/scrape).

## Crawling Multiple Pages

To crawl multiple pages, you can use the `/crawl` endpoint. This endpoint allows you to specify a base URL you want to crawl and all accessible subpages will be crawled.

```bash
curl -X POST https://api.firecrawl.dev/v1/crawl \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
      "url": "https://docs.firecrawl.dev"
    }'
```

Returns a id

```json
{ "id": "1234-5678-9101" }
```

### Check Crawl Job

Used to check the status of a crawl job and get its result.

```bash
curl -X GET https://api.firecrawl.dev/v1/crawl/1234-5678-9101 \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY'
```

#### Pagination/Next URL

If the content is larger than 10MB or if the crawl job is still running, the response will include a `next` parameter. This parameter is a URL to the next page of results. You can use this parameter to get the next page of results.

### Crawler Options

When using the `/crawl` endpoint, you can customize the crawling behavior with request body parameters. Here are the available options:

#### `includePaths`

* **Type**: `array`
* **Description**: URL patterns to include in the crawl. Only URLs matching these patterns will be crawled.
* **Example**: `["/blog/*", "/products/*"]`

#### `excludePaths`

* **Type**: `array`
* **Description**: URL patterns to exclude from the crawl. URLs matching these patterns will be skipped.
* **Example**: `["/admin/*", "/login/*"]`

#### `maxDepth`

* **Type**: `integer`
* **Description**: Maximum depth to crawl relative to the entered URL. A maxDepth of 0 scrapes only the entered URL. A maxDepth of 1 scrapes the entered URL and all pages one level deep. A maxDepth of 2 scrapes the entered URL and all pages up to two levels deep. Higher values follow the same pattern.
* **Example**: `2`

#### `limit`

* **Type**: `integer`
* **Description**: Maximum number of pages to crawl.
* **Default**: `10000`

#### `allowBackwardLinks`

* **Type**: `boolean`
* **Description**: This option permits the crawler to navigate to URLs that are higher in the directory structure than the base URL. For instance, if the base URL is `example.com/blog/topic`, enabling this option allows crawling to pages like `example.com/blog` or `example.com`, which are backward in the path hierarchy relative to the base URL.
* **Default**: `false`

### `allowExternalLinks`

* **Type**: `boolean`
* **Description**: This option allows the crawler to follow links that point to external domains. Be careful with this option, as it can cause the crawl to stop only based only on the`limit` and `maxDepth` values.
* **Default**: `false`

#### scrapeOptions

As part of the crawler options, you can also specify the `scrapeOptions` parameter. This parameter allows you to customize the scraping behavior for each page.

* **Type**: `object`
* **Description**: Options for the scraper.
* **Example**: `{"formats": ["markdown", "links", "html", "rawHtml", "screenshot"], "includeTags": ["h1", "p", "a", ".main-content"], "excludeTags": ["#ad", "#footer"], "onlyMainContent": false, "waitFor": 1000, "timeout": 15000}`
* **Default**: `{ "formats": ["markdown"] }`
* **See**: [Scrape Options](#setting-the-content-formats-on-response-with-formats)

### Example Usage

```bash
curl -X POST https://api.firecrawl.dev/v1/crawl \
    -H 'Content-Type: application/json' \
    -H 'Authorization : Bearer YOUR_API_KEY' \
    -d '{
      "url": "https://docs.firecrawl.dev",
      "includePaths": ["/blog/*", "/products/*"],
      "excludePaths": ["/admin/*", "/login/*"],
      "maxDepth": 2,
      "limit": 1000
    }'
```

In this example, the crawler will:

* Only crawl URLs that match the patterns `/blog/*` and `/products/*`.
* Skip URLs that match the patterns `/admin/*` and `/login/*`.
* Return the full document data for each page.
* Crawl up to a maximum depth of 2.
* Crawl a maximum of 1000 pages.

## Mapping Website Links with `/map`

The `/map` endpoint is adept at identifying URLs that are contextually related to a given website. This feature is crucial for understanding a site's contextual link environment, which can greatly aid in strategic site analysis and navigation planning.

### Usage

To use the `/map` endpoint, you need to send a GET request with the URL of the page you want to map. Here is an example using `curl`:

```bash
curl -X POST https://api.firecrawl.dev/v1/map \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
      "url": "https://docs.firecrawl.dev"
    }'
```

This will return a JSON object containing links contextually related to the url.

### Example Response

```json
  {
    "success":true,
    "links":[
      "https://docs.firecrawl.dev",
      "https://docs.firecrawl.dev/api-reference/endpoint/crawl-delete",
      "https://docs.firecrawl.dev/api-reference/endpoint/crawl-get",
      "https://docs.firecrawl.dev/api-reference/endpoint/crawl-post",
      "https://docs.firecrawl.dev/api-reference/endpoint/map",
      "https://docs.firecrawl.dev/api-reference/endpoint/scrape",
      "https://docs.firecrawl.dev/api-reference/introduction",
      "https://docs.firecrawl.dev/articles/search-announcement",
      ...
    ]
  }
```

### Map Options

#### `search`

* **Type**: `string`
* **Description**: Search for links containing specific text.
* **Example**: `"blog"`

#### `limit`

* **Type**: `integer`
* **Description**: Maximum number of links to return.
* **Default**: `100`

#### `ignoreSitemap`

* **Type**: `boolean`
* **Description**: Ignore the website sitemap when crawling
* **Default**: `true`

#### `includeSubdomains`

* **Type**: `boolean`
* **Description**: Include subdomains of the website
* **Default**: `false`

Here is the API Reference for it: [Map Endpoint Documentation](https://docs.firecrawl.dev/api-reference/endpoint/map)


# Batch Scrape
Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape

v1-openapi POST /batch/scrape



# Get Batch Scrape Status
Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape-get

v1-openapi GET /batch/scrape/{id}



# Get Batch Scrape Errors
Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape-get-errors

v1-openapi GET /batch/scrape/{id}/errors



# Cancel Crawl
Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-delete

v1-openapi DELETE /crawl/{id}



# Get Crawl Status
Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-get

v1-openapi GET /crawl/{id}



# Get Crawl Errors
Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-get-errors

v1-openapi GET /crawl/{id}/errors



# Crawl
Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-post

v1-openapi POST /crawl



# Credit Usage
Source: https://docs.firecrawl.dev/api-reference/endpoint/credit-usage

v1-openapi GET /team/credit-usage



# Extract
Source: https://docs.firecrawl.dev/api-reference/endpoint/extract

v1-openapi POST /extract



# Get Extract Status
Source: https://docs.firecrawl.dev/api-reference/endpoint/extract-get

v1-openapi GET /extract/{id}



# Map
Source: https://docs.firecrawl.dev/api-reference/endpoint/map

v1-openapi POST /map



# Scrape
Source: https://docs.firecrawl.dev/api-reference/endpoint/scrape

v1-openapi POST /scrape



# Search
Source: https://docs.firecrawl.dev/api-reference/endpoint/search

v1-openapi POST /search

The search endpoint combines web search (SERP) with Firecrawl's scraping capabilities to return full page content for any query.

Include `scrapeOptions` with `formats: ["markdown"]` to get complete markdown content for each search result otherwise you will default to getting the SERP results (url, title, description).

## Supported query operators

We support a variety of query operators that allow you to filter your searches better.

| Operator      | Functionality                                                             | Examples                          |
| ------------- | ------------------------------------------------------------------------- | --------------------------------- |
| `""`          | Non-fuzzy matches a string of text                                        | `"Firecrawl"`                     |
| `-`           | Excludes certain keywords or negates other operators                      | `-bad`, `-site:firecrawl.dev`     |
| `site:`       | Only returns results from a specified website                             | `site:firecrawl.dev`              |
| `inurl:`      | Only returns results that include a word in the URL                       | `inurl:firecrawl`                 |
| `allinurl:`   | Only returns results that include multiple words in the URL               | `allinurl:git firecrawl`          |
| `intitle:`    | Only returns results that include a word in the title of the page         | `intitle:Firecrawl`               |
| `allintitle:` | Only returns results that include multiple words in the title of the page | `allintitle:firecrawl playground` |
| `related:`    | Only returns results that are related to a specific domain                | `related:firecrawl.dev`           |


# Introduction
Source: https://docs.firecrawl.dev/api-reference/introduction

Firecrawl API Reference

## Features

<CardGroup cols={2}>
  <Card title="Scrape" icon="markdown" href="/api-reference/endpoint/scrape" color="FF713C">
    Extract content from any webpage in markdown or json format.
  </Card>

  <Card title="Crawl" icon="spider" href="/api-reference/endpoint/crawl-post" color="FF713C">
    Crawl entire websites, extract their content and metadata.
  </Card>

  <Card title="Map" icon="map" href="/api-reference/endpoint/map" color="FF713C">
    Get a complete list of URLs from any website quickly and reliably.
  </Card>

  <Card title="Extract" icon="barcode-read" href="/api-reference/endpoint/extract" color="FF713C">
    Extract structured data from entire webpages using natural language.
  </Card>

  <Card title="Search" icon="magnifying-glass" href="/api-reference/endpoint/search" color="FF713C">
    Search the web and get full page content in any format.
  </Card>

  {/* <Card title="Deep Research" icon="brain-circuit" href="/api-reference/endpoint/deep-research" color="FF713C">
      AI-powered web research that autonomously explores and synthesizes information.
    </Card> */}
</CardGroup>

## Base URL

All requests contain the following base URL:

```bash
https://api.firecrawl.dev 
```

## Authentication

For authentication, it's required to include an Authorization header. The header should contain `Bearer fc-123456789`, where `fc-123456789` represents your API Key.

```bash
Authorization: Bearer fc-123456789
```

​

## Response codes

Firecrawl employs conventional HTTP status codes to signify the outcome of your requests.

Typically, 2xx HTTP status codes denote success, 4xx codes represent failures related to the user, and 5xx codes signal infrastructure problems.

| Status | Description                                  |
| ------ | -------------------------------------------- |
| 200    | Request was successful.                      |
| 400    | Verify the correctness of the parameters.    |
| 401    | The API key was not provided.                |
| 402    | Payment required                             |
| 404    | The requested resource could not be located. |
| 429    | The rate limit has been surpassed.           |
| 5xx    | Signifies a server error with Firecrawl.     |

Refer to the Error Codes section for a detailed explanation of all potential API errors.

​

## Rate limit

The Firecrawl API has a rate limit to ensure the stability and reliability of the service. The rate limit is applied to all endpoints and is based on the number of requests made within a specific time frame.

When you exceed the rate limit, you will receive a 429 response code.


# Running locally
Source: https://docs.firecrawl.dev/contributing/guide

Learn how to run Firecrawl locally to run on your own and/or contribute to the project.

Welcome to [Firecrawl](https://firecrawl.dev) 🔥! Here are some instructions on how to get the project locally so you can run it on your own and contribute.

If you're contributing, note that the process is similar to other open-source repos, i.e., fork Firecrawl, make changes, run tests, PR.

If you have any questions or would like help getting on board, join our Discord community [here](https://discord.gg/gSmWdAkdwd) for more information or submit an issue on Github [here](https://github.com/mendableai/firecrawl/issues/new/choose)!

## Running the project locally

First, start by installing dependencies:

1. node.js [instructions](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
2. pnpm [instructions](https://pnpm.io/installation)
3. redis [instructions](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/)

Set environment variables in a `.env` file in the `/apps/api/` directory. You can copy over the template in `.env.example`.

To start, we won't set up authentication, or any optional sub services (pdf parsing, JS blocking support, AI features)

```
# ./apps/api/.env

# ===== Required ENVS ======
NUM_WORKERS_PER_QUEUE=8 
PORT=3002
HOST=0.0.0.0

#for self-hosting using docker, use redis://redis:6379. For running locally, use redis://localhost:6379
REDIS_URL=redis://localhost:6379

#for self-hosting using docker, use redis://redis:6379. For running locally, use redis://localhost:6379
REDIS_RATE_LIMIT_URL=redis://localhost:6379 
PLAYWRIGHT_MICROSERVICE_URL=http://playwright-service:3000/html

## To turn on DB authentication, you need to set up supabase.
USE_DB_AUTHENTICATION=false

# ===== Optional ENVS ======

# Supabase Setup (used to support DB authentication, advanced logging, etc.)
SUPABASE_ANON_TOKEN= 
SUPABASE_URL= 
SUPABASE_SERVICE_TOKEN=

# Other Optionals
# use if you've set up authentication and want to test with a real API key
TEST_API_KEY=
# set if you'd like to test the scraping rate limit
RATE_LIMIT_TEST_API_KEY_SCRAPE=
# set if you'd like to test the crawling rate limit
RATE_LIMIT_TEST_API_KEY_CRAWL=
# set if you'd like to use scraping Be to handle JS blocking
SCRAPING_BEE_API_KEY=
# add for LLM dependednt features (image alt generation, etc.)
OPENAI_API_KEY=
BULL_AUTH_KEY=@
# use if you're configuring basic logging with logtail
LOGTAIL_KEY=
# set if you have a llamaparse key you'd like to use to parse pdfs
LLAMAPARSE_API_KEY=
# set if you'd like to send slack server health status messages
SLACK_WEBHOOK_URL=
# set if you'd like to send posthog events like job logs
POSTHOG_API_KEY=
# set if you'd like to send posthog events like job logs
POSTHOG_HOST=

# set if you'd like to use the fire engine closed beta
FIRE_ENGINE_BETA_URL=

# Proxy Settings for Playwright (Alternative you can can use a proxy service like oxylabs, which rotates IPs for you on every request)
PROXY_SERVER=
PROXY_USERNAME=
PROXY_PASSWORD=
# set if you'd like to block media requests to save proxy bandwidth
BLOCK_MEDIA=

# Set this to the URL of your webhook when using the self-hosted version of FireCrawl
SELF_HOSTED_WEBHOOK_URL=

# Resend API Key for transactional emails
RESEND_API_KEY=

# LOGGING_LEVEL determines the verbosity of logs that the system will output.
# Available levels are:
# NONE - No logs will be output.
# ERROR - For logging error messages that indicate a failure in a specific operation.
# WARN - For logging potentially harmful situations that are not necessarily errors.
# INFO - For logging informational messages that highlight the progress of the application.
# DEBUG - For logging detailed information on the flow through the system, primarily used for debugging.
# TRACE - For logging more detailed information than the DEBUG level.
# Set LOGGING_LEVEL to one of the above options to control logging output.
LOGGING_LEVEL=INFO
```

### Installing dependencies

First, install the dependencies using pnpm.

```bash
# cd apps/api # to make sure you're in the right folder
pnpm install # make sure you have pnpm version 9+!
```

### Running the project

You're going to need to open 3 terminals for running the services. Here is [a video guide accurate as of Oct 2024](https://youtu.be/LHqg5QNI4UY) (optional: 4 terminals for running the services and testing).

### Terminal 1 - setting up redis

Run the command anywhere within your project

```bash
redis-server
```

### Terminal 2 - setting up workers

Now, navigate to the apps/api/ directory and run:

```bash
pnpm run workers
# if you are going to use the [llm-extract feature](https://github.com/mendableai/firecrawl/pull/586/), you should also export OPENAI_API_KEY=sk-______
```

This will start the workers who are responsible for processing crawl jobs.

### Terminal 3 - setting up the main server

To do this, navigate to the apps/api/ directory. If you haven’t installed pnpm already, you can do so here: [https://pnpm.io/installation](https://pnpm.io/installation)

Next, run your server with:

```bash
pnpm run start
```

### *(Optional)* Terminal 4 - sending our first request

Alright, now let’s send our first request.

```curl
curl -X GET http://localhost:3002/test
```

This should return the response Hello, world!

If you’d like to test the crawl endpoint, you can run this

```curl
curl -X POST http://localhost:3002/v0/crawl \
    -H 'Content-Type: application/json' \
    -d '{
      "url": "https://docs.firecrawl.dev"
    }'
```

## Tests:

The best way to do this is run the test with `npm run test:local-no-auth` if you'd like to run the tests without authentication.

If you'd like to run the tests with authentication, run `npm run test:prod`


# Open Source vs Cloud
Source: https://docs.firecrawl.dev/contributing/open-source-or-cloud

Understand the differences between Firecrawl's open-source and cloud offerings

Firecrawl is open source available under the [AGPL-3.0 license](https://github.com/mendableai/firecrawl/blob/main/LICENSE).

To deliver the best possible product, we offer a hosted version of Firecrawl alongside our open-source offering. The cloud solution allows us to continuously innovate and maintain a high-quality, sustainable service for all users.

Firecrawl Cloud is available at [firecrawl.dev](https://firecrawl.dev) and offers a range of features that are not available in the open source version:

![Firecrawl Cloud vs Open Source](https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/images/open-source-cloud.png)


# Self-hosting
Source: https://docs.firecrawl.dev/contributing/self-host

Learn how to self-host Firecrawl to run on your own and contribute to the project.

#### Contributor?

Welcome to [Firecrawl](https://firecrawl.dev) 🔥! Here are some instructions on how to get the project locally so you can run it on your own and contribute.

If you're contributing, note that the process is similar to other open-source repos, i.e., fork Firecrawl, make changes, run tests, PR.

If you have any questions or would like help getting on board, join our Discord community [here](https://discord.gg/gSmWdAkdwd) for more information or submit an issue on Github [here](https://github.com/mendableai/firecrawl/issues/new/choose)!

## Self-hosting Firecrawl

Refer to [SELF\_HOST.md](https://github.com/mendableai/firecrawl/blob/main/SELF_HOST.md) for instructions on how to run it locally.

## Why?

Self-hosting Firecrawl is particularly beneficial for organizations with stringent security policies that require data to remain within controlled environments. Here are some key reasons to consider self-hosting:

* **Enhanced Security and Compliance:** By self-hosting, you ensure that all data handling and processing complies with internal and external regulations, keeping sensitive information within your secure infrastructure. Note that Firecrawl is a Mendable product and relies on SOC2 Type2 certification, which means that the platform adheres to high industry standards for managing data security.
* **Customizable Services:** Self-hosting allows you to tailor the services, such as the Playwright service, to meet specific needs or handle particular use cases that may not be supported by the standard cloud offering.
* **Learning and Community Contribution:** By setting up and maintaining your own instance, you gain a deeper understanding of how Firecrawl works, which can also lead to more meaningful contributions to the project.

### Considerations

However, there are some limitations and additional responsibilities to be aware of:

1. **Limited Access to Fire-engine:** Currently, self-hosted instances of Firecrawl do not have access to Fire-engine, which includes advanced features for handling IP blocks, robot detection mechanisms, and more. This means that while you can manage basic scraping tasks, more complex scenarios might require additional configuration or might not be supported.
2. **Manual Configuration Required:** If you need to use scraping methods beyond the basic fetch and Playwright options, you will need to manually configure these in the `.env` file. This requires a deeper understanding of the technologies and might involve more setup time.

Self-hosting Firecrawl is ideal for those who need full control over their scraping and data processing environments but comes with the trade-off of additional maintenance and configuration efforts.

## Steps

1. First, start by installing the dependencies

* Docker [instructions](https://docs.docker.com/get-docker/)

2. Set environment variables

Create an `.env` in the root directory you can copy over the template in `apps/api/.env.example`

To start, we wont set up authentication, or any optional sub services (pdf parsing, JS blocking support, AI features)

```
# .env

# ===== Required ENVS ======
NUM_WORKERS_PER_QUEUE=8 
PORT=3002
HOST=0.0.0.0

#for self-hosting using docker, use redis://redis:6379. For running locally, use redis://localhost:6379
REDIS_URL=redis://redis:6379

#for self-hosting using docker, use redis://redis:6379. For running locally, use redis://localhost:6379
REDIS_RATE_LIMIT_URL=redis://redis:6379 
PLAYWRIGHT_MICROSERVICE_URL=http://playwright-service:3000/html

## To turn on DB authentication, you need to set up supabase.
USE_DB_AUTHENTICATION=false

# ===== Optional ENVS ======

# Supabase Setup (used to support DB authentication, advanced logging, etc.)
SUPABASE_ANON_TOKEN= 
SUPABASE_URL= 
SUPABASE_SERVICE_TOKEN=

# Other Optionals
# use if you've set up authentication and want to test with a real API key
TEST_API_KEY=
# set if you'd like to test the scraping rate limit
RATE_LIMIT_TEST_API_KEY_SCRAPE=
# set if you'd like to test the crawling rate limit
RATE_LIMIT_TEST_API_KEY_CRAWL=
# set if you'd like to use scraping Be to handle JS blocking
SCRAPING_BEE_API_KEY=
# add for LLM dependednt features (image alt generation, etc.)
OPENAI_API_KEY=
BULL_AUTH_KEY=@
# use if you're configuring basic logging with logtail
LOGTAIL_KEY=
# set if you have a llamaparse key you'd like to use to parse pdfs
LLAMAPARSE_API_KEY=
# set if you'd like to send slack server health status messages
SLACK_WEBHOOK_URL=
# set if you'd like to send posthog events like job logs
POSTHOG_API_KEY=
# set if you'd like to send posthog events like job logs
POSTHOG_HOST=

# set if you'd like to use the fire engine closed beta
FIRE_ENGINE_BETA_URL=

# Proxy Settings for Playwright (Alternative you can can use a proxy service like oxylabs, which rotates IPs for you on every request)
PROXY_SERVER=
PROXY_USERNAME=
PROXY_PASSWORD=
# set if you'd like to block media requests to save proxy bandwidth
BLOCK_MEDIA=

# Set this to the URL of your webhook when using the self-hosted version of FireCrawl
SELF_HOSTED_WEBHOOK_URL=

# Resend API Key for transactional emails
RESEND_API_KEY=

# LOGGING_LEVEL determines the verbosity of logs that the system will output.
# Available levels are:
# NONE - No logs will be output.
# ERROR - For logging error messages that indicate a failure in a specific operation.
# WARN - For logging potentially harmful situations that are not necessarily errors.
# INFO - For logging informational messages that highlight the progress of the application.
# DEBUG - For logging detailed information on the flow through the system, primarily used for debugging.
# TRACE - For logging more detailed information than the DEBUG level.
# Set LOGGING_LEVEL to one of the above options to control logging output.
LOGGING_LEVEL=INFO
```

3. *(Optional) Running with TypeScript Playwright Service*

   * Update the `docker-compose.yml` file to change the Playwright service:

     ```plaintext
         build: apps/playwright-service
     ```

     TO

     ```plaintext
         build: apps/playwright-service-ts
     ```

   * Set the `PLAYWRIGHT_MICROSERVICE_URL` in your `.env` file:

     ```plaintext
     PLAYWRIGHT_MICROSERVICE_URL=http://localhost:3000/scrape
     ```

   * Don't forget to set the proxy server in your `.env` file as needed.

4. Build and run the Docker containers:

   ```bash
   docker compose build
   docker compose up
   ```

This will run a local instance of Firecrawl which can be accessed at `http://localhost:3002`.

You should be able to see the Bull Queue Manager UI on `http://localhost:3002/admin/@/queues`.

5. *(Optional)* Test the API

If you’d like to test the crawl endpoint, you can run this:

```bash
curl -X POST http://localhost:3002/v0/crawl \
    -H 'Content-Type: application/json' \
    -d '{
      "url": "https://docs.firecrawl.dev"
    }'
```

## Troubleshooting

This section provides solutions to common issues you might encounter while setting up or running your self-hosted instance of Firecrawl.

### Supabase client is not configured

**Symptom:**

```bash
[YYYY-MM-DDTHH:MM:SS.SSSz]ERROR - Attempted to access Supabase client when it's not configured.
[YYYY-MM-DDTHH:MM:SS.SSSz]ERROR - Error inserting scrape event: Error: Supabase client is not configured.
```

**Explanation:**
This error occurs because the Supabase client setup is not completed. You should be able to scrape and crawl with no problems. Right now it's not possible to configure Supabase in self-hosted instances.

### You're bypassing authentication

**Symptom:**

```bash
[YYYY-MM-DDTHH:MM:SS.SSSz]WARN - You're bypassing authentication
```

**Explanation:**
This error occurs because the Supabase client setup is not completed. You should be able to scrape and crawl with no problems. Right now it's not possible to configure Supabase in self-hosted instances.

### Docker containers fail to start

**Symptom:**
Docker containers exit unexpectedly or fail to start.

**Solution:**
Check the Docker logs for any error messages using the command:

```bash
docker logs [container_name]
```

* Ensure all required environment variables are set correctly in the .env file.
* Verify that all Docker services defined in docker-compose.yml are correctly configured and the necessary images are available.

### Connection issues with Redis

**Symptom:**
Errors related to connecting to Redis, such as timeouts or "Connection refused".

**Solution:**

* Ensure that the Redis service is up and running in your Docker environment.
* Verify that the REDIS\_URL and REDIS\_RATE\_LIMIT\_URL in your .env file point to the correct Redis instance.
* Check network settings and firewall rules that may block the connection to the Redis port.

### API endpoint does not respond

**Symptom:**
API requests to the Firecrawl instance timeout or return no response.

**Solution:**

* Ensure that the Firecrawl service is running by checking the Docker container status.
* Verify that the PORT and HOST settings in your .env file are correct and that no other service is using the same port.
* Check the network configuration to ensure that the host is accessible from the client making the API request.

By addressing these common issues, you can ensure a smoother setup and operation of your self-hosted Firecrawl instance.

## Install Firecrawl on a Kubernetes Cluster (Simple Version)

Read the [examples/kubernetes-cluster-install/README.md](https://github.com/mendableai/firecrawl/blob/main/examples/kubernetes-cluster-install/README.md) for instructions on how to install Firecrawl on a Kubernetes Cluster.


# Deep Research
Source: https://docs.firecrawl.dev/features/alpha/deep-research

Research API that allows you to build deep research into your own applications"

## Introducing Deep Research (Alpha)

The `/deep-research` endpoint enables AI-powered deep research and analysis on any topic. Simply provide a research query, and Firecrawl will autonomously explore the web, gather relevant information, and synthesize findings into comprehensive insights.

## Building with Deep Research

Deep Research works by:

1. Analyzing your query to identify key research areas
2. Iteratively searching and exploring relevant web content
3. Synthesizing information from multiple sources
4. Providing structured findings with source attribution

Firecrawl provides structured results that enable you to build powerful applications:

* **Activities**: Detailed timeline of research steps and findings
* **Sources**: Curated list of relevant URLs with titles and descriptions
* **Final Analysis**: Comprehensive synthesis of key insights and conclusions
* **Progress Tracking**: Real-time status updates on research depth and completion

### Example Usage

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  # Initialize the client
  firecrawl = FirecrawlApp(api_key="your_api_key")

  # Define research parameters
  params = {
      "maxDepth": 5,  # Number of research iterations
      "timeLimit": 180,  # Time limit in seconds
      "maxUrls": 15  # Maximum URLs to analyze
  }

  # Start research with real-time updates
  def on_activity(activity):
      print(f"[{activity['type']}] {activity['message']}")

  # Run deep research
  results = firecrawl.deep_research(
      query="What are the latest developments in quantum computing?",
      params=params,
      on_activity=on_activity
  )

  # Access research findings
  print(f"Final Analysis: {results['data']['finalAnalysis']}")
  print(f"Sources: {len(results['data']['sources'])} references") 
  ```

  ```js Node
  import FirecrawlApp from 'firecrawl';

  // Initialize the client
  const firecrawl = new FirecrawlApp({ apiKey: 'your_api_key' });

  // Define research parameters
  const params = {
    maxDepth: 5,  // Number of research iterations
    timeLimit: 180,  // Time limit in seconds
    maxUrls: 15  // Maximum URLs to analyze
  };

  // Start research with real-time updates
  const onActivity = (activity) => {
    console.log(`[${activity.type}] ${activity.message}`);
  };

  // Run deep research
  const results = await firecrawl.deepResearch(
    'What are the latest developments in quantum computing?',
    params,
    onActivity
  );

  // Access research findings
  console.log(`Final Analysis: ${results.data.finalAnalysis}`);
  console.log(`Sources: ${results.data.sources.length} references`); 
  ```

  ```bash cURL
  curl -X POST "https://api.firecrawl.dev/v1/deep-research" \
    -H "Authorization: Bearer your_api_key" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "What are the latest developments in quantum computing?",
      "maxDepth": 5,
      "timeLimit": 180,
      "maxUrls": 15
    }'
  ```
</CodeGroup>

**Key Parameters:**

* **query**: The research topic or question you want to investigate
* **maxDepth** (Optional): Maximum number of research iterations (1-10, default: 7)
* **timeLimit** (Optional): Time limit in seconds (30-300, default: 270)
* **maxUrls** (Optional): Maximum number of URLs to analyze (1-1000, default: 20)

See [API Reference](/api-reference/endpoint/deep-research) for more details.

### Response

```json
{
  "success": true,
  "data": {
    "finalAnalysis": "Recent developments in quantum computing show significant progress in several key areas:\n\n1. Error Correction: Improved quantum error correction techniques have increased qubit stability\n2. Quantum Supremacy: Multiple demonstrations of quantum advantage in specific computational tasks\n3. Hardware Advances: New architectures using superconducting circuits and trapped ions\n4. Commercial Applications: Growing industry adoption in optimization and cryptography",
    "activities": [
      {
        "type": "search",
        "status": "completed",
        "message": "Analyzing quantum computing breakthroughs in 2024",
        "timestamp": "2024-03-15T10:30:00Z",
        "depth": 1
      }
    ],
    "sources": [
      {
        "url": "https://example.com/quantum-computing-2024",
        "title": "Latest Quantum Computing Breakthroughs",
        "description": "Overview of recent advances in quantum computing technology"
      }
    ]
  },
  "status": "completed",
  "currentDepth": 5,
  "maxDepth": 5,
  "expiresAt": "2024-03-16T10:30:00Z"
} 
```

## Monitoring Research Progress

Deep Research jobs run asynchronously. You can monitor progress and receive real-time updates:

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  # Initialize the client
  firecrawl = FirecrawlApp(api_key="your_api_key")

  # Check research status
  status = firecrawl.check_deep_research_status("job_id")

  # Print current progress
  print(f"Status: {status['status']}")
  print(f"Progress: {status['currentDepth']}/{status['maxDepth']} iterations")

  if status['status'] == 'completed':
      print(f"Final Analysis: {status['data']['finalAnalysis']}")
      print(f"Sources found: {len(status['data']['sources'])}") 
  ```

  ```js Node
  import FirecrawlApp from 'firecrawl';

  // Initialize the client
  const firecrawl = new FirecrawlApp({ apiKey: 'your_api_key' });

  // Check research status
  const status = await firecrawl.checkDeepResearchStatus('job_id');

  // Print current progress
  console.log(`Status: ${status.status}`);
  console.log(`Progress: ${status.currentDepth}/${status.maxDepth} iterations`);

  if (status.status === 'completed') {
    console.log(`Final Analysis: ${status.data.finalAnalysis}`);
    console.log(`Sources found: ${status.data.sources.length}`);
  } 
  ```

  ```bash
  curl "https://api.firecrawl.dev/v1/deep-research/job_id" \
    -H "Authorization: Bearer your_api_key"
  ```
</CodeGroup>

### Research Activities

The data response includes:

* **activities**: List of research activities with the following properties:
* `type`: Type of activity ('search', 'extract', 'analyze', 'reasoning', 'synthesis', 'thought')
* `status`: Activity status ('processing', 'complete', 'error')
* `message`: Description of the activity or finding
* `timestamp`: ISO timestamp of when the activity occurred
* `depth`: Current research depth level
* **sources**: Referenced URLs with titles and descriptions
* `title`: Title of the source
* `description`: Description of the source
* `url`: URL of the source
* `icon`: Icon of the source
* **finalAnalysis**: Comprehensive analysis (when completed)

### Status Examples

#### In Progress

```json
{
  "success": true,
  "status": "processing",
  "data": {
    "activities": [
      {
        "type": "search",
        "status": "completed",
        "message": "Initial research on quantum computing trends",
        "timestamp": "2024-03-15T10:30:00Z",
        "depth": 1
      },
      {
        "type": "analyze",
        "status": "in_progress",
        "message": "Analyzing quantum error correction advances",
        "timestamp": "2024-03-15T10:31:00Z",
        "depth": 2
      }
    ],
    "sources": [
      {
        "url": "https://example.com/quantum-computing-2024",
        "title": "Latest Quantum Computing Breakthroughs",
        "description": "Overview of recent advances in quantum computing technology"
        }
      ],
    },
  "currentDepth": 2,
  "maxDepth": 5,
  "expiresAt": "2024-03-16T10:30:00Z"
} 
```

#### Completed

```json
{
  "success": true,
  "status": "completed",
  "data": {
    "finalAnalysis": "Recent developments in quantum computing show significant progress in several key areas:\n\n1. Error Correction: Improved quantum error correction techniques have increased qubit stability\n2. Quantum Supremacy: Multiple demonstrations of quantum advantage in specific computational tasks\n3. Hardware Advances: New architectures using superconducting circuits and trapped ions\n4. Commercial Applications: Growing industry adoption in optimization and cryptography",
    "activities": [
      {
        "type": "search",
        "status": "completed",
        "message": "Initial research on quantum computing trends",
        "timestamp": "2024-03-15T10:30:00Z",
        "depth": 1
      },
      {
        "type": "analyze",
        "status": "completed",
        "message": "Analyzing quantum error correction advances",
        "timestamp": "2024-03-15T10:31:00Z",
        "depth": 2
      },
      {
        "type": "synthesize",
        "status": "completed",
        "message": "Synthesizing findings from multiple sources",
        "timestamp": "2024-03-15T10:32:00Z",
        "depth": 5
      }
    ],
    "sources": [
      {
        "url": "https://example.com/quantum-computing-2024",
        "title": "Latest Quantum Computing Breakthroughs",
        "description": "Overview of recent advances in quantum computing technology"
      },
      {
        "url": "https://example.com/quantum-error-correction",
        "title": "Advances in Quantum Error Correction",
        "description": "Deep dive into recent quantum error correction techniques"
      }
    ]
  },
  "currentDepth": 5,
  "maxDepth": 5,
  "expiresAt": "2024-03-16T10:30:00Z"
} 
```

### JSON Output

You can now specify the JSON output format by setting the `formats` parameter to `json`. Set the `jsonOptions` parameter to specify the schema for the JSON output.

### Customize even further

You can also specify a `systemPrompt` and an `analysisPrompt` to customize the agentic process and the final analysis, respectively.

## Models

While in Alpha we use a combination of small models to explore the web and synthesize information. That way we can keep the cost low and the research fast. But this can result in the synthesis not being very long and detailed. If you'd like us to offer more powerful models, let us know at [help@firecrawl.dev](mailto:help@firecrawl.dev).

## Known Limitations (Alpha)

1. **Research Scope**\
   Best suited for topics with publicly available information. May not access paywalled or private content.

2. **Time Constraints**\
   Research jobs are limited to 10 minutes maximum to ensure reasonable response times.

3. **Source Verification**\
   While sources are provided, manual verification of critical information is recommended.

4. **Alpha State**\
   As an Alpha feature, the research methodology and output format may evolve based on feedback.

## Billing and Usage

Billing is done based on the number of `urls` analyzed. Each `url` is 1 credit. You can specify the max number of urls to analyze with the `maxUrls` parameter.

Have feedback or need help? Email [help@firecrawl.dev](mailto:help@firecrawl.dev).


# Generate LLMs.txt with an API
Source: https://docs.firecrawl.dev/features/alpha/llmstxt

Generate LLMs.txt files from any website for LLM training and analysis

## Introducing LLMs.txt Generator Endpoint (Alpha) 📃

The `/llmstxt` endpoint allows you to transform any website into clean, [LLM-ready text files](https://www.firecrawl.dev/blog/How-to-Create-an-llms-txt-File-for-Any-Website). Simply provide a URL, and Firecrawl will crawl the site and generate both `llms.txt` and `llms-full.txt` files that can be used for training or analysis with any LLM.

## How It Works

The LLMs.txt Generator:

1. Crawls the provided website URL and its linked pages
2. Extracts clean, meaningful text content
3. Generates two formats:
   * `llms.txt`: Concise summaries and key information
   * `llms-full.txt`: Complete text content with more detail

### Example Usage

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  # Initialize the client
  firecrawl = FirecrawlApp(api_key="your_api_key")

  # Define generation parameters
  params = {
      "maxUrls": 2,  # Maximum URLs to analyze
      "showFullText": True  # Include full text in results
  }

  # Generate LLMs.txt with polling
  results = firecrawl.generate_llms_text(
      url="https://example.com",
      params=params
  )

  # Access generation results
  if results['success']:
      print(f"Status: {results['status']}")
      print(f"Generated Data: {results['data']}")
  else:
      print(f"Error: {results.get('error', 'Unknown error')}")
  ```

  ```js Node
  import FirecrawlApp from "firecrawl";

  // Initialize the client
  const firecrawl = new FirecrawlApp({ apiKey: "your_api_key" });

  // Define generation parameters
  const params = {
    maxUrls: 2, // Maximum URLs to analyze
    showFullText: true, // Include full text in results
  };

  // Generate LLMs.txt with polling
  const results = await firecrawl.generateLLMsText("https://example.com", params);

  // Access generation results
  if (results.success) {
    console.log(`Status: ${results.status}`);
    console.log(`Generated Data:`, results.data);
  } else {
    console.error(`Error: ${results.error || "Unknown error"}`);
  }
  ```

  ```bash cURL
  # Start LLMs.txt generation
  curl -X POST "https://api.firecrawl.dev/v1/llmstxt" \
    -H "Authorization: Bearer your_api_key" \
    -H "Content-Type: application/json" \
    -d '{
      "url": "https://example.com",
      "maxUrls": 2,
      "showFullText": true
    }'

  # Check generation status
  curl -X GET "https://api.firecrawl.dev/v1/llmstxt/job_id" \
    -H "Authorization: Bearer your_api_key"
  ```
</CodeGroup>

**Key Parameters:**

* **url**: The website URL to generate LLMs.txt files from
* **maxUrls** (Optional): Maximum number of pages to crawl (1-100, default: 10)
* **showFullText** (Optional): Generate llms-full.txt in addition to llms.txt (default: false)

See [API Reference](/api-reference/endpoint/llmstxt) for more details.

## Checking Generation Status

LLMs.txt generation runs asynchronously. Make the aync call and monitor the status with:

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  # Initialize the client
  firecrawl = FirecrawlApp(api_key="your_api_key")

  # Create async job
  job = firecrawl.async_generate_llms_text(
      url="https://example.com",
  )

  if job['success']:
      job_id = job['id']

  # Check LLMs.txt generation status
  status = firecrawl.check_generate_llms_text_status("job_id")

  # Print current status
  print(f"Status: {status['status']}")

  if status['status'] == 'completed':
      print("LLMs.txt Content:", status['data']['llmstxt'])
      if 'llmsfulltxt' in status['data']:
          print("Full Text Content:", status['data']['llmsfulltxt'])
      print(f"Processed URLs: {len(status['data']['processedUrls'])}")
  ```

  ```js Node
  import FirecrawlApp from "firecrawl";

  // Initialize the client
  const firecrawl = new FirecrawlApp({ apiKey: "your_api_key" });

  // Create async job
  const job = await firecrawl.asyncGenerateLLMsText("https://example.com", {
    maxUrls: 50,
    showFullText: true
  });

  // Check LLMs.txt generation status
  const status = await firecrawl.checkGenerateLLMsTextStatus(job.jobId);

  // Print current status
  console.log(`Status: ${status.status}`);

  if (status.status === "completed") {
    console.log("LLMs.txt Content:", status.data.llmstxt);
    if (status.data.llmsfulltxt) {
      console.log("Full Text Content:", status.data.llmsfulltxt);
    }
    console.log(`Processed URLs: ${status.data.processedUrls.length}`);
  }
  ```

  ```bash
  curl "https://api.firecrawl.dev/v1/llmstxt/job_id" \
    -H "Authorization: Bearer your_api_key"
  ```
</CodeGroup>

### Status Examples

#### In Progress

```json
{
  "success": true,
  "data": {
    "llmstxt": "# Firecrawl.dev llms.txt\n\n- [Web Data Extraction Tool](https://www.firecrawl.dev/)...",
    "llmsfulltxt": "# Firecrawl.dev llms-full.txt\n\n"
  },
  "status": "processing",
  "expiresAt": "2025-03-03T23:19:18.000Z"
}
```

#### Completed

```json
{
  "success": true,
  "data": {
    "llmstxt": "# http://firecrawl.dev llms.txt\n\n- [Web Data Extraction Tool](https://www.firecrawl.dev/): Transform websites into clean, LLM-ready data effortlessly.\n- [Flexible Web Scraping Pricing](https://www.firecrawl.dev/pricing): Flexible pricing plans for web scraping and data extraction.\n- [Web Scraping and AI](https://www.firecrawl.dev/blog): Explore tutorials and articles on web scraping and AI...",
    "llmsfulltxt": "# http://firecrawl.dev llms-full.txt\n\n## Web Data Extraction Tool\nIntroducing /extract - Get web data with a prompt [Try now](https://www.firecrawl.dev/extract)\n\n[💥Get 2 months free with yearly plan](https://www.firecrawl.dev/pricing)..."
  },
  "status": "completed",
  "expiresAt": "2025-03-03T22:45:50.000Z"
}
```

## Known Limitations (Alpha)

1. **Access Restrictions**\
   Only publicly accessible pages can be processed. Login-protected or paywalled content is not supported.

2. **Site Size**\
   We are only are allowing processing for up to 5000 URLs during the alpha stage.

3. **Alpha State**\
   As an Alpha feature, the output format and processing may evolve based on feedback.

## Billing and Usage

Billing is based on the number of URLs processed:

* Base cost: 1 credit per URL processed
* Control URL costs with `maxUrls` parameter

Have feedback or need help? Email [help@firecrawl.dev](mailto:help@firecrawl.dev).


# Generate LLMs.txt with NPX
Source: https://docs.firecrawl.dev/features/alpha/llmstxt-npx

Generate LLMs.txt files from any website in CLI using our NPX package

## generate-llmstxt

A simple NPX package that generates LLMs.txt files in the CLI using the Firecrawl API. This package creates two files in your specified output directory (defaults to 'public' folder):

* `llms.txt`: Contains a summary of the LLM-related content
* `llms-full.txt`: Contains the full text content

## Usage

You can run this package using NPX without installing it. There are two ways to provide your Firecrawl API key:

### 1. Using Command Line Arguments

```bash
npx generate-llmstxt --api-key YOUR_FIRECRAWL_API_KEY
```

### 2. Using Environment Variables

Create a `.env` file in your project root and add your API key:

```env
FIRECRAWL_API_KEY=your_api_key_here
```

Then run the command without the --api-key option:

```bash
npx generate-llmstxt
```

### Options

* `-k, --api-key <key>` (optional if set in .env): Your Firecrawl API key
* `-u, --url <url>` (optional): URL to analyze (default: [https://example.com](https://example.com))
* `-m, --max-urls <number>` (optional): Maximum number of URLs to analyze (default: 50)
* `-o, --output-dir <path>` (optional): Output directory path (default: 'public')

### Examples

```bash
# Using command line argument with default output directory
npx generate-llmstxt -k your_api_key -u https://your-website.com -m 20

# Using .env file with default output directory
npx generate-llmstxt -u https://your-website.com -m 20

# Specifying a custom output directory
npx generate-llmstxt -k your_api_key -u https://your-website.com -o custom/path/to/output

# Using .env file and custom output directory
npx generate-llmstxt -u https://your-website.com -o content/llms
```

## Requirements

* Node.js 14 or higher
* A valid Firecrawl API key (via command line or .env file)

## Output

The package will create two files in your specified output directory (defaults to 'public'):

1. `llms.txt`: Contains a summary of the LLM-related content
2. `llms-full.txt`: Contains the full text content

## License

MIT


# Batch Scrape
Source: https://docs.firecrawl.dev/features/batch-scrape

Batch scrape multiple URLs

## Batch scraping multiple URLs

You can now batch scrape multiple URLs at the same time. It takes the starting URLs and optional parameters as arguments. The params argument allows you to specify additional options for the batch scrape job, such as the output formats.

### How it works

It is very similar to how the `/crawl` endpoint works. It submits a batch scrape job and returns a job ID to check the status of the batch scrape.

The sdk provides 2 methods, synchronous and asynchronous. The synchronous method will return the results of the batch scrape job, while the asynchronous method will return a job ID that you can use to check the status of the batch scrape.

### Usage

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

  # Scrape multiple websites:
  batch_scrape_result = app.batch_scrape_urls(['firecrawl.dev', 'mendable.ai'], {'formats': ['markdown', 'html']})
  print(batch_scrape_result)

  # Or, you can use the asynchronous method:
  batch_scrape_job = app.async_batch_scrape_urls(['firecrawl.dev', 'mendable.ai'], {'formats': ['markdown', 'html']})
  print(batch_scrape_job)

  # (async) You can then use the job ID to check the status of the batch scrape:
  batch_scrape_status = app.check_batch_scrape_status(batch_scrape_job['id'])
  print(batch_scrape_status)
  ```

  ```js Node
  import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';

  const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

  // Scrape multiple websites (synchronous):
  const batchScrapeResult = await app.batchScrapeUrls(['firecrawl.dev', 'mendable.ai'], { formats: ['markdown', 'html'] });

  if (!batchScrapeResult.success) {
    throw new Error(`Failed to scrape: ${batchScrapeResult.error}`)
  }
  // Output all the results of the batch scrape:
  console.log(batchScrapeResult)

  // Or, you can use the asynchronous method:
  const batchScrapeJob = await app.asyncBulkScrapeUrls(['firecrawl.dev', 'mendable.ai'], { formats: ['markdown', 'html'] });
  console.log(batchScrapeJob)

  // (async) You can then use the job ID to check the status of the batch scrape:
  const batchScrapeStatus = await app.checkBatchScrapeStatus(batchScrapeJob.id);
  console.log(batchScrapeStatus)
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/batch/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "urls": ["https://docs.firecrawl.dev", "https://docs.firecrawl.dev/sdks/overview"],
        "formats" : ["markdown", "html"]
      }'
  ```
</CodeGroup>

### Response

If you’re using the sync methods from the SDKs, it will return the results of the batch scrape job. Otherwise, it will return a job ID that you can use to check the status of the batch scrape.

#### Synchronous

```json Completed
{
  "status": "completed",
  "total": 36,
  "completed": 36,
  "creditsUsed": 36,
  "expiresAt": "2024-00-00T00:00:00.000Z",
  "next": "https://api.firecrawl.dev/v1/batch/scrape/123-456-789?skip=26",
  "data": [
    {
      "markdown": "[Firecrawl Docs home page![light logo](https://mintlify.s3-us-west-1.amazonaws.com/firecrawl/logo/light.svg)!...",
      "html": "<!DOCTYPE html><html lang=\"en\" class=\"js-focus-visible lg:[--scroll-mt:9.5rem]\" data-js-focus-visible=\"\">...",
      "metadata": {
        "title": "Build a 'Chat with website' using Groq Llama 3 | Firecrawl",
        "language": "en",
        "sourceURL": "https://docs.firecrawl.dev/learn/rag-llama3",
        "description": "Learn how to use Firecrawl, Groq Llama 3, and Langchain to build a 'Chat with your website' bot.",
        "ogLocaleAlternate": [],
        "statusCode": 200
      }
    },
    ...
  ]
}
```

#### Asynchronous

You can then use the job ID to check the status of the batch scrape by calling the `/batch/scrape/{id}` endpoint. This endpoint is meant to be used while the job is still running or right after it has completed **as batch scrape jobs expire after 24 hours**.

```json
{
  "success": true,
  "id": "123-456-789",
  "url": "https://api.firecrawl.dev/v1/batch/scrape/123-456-789"
}
```

## Batch scrape with extraction

You can also use the batch scrape endpoint to extract structured data from the pages. This is useful if you want to get the same structured data from a list of URLs.

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

  # Scrape multiple websites:
  batch_scrape_result = app.batch_scrape_urls(
      ['https://docs.firecrawl.dev', 'https://docs.firecrawl.dev/sdks/overview'], 
      {
          'formats': ['extract'],
          'extract': {
              'prompt': 'Extract the title and description from the page.',
              'schema': {
                  'type': 'object',
                  'properties': {
                      'title': {'type': 'string'},
                      'description': {'type': 'string'}
                  },
                  'required': ['title', 'description']
              }
          }
      }
  )
  print(batch_scrape_result)

  # Or, you can use the asynchronous method:
  batch_scrape_job = app.async_batch_scrape_urls(
      ['https://docs.firecrawl.dev', 'https://docs.firecrawl.dev/sdks/overview'], 
      {
          'formats': ['extract'],
          'extract': {
              'prompt': 'Extract the title and description from the page.',
              'schema': {
                  'type': 'object',
                  'properties': {
                      'title': {'type': 'string'},
                      'description': {'type': 'string'}
                  },
                  'required': ['title', 'description']
              }
          }
      }
  )
  print(batch_scrape_job)

  # (async) You can then use the job ID to check the status of the batch scrape:
  batch_scrape_status = app.check_batch_scrape_status(batch_scrape_job['id'])
  print(batch_scrape_status)
  ```

  ```js Node
  import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';

  const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

  // Define schema to extract contents into
  const schema = {
    type: "object",
    properties: {
      title: { type: "string" },
      description: { type: "string" }
    },
    required: ["title", "description"]
  };

  // Scrape multiple websites (synchronous):
  const batchScrapeResult = await app.batchScrapeUrls(['https://docs.firecrawl.dev', 'https://docs.firecrawl.dev/sdks/overview'], { 
    formats: ['extract'],
    extract: {
      prompt: "Extract the title and description from the page.",
      schema: schema
    }
  });

  if (!batchScrapeResult.success) {
    throw new Error(`Failed to scrape: ${batchScrapeResult.error}`)
  }
  // Output all the results of the batch scrape:
  console.log(batchScrapeResult)

  // Or, you can use the asynchronous method:
  const batchScrapeJob = await app.asyncBulkScrapeUrls(['https://docs.firecrawl.dev', 'https://docs.firecrawl.dev/sdks/overview'], { 
    formats: ['extract'],
    extract: {
      prompt: "Extract the title and description from the page.",
      schema: schema
    }
  });
  console.log(batchScrapeJob)

  // (async) You can then use the job ID to check the status of the batch scrape:
  const batchScrapeStatus = await app.checkBatchScrapeStatus(batchScrapeJob.id);
  console.log(batchScrapeStatus)
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/batch/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "urls": ["https://docs.firecrawl.dev", "https://docs.firecrawl.dev/sdks/overview"],
        "formats" : ["extract"],
        "prompt": "Extract the title and description from the page.",
        "schema": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "description": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "description"
          ]
        }
      }'
  ```
</CodeGroup>

### Response

#### Synchronous

```json Completed
{
  "status": "completed",
  "total": 36,
  "completed": 36,
  "creditsUsed": 36,
  "expiresAt": "2024-00-00T00:00:00.000Z",
  "next": "https://api.firecrawl.dev/v1/batch/scrape/123-456-789?skip=26",
  "data": [
    {
      "extract": {
        "title": "Build a 'Chat with website' using Groq Llama 3 | Firecrawl",
        "description": "Learn how to use Firecrawl, Groq Llama 3, and Langchain to build a 'Chat with your website' bot."
      }
    },
    ...
  ]
}
```

#### Asynchronous

```json
{
  "success": true,
  "id": "123-456-789",
  "url": "https://api.firecrawl.dev/v1/batch/scrape/123-456-789"
}
```


# Change Tracking
Source: https://docs.firecrawl.dev/features/change-tracking

Firecrawl can track changes between the current page and a previous version, and tell you if it updated or not

![Change Tracking](https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/images/launch-week/lw3d12.webp)

Change tracking allows you to monitor and detect changes in web content over time. This feature is available in both the JavaScript and Python SDKs.

## Overview

Change tracking enables you to:

* Detect if a webpage has changed since the last scrape
* View the specific changes between scrapes
* Get structured data about what has changed
* Control the visibility of changes

Using the `changeTracking` format, you can monitor changes on a website and receive information about:

* `previousScrapeAt`: The timestamp of the previous scrape that the current page is being compared against (`null` if no previous scrape)
* `changeStatus`: The result of the comparison between the two page versions
  * `new`: This page did not exist or was not discovered before (usually has a `null` `previousScrapeAt`)
  * `same`: This page's content has not changed since the last scrape
  * `changed`: This page's content has changed since the last scrape
  * `removed`: This page was removed since the last scrape
* `visibility`: The visibility of the current page/URL
  * `visible`: This page is visible, meaning that its URL was discovered through an organic route (through links on other visible pages or the sitemap)
  * `hidden`: This page is not visible, meaning it is still available on the web, but no longer discoverable via the sitemap or crawling the site. We can only identify invisible links if they had been visible, and captured, during a previous crawl or scrape

## JavaScript SDK

### Basic Usage

To use change tracking in the JavaScript SDK, include `'changeTracking'` in the formats array when scraping a URL:

```javascript
const app = new FirecrawlApp({ apiKey: 'your-api-key' });
const result = await app.scrapeUrl('https://example.com', {
  formats: ['markdown', 'changeTracking']
});

// Access change tracking data
console.log(result.changeTracking.changeStatus); // 'new', 'same', 'changed', or 'removed'
console.log(result.changeTracking.visibility); // 'visible' or 'hidden'
console.log(result.changeTracking.previousScrapeAt); // ISO timestamp of previous scrape
```

Example Response:

```json
{
  "url": "https://firecrawl.dev",
  "markdown": "# AI Agents for great customer experiences\n\nChatbots that delight your users...",
  "changeTracking": {
    "previousScrapeAt": "2025-04-10T12:00:00Z",
    "changeStatus": "changed",
    "visibility": "visible"
  }
}
```

### Advanced Options

You can configure change tracking with additional options:

```javascript
const result = await app.scrapeUrl('https://example.com', {
  formats: ['markdown', 'changeTracking'],
  changeTrackingOptions: {
    modes: ['git-diff', 'json'], // Enable specific change tracking modes
    schema: { 
      type: 'object', 
      properties: { 
        title: { type: 'string' },
        content: { type: 'string' }
      } 
    }, // Schema for structured JSON comparison
    prompt: 'Custom prompt for extraction' // Optional custom prompt
  }
});

// Access git-diff format changes
if (result.changeTracking.diff) {
  console.log(result.changeTracking.diff.text); // Git-style diff text
  console.log(result.changeTracking.diff.json); // Structured diff data
}

// Access JSON comparison changes
if (result.changeTracking.json) {
  console.log(result.changeTracking.json.title.previous); // Previous title
  console.log(result.changeTracking.json.title.current); // Current title
}
```

### Git-Diff Results Example:

```
 **April, 13 2025**
 
-**05:55:05 PM**
+**05:58:57 PM**

...
```

### JSON Comparison Results Example:

```json
{
  "time": { 
    "previous": "2025-04-13T17:54:32Z", 
    "current": "2025-04-13T17:55:05Z" 
  }
}
```

### TypeScript Interface

The change tracking feature includes the following TypeScript interfaces:

```typescript
interface FirecrawlDocument {
  // ... other properties
  changeTracking?: {
    previousScrapeAt: string | null;
    changeStatus: "new" | "same" | "changed" | "removed";
    visibility: "visible" | "hidden";
    diff?: {
      text: string;
      json: {
        files: Array<{
          from: string | null;
          to: string | null;
          chunks: Array<{
            content: string;
            changes: Array<{
              type: string;
              normal?: boolean;
              ln?: number;
              ln1?: number;
              ln2?: number;
              content: string;
            }>;
          }>;
        }>;
      };
    };
    json?: any;
  };
}

interface ScrapeParams {
  // ... other properties
  changeTrackingOptions?: {
    prompt?: string;
    schema?: any;
    modes?: ("json" | "git-diff")[];
  }
}
```

## Python SDK

### Basic Usage

To use change tracking in the Python SDK, include `'changeTracking'` in the formats list when scraping a URL:

```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key='your-api-key')
result = app.scrape_url('https://example.com', {
    'formats': ['markdown', 'changeTracking']
})

# Access change tracking data
print(result['changeTracking']['changeStatus'])  # 'new', 'same', 'changed', or 'removed'
print(result['changeTracking']['visibility'])  # 'visible' or 'hidden'
print(result['changeTracking']['previousScrapeAt'])  # ISO timestamp of previous scrape
```

### Advanced Options

You can configure change tracking with additional options:

```python
result = app.scrape_url('https://example.com', {
    'formats': ['markdown', 'changeTracking'],
    'changeTrackingOptions': {
        'modes': ['git-diff', 'json'],  # Enable specific change tracking modes
        'schema': {
            'type': 'object',
            'properties': {
                'title': {'type': 'string'},
                'content': {'type': 'string'}
            }
        },  # Schema for structured JSON comparison
        'prompt': 'Custom prompt for extraction'  # Optional custom prompt
    }
})

# Access git-diff format changes
if 'diff' in result['changeTracking']:
    print(result['changeTracking']['diff']['text'])  # Git-style diff text
    print(result['changeTracking']['diff']['json'])  # Structured diff data

# Access JSON comparison changes
if 'json' in result['changeTracking']:
    print(result['changeTracking']['json']['title']['previous'])  # Previous title
    print(result['changeTracking']['json']['title']['current'])  # Current title
```

### Python Data Model

The change tracking feature includes the following Python data model:

```python
class ChangeTrackingData(pydantic.BaseModel):
    """
    Data for the change tracking format.
    """
    previousScrapeAt: Optional[str] = None
    changeStatus: str  # "new" | "same" | "changed" | "removed"
    visibility: str  # "visible" | "hidden"
    diff: Optional[Dict[str, Any]] = None
    json: Optional[Any] = None
```

## Change Tracking Modes

The change tracking feature supports two modes:

### Git-Diff Mode

The `git-diff` mode provides a traditional diff format similar to Git's output. It shows line-by-line changes with additions and deletions marked.

Example output:

```
@@ -1,1 +1,1 @@
-old content
+new content
```

The structured JSON representation of the diff includes:

* `files`: Array of changed files (in web context, typically just one)
* `chunks`: Sections of changes within a file
* `changes`: Individual line changes with type (add, delete, normal)

### JSON Mode

The `json` mode provides a structured comparison of specific fields extracted from the content. This is useful for tracking changes in specific data points rather than the entire content.

Example output:

```json
{
  "title": {
    "previous": "Old Title",
    "current": "New Title"
  },
  "price": {
    "previous": "$19.99",
    "current": "$24.99"
  }
}
```

To use JSON mode, you need to provide a schema that defines the fields to extract and compare.

## Important Facts

Here are some important details to know when using the change tracking feature:

* **Comparison Method**: Scrapes are always compared via their markdown response.
  * The `markdown` format must also be specified when using the `changeTracking` format. Other formats may also be specified in addition.
  * The comparison algorithm is resistant to changes in whitespace and content order. iframe source URLs are currently ignored for resistance against captchas and antibots with randomized URLs.

* **Matching Previous Scrapes**: Previous scrapes to compare against are currently only matched on the source URL, the team ID, and the `markdown` format, and not on any other scrape or crawl options.
  * For an effective comparison, the input URL should be exactly the same as the previous request for the same content.
  * Crawling the same URLs with different `includePaths`/`excludePaths` will have inconsistencies when using `changeTracking`.
  * Scraping the same URLs with different `includeTags`/`excludeTags`/`onlyMainContent` will have inconsistencies when using `changeTracking`.
  * Compared pages will also be compared against previous scrapes that only have the `markdown` format without the `changeTracking` format.
  * Comparisons are scoped to your team. If you scrape a URL for the first time with your API key, its `changeStatus` will always be `new`, even if other Firecrawl users have scraped it before.

* **Beta Status**: While in Beta, it is recommended to monitor the `warning` field of the resulting document, and to handle the `changeTracking` object potentially missing from the response.
  * This may occur when the database lookup to find the previous scrape to compare against times out.

## Examples

### Basic Scrape Example

```json
// Request
{
    "url": "https://firecrawl.dev",
    "formats": ["markdown", "changeTracking"]
}

// Response
{
  "success": true,
  "data": {
    "markdown": "...",
    "metadata": {...},
    "changeTracking": {
      "previousScrapeAt": "2025-03-30T15:07:17.543071+00:00",
      "changeStatus": "same",
      "visibility": "visible"
    }
  }
}
```

### Crawl Example

```json
// Request
{
    "url": "https://firecrawl.dev",
    "scrapeOptions": {
        "formats": ["markdown", "changeTracking"]
    }
}
```

### Tracking Product Price Changes

```javascript
// JavaScript
const result = await app.scrapeUrl('https://example.com/product', {
  formats: ['markdown', 'changeTracking'],
  changeTrackingOptions: {
    modes: ['json'],
    schema: {
      type: 'object',
      properties: {
        price: { type: 'string' },
        availability: { type: 'string' }
      }
    }
  }
});

if (result.changeTracking.changeStatus === 'changed') {
  console.log(`Price changed from ${result.changeTracking.json.price.previous} to ${result.changeTracking.json.price.current}`);
}
```

```python
# Python
result = app.scrape_url('https://example.com/product', {
    'formats': ['markdown', 'changeTracking'],
    'changeTrackingOptions': {
        'modes': ['json'],
        'schema': {
            'type': 'object',
            'properties': {
                'price': {'type': 'string'},
                'availability': {'type': 'string'}
            }
        }
    }
})

if result['changeTracking']['changeStatus'] == 'changed':
    print(f"Price changed from {result['changeTracking']['json']['price']['previous']} to {result['changeTracking']['json']['price']['current']}")
```

### Monitoring Content Changes with Git-Diff

```javascript
// JavaScript
const result = await app.scrapeUrl('https://example.com/blog', {
  formats: ['markdown', 'changeTracking'],
  changeTrackingOptions: {
    modes: ['git-diff']
  }
});

if (result.changeTracking.changeStatus === 'changed') {
  console.log('Content changes:');
  console.log(result.changeTracking.diff.text);
}
```

```python
# Python
result = app.scrape_url('https://example.com/blog', {
    'formats': ['markdown', 'changeTracking'],
    'changeTrackingOptions': {
        'modes': ['git-diff']
    }
})

if result['changeTracking']['changeStatus'] == 'changed':
    print('Content changes:')
    print(result['changeTracking']['diff']['text'])
```

## Billing

The change tracking feature is currently in beta. Using the basic change tracking functionality and `git-diff` mode has no additional cost. However, if you use the `json` mode for structured data comparison, the page scrape will cost 5 credits per page.


# Change Tracking with Crawl
Source: https://docs.firecrawl.dev/features/change-tracking-crawl

Track changes across your entire website, including new, removed, and hidden pages

Change tracking becomes even more powerful when combined with crawling. While change tracking on individual pages shows you content changes, using it with crawl lets you monitor your entire website structure - showing new pages, removed pages, and pages that have become hidden.

## Basic Usage

To enable change tracking during a crawl, include it in the `formats` array of your `scrapeOptions`:

```typescript
// JavaScript/TypeScript
const app = new FirecrawlApp({ apiKey: 'your-api-key' });
const result = await app.crawl('https://example.com', {
  scrapeOptions: {
    formats: ['markdown', 'changeTracking']
  }
});
```

```python
# Python
app = FirecrawlApp(api_key='your-api-key')
result = app.crawl('https://firecrawl.dev', {
    'scrapeOptions': {
        'formats': ['markdown', 'changeTracking']
    }
})
```

```json
{
  "success": true,
  "status": "completed",
  "completed": 2,
  "total": 2,
  "creditsUsed": 2,
  "expiresAt": "2025-04-14T18:44:13.000Z",
  "data": [
    {
      "markdown": "# Turn websites into LLM-ready data\n\nPower your AI apps with clean data crawled from any website...",
      "metadata": {},
      "changeTracking": {
        "previousScrapeAt": "2025-04-10T12:00:00Z",
        "changeStatus": "changed",
        "visibility": "visible"
      }
    },
    {
      "markdown": "## Flexible Pricing\n\nStart for free, then scale as you grow...",
      "metadata": {},
      "changeTracking": {
        "previousScrapeAt": "2025-04-10T12:00:00Z",
        "changeStatus": "changed",
        "visibility": "visible"
      }
    }
  ]
}
```

## Understanding Change Status

When using change tracking with crawl, the `changeStatus` field becomes especially valuable:

* `new`: A page that didn't exist in your previous crawl
* `same`: A page that exists and hasn't changed since your last crawl
* `changed`: A page that exists but has been modified since your last crawl
* `removed`: A page that existed in your previous crawl but is no longer found

## Page Visibility

The `visibility` field helps you understand how pages are discovered:

* `visible`: The page is discoverable through links or the sitemap
* `hidden`: The page still exists but is no longer linked or in the sitemap

This is particularly useful for:

* Detecting orphaned content
* Finding pages accidentally removed from navigation
* Monitoring site structure changes
* Identifying content that should be re-linked or removed

## Full Diff Support

For detailed change tracking with diffs, you can use the same options as described in the [Change Tracking for Scrape](/features/change-tracking) documentation.


# Crawl
Source: https://docs.firecrawl.dev/features/crawl

Firecrawl can recursively search through a urls subdomains, and gather the content

Firecrawl thoroughly crawls websites, ensuring comprehensive data extraction while bypassing any web blocker mechanisms. Here's how it works:

1. **URL Analysis:**
   Begins with a specified URL, identifying links by looking at the sitemap and then crawling the website. If no sitemap is found, it will crawl the website following the links.

2. **Recursive Traversal:**
   Recursively follows each link to uncover all subpages.

3. **Content Scraping:**
   Gathers content from every visited page while handling any complexities like JavaScript rendering or rate limits.

4. **Result Compilation:**
   Converts collected data into clean markdown or structured output, perfect for LLM processing or any other task.

This method guarantees an exhaustive crawl and data collection from any starting URL.

## Crawling

### /crawl endpoint

Used to crawl a URL and all accessible subpages. This submits a crawl job and returns a job ID to check the status of the crawl.

<Warning>By default - Crawl will ignore sublinks of a page if they aren't children of the url you provide. So, the website.com/other-parent/blog-1 wouldn't be returned if you crawled website.com/blogs/. If you want website.com/other-parent/blog-1, use the `allowBackwardLinks` parameter</Warning>

### Installation

<CodeGroup>
  ```bash Python
  pip install firecrawl-py
  ```

  ```bash Node
  npm install @mendable/firecrawl-js
  ```

  ```bash Go
  go get github.com/mendableai/firecrawl-go
  ```

  ```yaml Rust
  # Add this to your Cargo.toml
  [dependencies]
  firecrawl = "^1.0"
  tokio = { version = "^1", features = ["full"] }
  ```
</CodeGroup>

### Usage

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

  # Crawl a website:
  crawl_status = app.crawl_url(
    'https://firecrawl.dev', 
    params={
      'limit': 100, 
      'scrapeOptions': {'formats': ['markdown', 'html']}
    },
    poll_interval=30
  )
  print(crawl_status)
  ```

  ```js Node
  import FirecrawlApp from '@mendable/firecrawl-js';

  const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

  const crawlResponse = await app.crawlUrl('https://firecrawl.dev', {
    limit: 100,
    scrapeOptions: {
      formats: ['markdown', 'html'],
    }
  })

  if (!crawlResponse.success) {
    throw new Error(`Failed to crawl: ${crawlResponse.error}`)
  }

  console.log(crawlResponse)
  ```

  ```go Go
  import (
  	"fmt"
  	"log"

  	"github.com/mendableai/firecrawl-go"
  )

  func main() {
  	// Initialize the FirecrawlApp with your API key
  	apiKey := "fc-YOUR_API_KEY"
  	apiUrl := "https://api.firecrawl.dev"
  	version := "v1"

  	app, err := firecrawl.NewFirecrawlApp(apiKey, apiUrl, version)
  	if err != nil {
  		log.Fatalf("Failed to initialize FirecrawlApp: %v", err)
  	}

  	// Crawl a website
  	crawlStatus, err := app.CrawlUrl("https://firecrawl.dev", map[string]any{
  		"limit": 100,
  		"scrapeOptions": map[string]any{
  			"formats": []string{"markdown", "html"},
  		},
  	})
  	if err != nil {
  		log.Fatalf("Failed to send crawl request: %v", err)
  	}

  	fmt.Println(crawlStatus) 
  }
  ```

  ```rust Rust
  use firecrawl::{crawl::{CrawlOptions, CrawlScrapeOptions, CrawlScrapeFormats}, FirecrawlApp};

  #[tokio::main]
  async fn main() {
      // Initialize the FirecrawlApp with the API key
      let app = FirecrawlApp::new("fc-YOUR_API_KEY").expect("Failed to initialize FirecrawlApp");

      // Crawl a website
      let crawl_options = CrawlOptions {
          scrape_options: CrawlScrapeOptions {
              formats: vec![ CrawlScrapeFormats::Markdown, CrawlScrapeFormats::HTML ].into(),
              ..Default::default()
          }.into(),
          limit: 100.into(),
          ..Default::default()
      };

      let crawl_result = app
          .crawl_url("https://mendable.ai", crawl_options)
          .await;

      match crawl_result {
          Ok(data) => println!("Crawl Result (used {} credits):\n{:#?}", data.credits_used, data.data),
          Err(e) => eprintln!("Crawl failed: {}", e),
      }
  }
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/crawl \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "url": "https://docs.firecrawl.dev",
        "limit": 100,
        "scrapeOptions": {
          "formats": ["markdown", "html"]
        }
      }'
  ```
</CodeGroup>

### Response

If you're using cURL or `async crawl` functions on SDKs, this will return an `ID` where you can use to check the status of the crawl.

```json
{
  "success": true,
  "id": "123-456-789",
  "url": "https://api.firecrawl.dev/v1/crawl/123-456-789"
}
```

### Check Crawl Job

Used to check the status of a crawl job and get its result.

<Note>This endpoint only works for crawls that are in progress or crawls that have completed recently. </Note>

<CodeGroup>
  ```python Python
  crawl_status = app.check_crawl_status("<crawl_id>")
  print(crawl_status)
  ```

  ```js Node
  const crawlResponse = await app.checkCrawlStatus("<crawl_id>");

  if (!crawlResponse.success) {
    throw new Error(`Failed to check crawl status: ${crawlResponse.error}`)
  }

  console.log(crawlResponse)
  ```

  ```go Go
  // Get crawl status
  crawlStatus, err := app.CheckCrawlStatus("<crawl_id>")

  if err != nil {
    log.Fatalf("Failed to get crawl status: %v", err)
  }

  fmt.Println(crawlStatus)
  ```

  ```rust Rust
  let crawl_status = app.check_crawl_status(crawl_id).await;

  match crawl_status {
      Ok(data) => println!("Crawl Status:\n{:#?}", data),
      Err(e) => eprintln!("Check crawl status failed: {}", e),
  }
  ```

  ```bash cURL
  curl -X GET https://api.firecrawl.dev/v1/crawl/<crawl_id> \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY'
  ```
</CodeGroup>

#### Response Handling

The response varies based on the crawl's status.

For not completed or large responses exceeding 10MB, a `next` URL parameter is provided. You must request this URL to retrieve the next 10MB of data. If the `next` parameter is absent, it indicates the end of the crawl data.

The skip parameter sets the maximum number of results returned for each chunk of results returned.

<Info>
  The skip and next parameter are only relavent when hitting the api directly. If you're using the SDK, we handle this for you and will return all the results at once.
</Info>

<CodeGroup>
  ```json Scraping
  {
    "status": "scraping",
    "total": 36,
    "completed": 10,
    "creditsUsed": 10,
    "expiresAt": "2024-00-00T00:00:00.000Z",
    "next": "https://api.firecrawl.dev/v1/crawl/123-456-789?skip=10",
    "data": [
      {
        "markdown": "[Firecrawl Docs home page![light logo](https://mintlify.s3-us-west-1.amazonaws.com/firecrawl/logo/light.svg)!...",
        "html": "<!DOCTYPE html><html lang=\"en\" class=\"js-focus-visible lg:[--scroll-mt:9.5rem]\" data-js-focus-visible=\"\">...",
        "metadata": {
          "title": "Build a 'Chat with website' using Groq Llama 3 | Firecrawl",
          "language": "en",
          "sourceURL": "https://docs.firecrawl.dev/learn/rag-llama3",
          "description": "Learn how to use Firecrawl, Groq Llama 3, and Langchain to build a 'Chat with your website' bot.",
          "ogLocaleAlternate": [],
          "statusCode": 200
        }
      },
      ...
    ]
  }
  ```

  ```json Completed
  {
    "status": "completed",
    "total": 36,
    "completed": 36,
    "creditsUsed": 36,
    "expiresAt": "2024-00-00T00:00:00.000Z",
    "next": "https://api.firecrawl.dev/v1/crawl/123-456-789?skip=26",
    "data": [
      {
        "markdown": "[Firecrawl Docs home page![light logo](https://mintlify.s3-us-west-1.amazonaws.com/firecrawl/logo/light.svg)!...",
        "html": "<!DOCTYPE html><html lang=\"en\" class=\"js-focus-visible lg:[--scroll-mt:9.5rem]\" data-js-focus-visible=\"\">...",
        "metadata": {
          "title": "Build a 'Chat with website' using Groq Llama 3 | Firecrawl",
          "language": "en",
          "sourceURL": "https://docs.firecrawl.dev/learn/rag-llama3",
          "description": "Learn how to use Firecrawl, Groq Llama 3, and Langchain to build a 'Chat with your website' bot.",
          "ogLocaleAlternate": [],
          "statusCode": 200
        }
      },
      ...
    ]
  }
  ```
</CodeGroup>

## Crawl WebSocket

Firecrawl's WebSocket-based method, `Crawl URL and Watch`, enables real-time data extraction and monitoring. Start a crawl with a URL and customize it with options like page limits, allowed domains, and output formats, ideal for immediate data processing needs.

<CodeGroup>
  ```python Python
  # inside an async function...
  nest_asyncio.apply()

  # Define event handlers
  def on_document(detail):
      print("DOC", detail)

  def on_error(detail):
      print("ERR", detail['error'])

  def on_done(detail):
      print("DONE", detail['status'])

      # Function to start the crawl and watch process
  async def start_crawl_and_watch():
      # Initiate the crawl job and get the watcher
      watcher = app.crawl_url_and_watch('firecrawl.dev', { 'excludePaths': ['blog/*'], 'limit': 5 })

      # Add event listeners
      watcher.add_event_listener("document", on_document)
      watcher.add_event_listener("error", on_error)
      watcher.add_event_listener("done", on_done)

      # Start the watcher
      await watcher.connect()

  # Run the event loop
  await start_crawl_and_watch()
  ```

  ```js Node
  const watch = await app.crawlUrlAndWatch('mendable.ai', { excludePaths: ['blog/*'], limit: 5});

  watch.addEventListener("document", doc => {
    console.log("DOC", doc.detail);
  });

  watch.addEventListener("error", err => {
    console.error("ERR", err.detail.error);
  });

  watch.addEventListener("done", state => {
    console.log("DONE", state.detail.status);
  });
  ```
</CodeGroup>

## Crawl Webhook

You can now pass a `webhook` parameter to the `/crawl` endpoint. This will send a POST request to the URL you specify when the crawl is started, updated and completed.

The webhook will now trigger for every page crawled and not just the whole result at the end.

```bash cURL
curl -X POST https://api.firecrawl.dev/v1/crawl \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
      "url": "https://docs.firecrawl.dev",
      "limit": 100,
      "webhook": "https://example.com/webhook"
    }'
```

### Webhook Events

There are now 4 types of events:

* `crawl.started` - Triggered when the crawl is started.
* `crawl.page` - Triggered for every page crawled.
* `crawl.completed` - Triggered when the crawl is completed to let you know it's done (Beta)\*\*
* `crawl.failed` - Triggered when the crawl fails.

### Webhook Response

* `success` - If the webhook was successful in crawling the page correctly.
* `type` - The type of event that occurred.
* `id` - The ID of the crawl.
* `data` - The data that was scraped (Array). This will only be non empty on `crawl.page` and will contain 1 item if the page was scraped successfully. The response is the same as the `/scrape` endpoint.
* `error` - If the webhook failed, this will contain the error message.

\*\*Beta consideration

* There is a very tiny chance that the `crawl.completed` event may be triggered while the final `crawl.page` events are still being processed. We're working on a fix for this.


# Extract
Source: https://docs.firecrawl.dev/features/extract

Extract structured data from pages using LLMs

## Introducing `/extract` (Open Beta)

The `/extract` endpoint simplifies collecting structured data from any number of URLs or entire domains. Provide a list of URLs, optionally with wildcards (e.g., `example.com/*`), and a prompt or schema describing the information you want. Firecrawl handles the details of crawling, parsing, and collating large or small datasets.

## Using `/extract`

You can extract structured data from one or multiple URLs, including wildcards:

* **Single Page**\
  Example: `https://firecrawl.dev/some-page`
* **Multiple Pages / Full Domain**\
  Example: `https://firecrawl.dev/*`

When you use `/*`, Firecrawl will automatically crawl and parse all URLs it can discover in that domain, then extract the requested data. This feature is experimental; email [help@firecrawl.dev](mailto:help@firecrawl.dev) if you have issues.

### Example Usage

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp
  from pydantic import BaseModel, Field

  # Initialize the FirecrawlApp with your API key
  app = FirecrawlApp(api_key='your_api_key')

  class ExtractSchema(BaseModel):
      company_mission: str
      supports_sso: bool
      is_open_source: bool
      is_in_yc: bool

  data = app.extract([
    'https://docs.firecrawl.dev/*', 
    'https://firecrawl.dev/', 
    'https://www.ycombinator.com/companies/'
  ], {
      'prompt': 'Extract the company mission, whether it supports SSO, whether it is open source, and whether it is in Y Combinator from the page.',
      'schema': ExtractSchema.model_json_schema(),
  })
  print(data)
  ```

  ```js Node
  import FirecrawlApp from "@mendable/firecrawl-js";
  import { z } from "zod";

  const app = new FirecrawlApp({
    apiKey: "fc-YOUR_API_KEY"
  });

  // Define schema to extract contents into
  const schema = z.object({
    company_mission: z.string(),
    supports_sso: z.boolean(),
    is_open_source: z.boolean(),
    is_in_yc: z.boolean()
  });

  const scrapeResult = await app.extract([
    'https://docs.firecrawl.dev/*', 
    'https://firecrawl.dev/', 
    'https://www.ycombinator.com/companies/'
  ], {
    prompt: "Extract the company mission, whether it supports SSO, whether it is open source, and whether it is in Y Combinator from the page.",
    schema: schema
  });

  if (!scrapeResult.success) {
    throw new Error(`Failed to scrape: ${scrapeResult.error}`)
  }

  console.log(scrapeResult.data);
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/extract \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "urls": [
          "https://firecrawl.dev/", 
          "https://docs.firecrawl.dev/", 
          "https://www.ycombinator.com/companies"
        ],
        "prompt": "Extract the company mission, whether it supports SSO, whether it is open source, and whether it is in Y Combinator from the page.",
        "schema": {
          "type": "object",
          "properties": {
            "company_mission": {
              "type": "string"
            },
            "supports_sso": {
              "type": "boolean"
            },
            "is_open_source": {
              "type": "boolean"
            },
            "is_in_yc": {
              "type": "boolean"
            }
          },
          "required": [
            "company_mission",
            "supports_sso",
            "is_open_source",
            "is_in_yc"
          ]
        }
      }'
  ```
</CodeGroup>

**Key Parameters:**

* **urls**: An array of one or more URLs. Supports wildcards (`/*`) for broader crawling.
* **prompt** (Optional unless no schema): A natural language prompt describing the data you want or specifying how you want that data structured.
* **schema** (Optional unless no prompt): A more rigid structure if you already know the JSON layout.
* **enableWebSearch** (Optional): When `true`, extraction can follow links outside the specified domain.

See [API Reference](https://docs.firecrawl.dev/api-reference/endpoint/extract) for more details.

### Response (sdks)

```json JSON
{
  "success": true,
  "data": {
    "company_mission": "Firecrawl is the easiest way to extract data from the web. Developers use us to reliably convert URLs into LLM-ready markdown or structured data with a single API call.",
    "supports_sso": false,
    "is_open_source": true,
    "is_in_yc": true
  }
}
```

## Asynchronous Extraction & Status Checking

When you submit an extraction job—either directly via the API or through the SDK's asynchronous methods—you'll receive a Job ID. You can use this ID to:

* Check Job Status: Send a request to the /extract/{ID} endpoint to see if the job is still running or has finished.
* Automatically Poll (Default SDK Behavior): If you use the default extract method (Python/Node), the SDK automatically polls this endpoint for you and returns the final results once the job completes.
* Manually Poll (Async SDK Methods): If you use the asynchronous methods—async\_extract (Python) or asyncExtract (Node)—the SDK immediately returns a Job ID that you can track. Use get\_extract\_status (Python) or getExtractStatus (Node) to check the job's progress on your own schedule.

<Note>
  This endpoint only works for jobs in progress or recently completed (within 24
  hours).
</Note>

Below are code examples for checking an extraction job's status using Python, Node.js, and cURL:

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  app = FirecrawlApp(
      api_key="fc-YOUR_API_KEY"
  )

  # Start an extraction job first
  extract_job = app.async_extract([
      'https://docs.firecrawl.dev/*', 
      'https://firecrawl.dev/'
  ], prompt="Extract the company mission and features from these pages.")

  # Get the status of the extraction job
  job_status = app.get_extract_status(extract_job.job_id)

  print(job_status)
  # Example output:
  # {
  #     "status": "completed",
  #     "progress": 100,
  #     "results": [{
  #         "url": "https://docs.firecrawl.dev",
  #         "data": { ... }
  #     }]
  # }
  ```

  ```js Node
  import FirecrawlApp from "@mendable/firecrawl-js";

  const app = new FirecrawlApp({
    apiKey: "fc-YOUR_API_KEY"
  });

  // Start an extraction job first
  const extractJob = await app.asyncExtract([
    'https://docs.firecrawl.dev/*', 
    'https://firecrawl.dev/'
  ], {
    prompt: "Extract the company mission and features from these pages."
  });

  // Get the status of the extraction job
  const jobStatus = await app.getExtractStatus(extractJob.jobId);

  console.log(jobStatus);
  // Example output:
  // {
  //   status: "completed",
  //   progress: 100,
  //   results: [{
  //     url: "https://docs.firecrawl.dev",
  //     data: { ... }
  //   }]
  // }
  ```

  ```bash cURL
  curl -X GET https://api.firecrawl.dev/v1/extract/<extract_id> \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY'
  ```
</CodeGroup>

### Possible States

* **completed**: The extraction finished successfully.
* **processing**: Firecrawl is still processing your request.
* **failed**: An error occurred; data was not fully extracted.
* **cancelled**: The job was cancelled by the user.

#### Pending Example

```json JSON
{
  "success": true,
  "data": [],
  "status": "processing",
  "expiresAt": "2025-01-08T20:58:12.000Z"
}
```

#### Completed Example

```json JSON
{
  "success": true,
  "data": {
      "company_mission": "Firecrawl is the easiest way to extract data from the web. Developers use us to reliably convert URLs into LLM-ready markdown or structured data with a single API call.",
      "supports_sso": false,
      "is_open_source": true,
      "is_in_yc": true
    },
  "status": "completed",
  "expiresAt": "2025-01-08T20:58:12.000Z"
}
```

## Extracting without a Schema

If you prefer not to define a strict structure, you can simply provide a `prompt`. The underlying model will choose a structure for you, which can be useful for more exploratory or flexible requests.

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  # Initialize the FirecrawlApp with your API key
  app = FirecrawlApp(api_key='your_api_key')

  data = app.extract([
    'https://docs.firecrawl.dev/',
    'https://firecrawl.dev/'
  ], {
    'prompt': "Extract Firecrawl's mission from the page."
  })
  print(data)
  ```

  ```js Node
  import FirecrawlApp from "@mendable/firecrawl-js";

  const app = new FirecrawlApp({
  apiKey: "fc-YOUR_API_KEY"
  });

  const scrapeResult = await app.extract([
  'https://docs.firecrawl.dev/',
  'https://firecrawl.dev/'
  ], {
  prompt: "Extract Firecrawl's mission from the page."
  });

  if (!scrapeResult.success) {
  throw new Error(`Failed to scrape: ${scrapeResult.error}`)
  }

  console.log(scrapeResult.data);
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/extract \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "urls": [
          "https://docs.firecrawl.dev/",
          "https://firecrawl.dev/"
        ],
        "prompt": "Extract Firecrawl'\''s mission from the page."
      }'
  ```
</CodeGroup>

```json JSON
{
  "success": true,
  "data": {
    "company_mission": "Turn websites into LLM-ready data. Power your AI apps with clean data crawled from any website."
  }
}
```

## Improving Results with Web Search

Setting `enableWebSearch = true` in your request will expand the crawl beyond the provided URL set. This can capture supporting or related information from linked pages.

Here's an example that extracts information about dash cams, enriching the results with data from related pages:

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  # Initialize the FirecrawlApp with your API key

  app = FirecrawlApp(api_key='your_api_key')

  data = app.extract([
  'https://nextbase.com/dash-cams/622gw-dash-cam'
  ], {
  'prompt': "Extract details about the best dash cams including prices, features, pros/cons and reviews.",
  'enableWebSearch': True # Enable web search for better context
  })
  print(data)
  ```

  ```js Node
  import FirecrawlApp from "@mendable/firecrawl-js";

  const app = new FirecrawlApp({
  apiKey: "fc-YOUR_API_KEY"
  });

  const scrapeResult = await app.extract([
  'https://nextbase.com/dash-cams/622gw-dash-cam'
  ], {
  prompt: "Extract details about the best dash cams including prices, features, pros/cons and reviews.",
  enableWebSearch: true // Enable web search for better context
  });

  if (!scrapeResult.success) {
  throw new Error(`Failed to scrape: ${scrapeResult.error}`)
  }

  console.log(scrapeResult.data);
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/extract \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "urls": ["https://nextbase.com/dash-cams/622gw-dash-cam"],
        "prompt": "Extract details about the best dash cams including prices, features, pros/cons, and reviews.",
        "enableWebSearch": true
      }'
  ```
</CodeGroup>

### Example Response with Web Search

```json JSON
{
  "success": true,
  "data": {
    "dash_cams": [
      {
        "name": "Nextbase 622GW",
        "price": "$399.99",
        "features": [
          "4K video recording",
          "Image stabilization",
          "Alexa built-in",
          "What3Words integration"
        ],
        /* Information below enriched with other websites like 
        https://www.techradar.com/best/best-dash-cam found 
        via enableWebSearch parameter */
        "pros": [
          "Excellent video quality",
          "Great night vision",
          "Built-in GPS"
        ],
        "cons": ["Premium price point", "App can be finicky"]
      }
    ],
  }

```

The response includes additional context gathered from related pages, providing more comprehensive and accurate information.

## Extracting without URLs

The `/extract` endpoint now supports extracting structured data using a prompt without needing specific URLs. This is useful for research or when exact URLs are unknown. Currently in Alpha.

<CodeGroup>
  ```python Python
  from pydantic import BaseModel

  class ExtractSchema(BaseModel):
      company_mission: str


  # Define the prompt for extraction
  prompt = 'Extract the company mission from Firecrawl\'s website.'

  # Perform the extraction
  scrape_result = app.extract(params={
      'prompt': prompt,
      'schema': ExtractSchema.model_json_schema(),
  })

  # Check if the extraction was successful
  if not scrape_result['success']:
      raise Exception(f"Failed to scrape: {scrape_result['error']}")

  # Print the extracted data
  print(scrape_result['data'])
  ```

  ```js Node
  import { z } from "zod";

  // Define schema to extract contents into
  const schema = z.object({
    company_mission: z.string(),
  });

  const scrapeResult = await app.extract([], {
    prompt: "Extract the company mission from Firecrawl's website.",
    schema: schema
  });

  if (!scrapeResult.success) {
    throw new Error(`Failed to scrape: ${scrapeResult.error}`)
  }

  console.log(scrapeResult.data);
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/extract \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "urls": [],
        "prompt": "Extract the company mission from the Firecrawl's website.",
        "schema": {
          "type": "object",
          "properties": {
            "company_mission": {
              "type": "string"
            }
          },
          "required": ["company_mission"]
        }
      }'
  ```
</CodeGroup>

## Known Limitations (Beta)

1. **Large-Scale Site Coverage**\
   Full coverage of massive sites (e.g., "all products on Amazon") in a single request is not yet supported.

2. **Complex Logical Queries**\
   Requests like "find every post from 2025" may not reliably return all expected data. More advanced query capabilities are in progress.

3. **Occasional Inconsistencies**\
   Results might differ across runs, particularly for very large or dynamic sites. Usually it captures core details, but some variation is possible.

4. **Beta State**\
   Since `/extract` is still in Beta, features and performance will continue to evolve. We welcome bug reports and feedback to help us improve.

## Billing and Usage Tracking

You can check our the pricing for /extract on the [Extract landing page pricing page](https://www.firecrawl.dev/extract#pricing) and monitor usage via the [Extract page on the dashboard](https://www.firecrawl.dev/app/extract).

Have feedback or need help? Email [help@firecrawl.dev](mailto:help@firecrawl.dev).


# LLM Extract
Source: https://docs.firecrawl.dev/features/llm-extract

Extract structured data from pages via LLMs

## Scrape and extract structured data with Firecrawl

{/* <Warning>Scrape LLM Extract will be deprecated in future versions. Please use the new [Extract](/features/extract) endpoint.</Warning> */}

Firecrawl leverages Large Language Models (LLMs) to efficiently extract structured data from web pages. Here's how:

1. **Schema Definition:**
   Define the URL to scrape and the desired data schema using JSON Schema (following OpenAI tool schema). This schema specifies the data structure you expect to extract from the page.

2. **Scrape Endpoint:**
   Pass the URL and the schema to the scrape endpoint. Documentation for this endpoint can be found here:
   [Scrape Endpoint Documentation](https://docs.firecrawl.dev/api-reference/endpoint/scrape)

3. **Structured Data Retrieval:**
   Receive the scraped data in the structured format defined by your schema. You can then use this data as needed in your application or for further processing.

This method streamlines data extraction, reducing manual handling and enhancing efficiency.

## Extract structured data

### /scrape (with extract) endpoint

Used to extract structured data from scraped pages.

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp
  from pydantic import BaseModel, Field

  # Initialize the FirecrawlApp with your API key
  app = FirecrawlApp(api_key='your_api_key')

  class ExtractSchema(BaseModel):
      company_mission: str
      supports_sso: bool
      is_open_source: bool
      is_in_yc: bool

  data = app.scrape_url('https://docs.firecrawl.dev/', {
      'formats': ['json'],
      'jsonOptions': {
          'schema': ExtractSchema.model_json_schema(),
      }
  })
  print(data["json"])
  ```

  ```js Node
  import FirecrawlApp from "@mendable/firecrawl-js";
  import { z } from "zod";

  const app = new FirecrawlApp({
    apiKey: "fc-YOUR_API_KEY"
  });

  // Define schema to extract contents into
  const schema = z.object({
    company_mission: z.string(),
    supports_sso: z.boolean(),
    is_open_source: z.boolean(),
    is_in_yc: z.boolean()
  });

  const scrapeResult = await app.scrapeUrl("https://docs.firecrawl.dev/", {
    formats: ["json"],
    jsonOptions: { schema: schema }
  });

  if (!scrapeResult.success) {
    throw new Error(`Failed to scrape: ${scrapeResult.error}`)
  }

  console.log(scrapeResult.extract);
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "url": "https://docs.firecrawl.dev/",
        "formats": ["json"],
        "jsonOptions": {
          "schema": {
            "type": "object",
            "properties": {
              "company_mission": {
                        "type": "string"
              },
              "supports_sso": {
                        "type": "boolean"
              },
              "is_open_source": {
                        "type": "boolean"
              },
              "is_in_yc": {
                        "type": "boolean"
              }
            },
            "required": [
              "company_mission",
              "supports_sso",
              "is_open_source",
              "is_in_yc"
            ]
          }
        }
      }'
  ```
</CodeGroup>

Output:

```json JSON
{
    "success": true,
    "data": {
      "json": {
        "company_mission": "Train a secure AI on your technical resources that answers customer and employee questions so your team doesn't have to",
        "supports_sso": true,
        "is_open_source": false,
        "is_in_yc": true
      },
      "metadata": {
        "title": "Mendable",
        "description": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
        "robots": "follow, index",
        "ogTitle": "Mendable",
        "ogDescription": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
        "ogUrl": "https://docs.firecrawl.dev/",
        "ogImage": "https://docs.firecrawl.dev/mendable_new_og1.png",
        "ogLocaleAlternate": [],
        "ogSiteName": "Mendable",
        "sourceURL": "https://docs.firecrawl.dev/"
      },
    }
}
```

### Extracting without schema (New)

You can now extract without a schema by just passing a `prompt` to the endpoint. The llm chooses the structure of the data.

<CodeGroup>
  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "url": "https://docs.firecrawl.dev/",
        "formats": ["json"],
        "jsonOptions": {
          "prompt": "Extract the company mission from the page."
        }
      }'
  ```
</CodeGroup>

Output:

```json JSON
{
    "success": true,
    "data": {
      "json": {
        "company_mission": "Train a secure AI on your technical resources that answers customer and employee questions so your team doesn't have to",
      },
      "metadata": {
        "title": "Mendable",
        "description": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
        "robots": "follow, index",
        "ogTitle": "Mendable",
        "ogDescription": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
        "ogUrl": "https://docs.firecrawl.dev/",
        "ogImage": "https://docs.firecrawl.dev/mendable_new_og1.png",
        "ogLocaleAlternate": [],
        "ogSiteName": "Mendable",
        "sourceURL": "https://docs.firecrawl.dev/"
      },
    }
}
```

### Extract object

The `extract` object accepts the following parameters:

* `schema`: The schema to use for the extraction.
* `systemPrompt`: The system prompt to use for the extraction.
* `prompt`: The prompt to use for the extraction without a schema.


# Map
Source: https://docs.firecrawl.dev/features/map

Input a website and get all the urls on the website - extremely fast

## Introducing /map

The easiest way to go from a single url to a map of the entire website. This is extremely useful for:

* When you need to prompt the end-user to choose which links to scrape
* Need to quickly know the links on a website
* Need to scrape pages of a website that are related to a specific topic (use the `search` parameter)
* Only need to scrape specific pages of a website

## Alpha Considerations

This endpoint prioritizes speed, so it may not capture all website links. We are working on improvements. Feedback and suggestions are very welcome.

## Mapping

### /map endpoint

Used to map a URL and get urls of the website. This returns most links present on the website.

### Installation

<CodeGroup>
  ```bash Python
  pip install firecrawl-py
  ```

  ```bash Node
  npm install @mendable/firecrawl-js
  ```

  ```bash Go
  go get github.com/mendableai/firecrawl-go
  ```

  ```yaml Rust
  # Add this to your Cargo.toml
  [dependencies]
  firecrawl = "^1.0"
  tokio = { version = "^1", features = ["full"] }
  ```
</CodeGroup>

### Usage

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

  # Map a website:
  map_result = app.map_url('https://firecrawl.dev')
  print(map_result)
  ```

  ```js Node
  import FirecrawlApp, { MapResponse } from '@mendable/firecrawl-js';

  const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

  const mapResult = await app.mapUrl('https://firecrawl.dev') as MapResponse;

  if (!mapResult.success) {
      throw new Error(`Failed to map: ${mapResult.error}`)
  }

  console.log(mapResult)
  ```

  ```go Go
  import (
  	"fmt"
  	"log"

  	"github.com/mendableai/firecrawl-go"
  )

  func main() {
  	// Initialize the FirecrawlApp with your API key
  	apiKey := "fc-YOUR_API_KEY"
  	apiUrl := "https://api.firecrawl.dev"
  	version := "v1"

  	app, err := firecrawl.NewFirecrawlApp(apiKey, apiUrl, version)
  	if err != nil {
  		log.Fatalf("Failed to initialize FirecrawlApp: %v", err)
  	}

  	// Map a website
  	mapResult, err := app.MapUrl("https://firecrawl.dev", nil)
  	if err != nil {
  		log.Fatalf("Failed to map URL: %v", err)
  	}

  	fmt.Println(mapResult)
  }
  ```

  ```rust Rust
  use firecrawl::FirecrawlApp;

  #[tokio::main]
  async fn main() {
      // Initialize the FirecrawlApp with the API key
      let app = FirecrawlApp::new("fc-YOUR_API_KEY").expect("Failed to initialize FirecrawlApp");

      let map_result = app.map_url("https://firecrawl.dev", None).await;

      match map_result {
          Ok(data) => println!("Mapped URLs: {:#?}", data),
          Err(e) => eprintln!("Map failed: {}", e),
      }
  }
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/map \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "url": "https://firecrawl.dev"
      }'
  ```
</CodeGroup>

### Response

SDKs will return the data object directly. cURL will return the payload exactly as shown below.

```json
{
  "status": "success",
  "links": [
    "https://firecrawl.dev",
    "https://www.firecrawl.dev/pricing",
    "https://www.firecrawl.dev/blog",
    "https://www.firecrawl.dev/playground",
    "https://www.firecrawl.dev/smart-crawl",
    ...
  ]
}
```

#### Map with search

Map with `search` param allows you to search for specific urls inside a website.

```bash cURL
curl -X POST https://api.firecrawl.dev/v1/map \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
      "url": "https://firecrawl.dev",
      "search": "docs"
    }'
```

Response will be an ordered list from the most relevant to the least relevant.

```json
{
  "status": "success",
  "links": [
    "https://docs.firecrawl.dev",
    "https://docs.firecrawl.dev/sdks/python",
    "https://docs.firecrawl.dev/learn/rag-llama3",
  ]
}
```


# Scrape
Source: https://docs.firecrawl.dev/features/scrape

Turn any url into clean data

Firecrawl converts web pages into markdown, ideal for LLM applications.

* It manages complexities: proxies, caching, rate limits, js-blocked content
* Handles dynamic content: dynamic websites, js-rendered sites, PDFs, images
* Outputs clean markdown, structured data, screenshots or html.

For details, see the [Scrape Endpoint API Reference](https://docs.firecrawl.dev/api-reference/endpoint/scrape).

## Scraping a URL with Firecrawl

### /scrape endpoint

Used to scrape a URL and get its content.

### Installation

<CodeGroup>
  ```bash Python
  pip install firecrawl-py
  ```

  ```bash Node
  npm install @mendable/firecrawl-js
  ```

  ```bash Go
  go get github.com/mendableai/firecrawl-go
  ```

  ```yaml Rust
  # Add this to your Cargo.toml
  [dependencies]
  firecrawl = "^1.0"
  tokio = { version = "^1", features = ["full"] }
  ```
</CodeGroup>

### Usage

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

  # Scrape a website:
  scrape_result = app.scrape_url('firecrawl.dev', params={'formats': ['markdown', 'html']})
  print(scrape_result)
  ```

  ```js Node
  import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';

  const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

  // Scrape a website:
  const scrapeResult = await app.scrapeUrl('firecrawl.dev', { formats: ['markdown', 'html'] }) as ScrapeResponse;

  if (!scrapeResult.success) {
    throw new Error(`Failed to scrape: ${scrapeResult.error}`)
  }

  console.log(scrapeResult)
  ```

  ```go Go
  import (
  	"fmt"
  	"log"

  	"github.com/mendableai/firecrawl-go"
  )

  func main() {
  	// Initialize the FirecrawlApp with your API key
  	apiKey := "fc-YOUR_API_KEY"
  	apiUrl := "https://api.firecrawl.dev"
  	version := "v1"

  	app, err := firecrawl.NewFirecrawlApp(apiKey, apiUrl, version)
  	if err != nil {
  		log.Fatalf("Failed to initialize FirecrawlApp: %v", err)
  	}

  	// Scrape a website
  	scrapeResult, err := app.ScrapeUrl("https://firecrawl.dev", map[string]any{
  		"formats": []string{"markdown", "html"},
  	})
  	if err != nil {
  		log.Fatalf("Failed to scrape URL: %v", err)
  	}

  	fmt.Println(scrapeResult)
  }
  ```

  ```rust Rust
  use firecrawl::{FirecrawlApp, scrape::{ScrapeOptions, ScrapeFormats}};

  #[tokio::main]
  async fn main() {
      // Initialize the FirecrawlApp with the API key
      let app = FirecrawlApp::new("fc-YOUR_API_KEY").expect("Failed to initialize FirecrawlApp");

      let options = ScrapeOptions {
          formats vec! [ ScrapeFormats::Markdown, ScrapeFormats::HTML ].into(),
          ..Default::default()
      };

      let scrape_result = app.scrape_url("https://firecrawl.dev", options).await;

      match scrape_result {
          Ok(data) => println!("Scrape Result:\n{}", data.markdown.unwrap()),
          Err(e) => eprintln!("Map failed: {}", e),
      }
  }
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "url": "https://docs.firecrawl.dev",
        "formats" : ["markdown", "html"]
      }'
  ```
</CodeGroup>

For more details about the parameters, refer to the [API Reference](https://docs.firecrawl.dev/api-reference/endpoint/scrape).

### Response

SDKs will return the data object directly. cURL will return the payload exactly as shown below.

```json
{
  "success": true,
  "data" : {
    "markdown": "Launch Week I is here! [See our Day 2 Release 🚀](https://www.firecrawl.dev/blog/launch-week-i-day-2-doubled-rate-limits)[💥 Get 2 months free...",
    "html": "<!DOCTYPE html><html lang=\"en\" class=\"light\" style=\"color-scheme: light;\"><body class=\"__variable_36bd41 __variable_d7dc5d font-inter ...",
    "metadata": {
      "title": "Home - Firecrawl",
      "description": "Firecrawl crawls and converts any website into clean markdown.",
      "language": "en",
      "keywords": "Firecrawl,Markdown,Data,Mendable,Langchain",
      "robots": "follow, index",
      "ogTitle": "Firecrawl",
      "ogDescription": "Turn any website into LLM-ready data.",
      "ogUrl": "https://www.firecrawl.dev/",
      "ogImage": "https://www.firecrawl.dev/og.png?123",
      "ogLocaleAlternate": [],
      "ogSiteName": "Firecrawl",
      "sourceURL": "https://firecrawl.dev",
      "statusCode": 200
    }
  }
}
```

## Scrape Formats

You can now choose what formats you want your output in. You can specify multiple output formats. Supported formats are:

* Markdown (markdown)
* HTML (html)
* Raw HTML (rawHtml) (with no modifications)
* Screenshot (screenshot or screenshot\@fullPage)
* Links (links)
* Extract (extract) - structured output

Output keys will match the format you choose.

## Extract structured data

### /scrape (with extract) endpoint

Used to extract structured data from scraped pages.

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp
  from pydantic import BaseModel, Field

  # Initialize the FirecrawlApp with your API key
  app = FirecrawlApp(api_key='your_api_key')

  class ExtractSchema(BaseModel):
      company_mission: str
      supports_sso: bool
      is_open_source: bool
      is_in_yc: bool

  data = app.scrape_url('https://docs.firecrawl.dev/', {
      'formats': ['json'],
      'jsonOptions': {
          'schema': ExtractSchema.model_json_schema(),
      }
  })
  print(data["json"])
  ```

  ```js Node
  import FirecrawlApp from "@mendable/firecrawl-js";
  import { z } from "zod";

  const app = new FirecrawlApp({
    apiKey: "fc-YOUR_API_KEY"
  });

  // Define schema to extract contents into
  const schema = z.object({
    company_mission: z.string(),
    supports_sso: z.boolean(),
    is_open_source: z.boolean(),
    is_in_yc: z.boolean()
  });

  const scrapeResult = await app.scrapeUrl("https://docs.firecrawl.dev/", {
    formats: ["json"],
    jsonOptions: { schema: schema }
  });

  if (!scrapeResult.success) {
    throw new Error(`Failed to scrape: ${scrapeResult.error}`)
  }

  console.log(scrapeResult.extract);
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "url": "https://docs.firecrawl.dev/",
        "formats": ["json"],
        "jsonOptions": {
          "schema": {
            "type": "object",
            "properties": {
              "company_mission": {
                        "type": "string"
              },
              "supports_sso": {
                        "type": "boolean"
              },
              "is_open_source": {
                        "type": "boolean"
              },
              "is_in_yc": {
                        "type": "boolean"
              }
            },
            "required": [
              "company_mission",
              "supports_sso",
              "is_open_source",
              "is_in_yc"
            ]
          }
        }
      }'
  ```
</CodeGroup>

Output:

```json JSON
{
    "success": true,
    "data": {
      "json": {
        "company_mission": "Train a secure AI on your technical resources that answers customer and employee questions so your team doesn't have to",
        "supports_sso": true,
        "is_open_source": false,
        "is_in_yc": true
      },
      "metadata": {
        "title": "Mendable",
        "description": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
        "robots": "follow, index",
        "ogTitle": "Mendable",
        "ogDescription": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
        "ogUrl": "https://docs.firecrawl.dev/",
        "ogImage": "https://docs.firecrawl.dev/mendable_new_og1.png",
        "ogLocaleAlternate": [],
        "ogSiteName": "Mendable",
        "sourceURL": "https://docs.firecrawl.dev/"
      },
    }
}
```

### Extracting without schema (New)

You can now extract without a schema by just passing a `prompt` to the endpoint. The llm chooses the structure of the data.

<CodeGroup>
  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "url": "https://docs.firecrawl.dev/",
        "formats": ["json"],
        "jsonOptions": {
          "prompt": "Extract the company mission from the page."
        }
      }'
  ```
</CodeGroup>

Output:

```json JSON
{
    "success": true,
    "data": {
      "json": {
        "company_mission": "Train a secure AI on your technical resources that answers customer and employee questions so your team doesn't have to",
      },
      "metadata": {
        "title": "Mendable",
        "description": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
        "robots": "follow, index",
        "ogTitle": "Mendable",
        "ogDescription": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
        "ogUrl": "https://docs.firecrawl.dev/",
        "ogImage": "https://docs.firecrawl.dev/mendable_new_og1.png",
        "ogLocaleAlternate": [],
        "ogSiteName": "Mendable",
        "sourceURL": "https://docs.firecrawl.dev/"
      },
    }
}
```

### Extract object

The `extract` object accepts the following parameters:

* `schema`: The schema to use for the extraction.
* `systemPrompt`: The system prompt to use for the extraction.
* `prompt`: The prompt to use for the extraction without a schema.

## Interacting with the page with Actions

Firecrawl allows you to perform various actions on a web page before scraping its content. This is particularly useful for interacting with dynamic content, navigating through pages, or accessing content that requires user interaction.

Here is an example of how to use actions to navigate to google.com, search for Firecrawl, click on the first result, and take a screenshot.

It is important to almost always use the `wait` action before/after executing other actions to give enough time for the page to load.

### Example

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

  # Scrape a website:
  scrape_result = app.scrape_url('firecrawl.dev', 
      params={
          'formats': ['markdown', 'html'], 
          'actions': [
              {"type": "wait", "milliseconds": 2000},
              {"type": "click", "selector": "textarea[title=\"Search\"]"},
              {"type": "wait", "milliseconds": 2000},
              {"type": "write", "text": "firecrawl"},
              {"type": "wait", "milliseconds": 2000},
              {"type": "press", "key": "ENTER"},
              {"type": "wait", "milliseconds": 3000},
              {"type": "click", "selector": "h3"},
              {"type": "wait", "milliseconds": 3000},
              {"type": "scrape"},
              {"type": "screenshot"}
          ]
      }
  )
  print(scrape_result)
  ```

  ```js Node
  import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';

  const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

  // Scrape a website:
  const scrapeResult = await app.scrapeUrl('firecrawl.dev', { formats: ['markdown', 'html'], actions: [
      { type: "wait", milliseconds: 2000 },
      { type: "click", selector: "textarea[title=\"Search\"]" },
      { type: "wait", milliseconds: 2000 },
      { type: "write", text: "firecrawl" },
      { type: "wait", milliseconds: 2000 },
      { type: "press", key: "ENTER" },
      { type: "wait", milliseconds: 3000 },
      { type: "click", selector: "h3" },
      { type: "scrape" },
      {"type": "screenshot"}
  ] }) as ScrapeResponse;

  if (!scrapeResult.success) {
    throw new Error(`Failed to scrape: ${scrapeResult.error}`)
  }

  console.log(scrapeResult)
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
          "url": "google.com",
          "formats": ["markdown"],
          "actions": [
              {"type": "wait", "milliseconds": 2000},
              {"type": "click", "selector": "textarea[title=\"Search\"]"},
              {"type": "wait", "milliseconds": 2000},
              {"type": "write", "text": "firecrawl"},
              {"type": "wait", "milliseconds": 2000},
              {"type": "press", "key": "ENTER"},
              {"type": "wait", "milliseconds": 3000},
              {"type": "click", "selector": "h3"},
              {"type": "wait", "milliseconds": 3000},
              {"type": "screenshot"}
          ]
      }'
  ```
</CodeGroup>

### Output

<CodeGroup>
  ```json JSON
  {
    "success": true,
    "data": {
      "markdown": "Our first Launch Week is over! [See the recap 🚀](blog/firecrawl-launch-week-1-recap)...",
      "actions": {
        "screenshots": [
          "https://alttmdsdujxrfnakrkyi.supabase.co/storage/v1/object/public/media/screenshot-75ef2d87-31e0-4349-a478-fb432a29e241.png"
        ],
        "scrapes": [
          {
            "url": "https://www.firecrawl.dev/",
            "html": "<html><body><h1>Firecrawl</h1></body></html>"
          }
        ]
      },
      "metadata": {
        "title": "Home - Firecrawl",
        "description": "Firecrawl crawls and converts any website into clean markdown.",
        "language": "en",
        "keywords": "Firecrawl,Markdown,Data,Mendable,Langchain",
        "robots": "follow, index",
        "ogTitle": "Firecrawl",
        "ogDescription": "Turn any website into LLM-ready data.",
        "ogUrl": "https://www.firecrawl.dev/",
        "ogImage": "https://www.firecrawl.dev/og.png?123",
        "ogLocaleAlternate": [],
        "ogSiteName": "Firecrawl",
        "sourceURL": "http://google.com",
        "statusCode": 200
      }
    }
  }
  ```
</CodeGroup>

For more details about the actions parameters, refer to the [API Reference](https://docs.firecrawl.dev/api-reference/endpoint/scrape).

## Location and Language

Specify country and preferred languages to get relevant content based on your target location and language preferences.

### How it works

When you specify the location settings, Firecrawl will use an appropriate proxy if available and emulate the corresponding language and timezone settings. By default, the location is set to 'US' if not specified.

### Usage

To use the location and language settings, include the `location` object in your request body with the following properties:

* `country`: ISO 3166-1 alpha-2 country code (e.g., 'US', 'AU', 'DE', 'JP'). Defaults to 'US'.
* `languages`: An array of preferred languages and locales for the request in order of priority. Defaults to the language of the specified location.

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

  # Scrape a website:
  scrape_result = app.scrape_url('airbnb.com', 
      params={
          'formats': ['markdown', 'html'], 
          'location': {
              'country': 'BR',
              'languages': ['pt-BR']
          }
      }
  )
  print(scrape_result)
  ```

  ````js Node
  import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';

  const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

  // Scrape a website:
  const scrapeResult = await app.scrapeUrl('airbnb.com', { formats: ['markdown', 'html'], location: {
      country: "BR",
      languages: ["pt-BR"]
  } }) as ScrapeResponse;

  if (!scrapeResult.success) {
    throw new Error(`Failed to scrape: ${scrapeResult.error}`)
  }

  console.log(scrapeResult)```
  ````

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
          "url": "airbnb.com",
          "formats": ["markdown"],
          "location": {
              "country": "BR",
              "languages": ["pt-BR"]
          }
      }'
  ```
</CodeGroup>

## Batch scraping multiple URLs

You can now batch scrape multiple URLs at the same time. It takes the starting URLs and optional parameters as arguments. The params argument allows you to specify additional options for the batch scrape job, such as the output formats.

### How it works

It is very similar to how the `/crawl` endpoint works. It submits a batch scrape job and returns a job ID to check the status of the batch scrape.

The sdk provides 2 methods, synchronous and asynchronous. The synchronous method will return the results of the batch scrape job, while the asynchronous method will return a job ID that you can use to check the status of the batch scrape.

### Usage

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

  # Scrape multiple websites:
  batch_scrape_result = app.batch_scrape_urls(['firecrawl.dev', 'mendable.ai'], {'formats': ['markdown', 'html']})
  print(batch_scrape_result)

  # Or, you can use the asynchronous method:
  batch_scrape_job = app.async_batch_scrape_urls(['firecrawl.dev', 'mendable.ai'], {'formats': ['markdown', 'html']})
  print(batch_scrape_job)

  # (async) You can then use the job ID to check the status of the batch scrape:
  batch_scrape_status = app.check_batch_scrape_status(batch_scrape_job['id'])
  print(batch_scrape_status)
  ```

  ```js Node
  import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';

  const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

  // Scrape multiple websites (synchronous):
  const batchScrapeResult = await app.batchScrapeUrls(['firecrawl.dev', 'mendable.ai'], { formats: ['markdown', 'html'] });

  if (!batchScrapeResult.success) {
    throw new Error(`Failed to scrape: ${batchScrapeResult.error}`)
  }
  // Output all the results of the batch scrape:
  console.log(batchScrapeResult)

  // Or, you can use the asynchronous method:
  const batchScrapeJob = await app.asyncBulkScrapeUrls(['firecrawl.dev', 'mendable.ai'], { formats: ['markdown', 'html'] });
  console.log(batchScrapeJob)

  // (async) You can then use the job ID to check the status of the batch scrape:
  const batchScrapeStatus = await app.checkBatchScrapeStatus(batchScrapeJob.id);
  console.log(batchScrapeStatus)
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/batch/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "urls": ["https://docs.firecrawl.dev", "https://docs.firecrawl.dev/sdks/overview"],
        "formats" : ["markdown", "html"]
      }'
  ```
</CodeGroup>

### Response

If you’re using the sync methods from the SDKs, it will return the results of the batch scrape job. Otherwise, it will return a job ID that you can use to check the status of the batch scrape.

#### Synchronous

```json Completed
{
  "status": "completed",
  "total": 36,
  "completed": 36,
  "creditsUsed": 36,
  "expiresAt": "2024-00-00T00:00:00.000Z",
  "next": "https://api.firecrawl.dev/v1/batch/scrape/123-456-789?skip=26",
  "data": [
    {
      "markdown": "[Firecrawl Docs home page![light logo](https://mintlify.s3-us-west-1.amazonaws.com/firecrawl/logo/light.svg)!...",
      "html": "<!DOCTYPE html><html lang=\"en\" class=\"js-focus-visible lg:[--scroll-mt:9.5rem]\" data-js-focus-visible=\"\">...",
      "metadata": {
        "title": "Build a 'Chat with website' using Groq Llama 3 | Firecrawl",
        "language": "en",
        "sourceURL": "https://docs.firecrawl.dev/learn/rag-llama3",
        "description": "Learn how to use Firecrawl, Groq Llama 3, and Langchain to build a 'Chat with your website' bot.",
        "ogLocaleAlternate": [],
        "statusCode": 200
      }
    },
    ...
  ]
}
```

#### Asynchronous

You can then use the job ID to check the status of the batch scrape by calling the `/batch/scrape/{id}` endpoint. This endpoint is meant to be used while the job is still running or right after it has completed **as batch scrape jobs expire after 24 hours**.

```json
{
  "success": true,
  "id": "123-456-789",
  "url": "https://api.firecrawl.dev/v1/batch/scrape/123-456-789"
}
```


# Integrations
Source: https://docs.firecrawl.dev/integrations

Firecrawl allows you to turn entire websites into LLM-ready markdown

<CardGroup cols={2}>
  <Card
    title="Langchain"
    icon={
    <img
      src="https://raw.githubusercontent.com/hellofirecrawl/docs/main/images/integrations/langchain.png"
      alt="Firecrawl Document Loader"
    />
  }
    href="integrations/langchain"
  >
    Check out Firecrawl Document Loader
  </Card>

  <Card
    title="LlamaIndex"
    icon={
    <img
      src="https://raw.githubusercontent.com/hellofirecrawl/docs/main/images/integrations/llamaindex.jpeg"
      alt="Firecrawl Reader"
    />
  }
    href="integrations/llamaindex"
  >
    Check out Firecrawl Reader
  </Card>

  <Card
    title="Dify"
    icon={
    <img
      src="https://raw.githubusercontent.com/hellofirecrawl/docs/main/images/integrations/dify.jpeg"
      alt="Dify"
    />
  }
    href="integrations/dify"
  >
    Extract structured data from web pages
  </Card>

  <Card
    title="Flowise"
    icon={
    <img
      src="https://raw.githubusercontent.com/hellofirecrawl/docs/main/images/integrations/flowise.png"
      alt="Flowise"
    />
  }
    href="integrations/flowise"
  >
    Sync data directly from websites
  </Card>

  <Card
    title="CrewAI"
    icon={
    <img
      src="https://raw.githubusercontent.com/hellofirecrawl/docs/main/images/integrations/crewai.png"
      alt="Crew AI"
    />
  }
    href="integrations/crewai"
  >
    Coordinate AI agents for web scraping tasks
  </Card>

  <Card
    title="Langflow"
    icon={
    <img
      src="https://raw.githubusercontent.com/hellofirecrawl/docs/main/images/integrations/langflow.webp"
      alt="Langflow"
    />
  }
    href="integrations/langflow"
  >
    Design visual web data pipelines
  </Card>

  <Card
    title="Camel AI"
    icon={
    <img
      src="https://raw.githubusercontent.com/hellofirecrawl/docs/main/images/integrations/camelai.jpg"
      alt="CamelAI"
    />
  }
    href="integrations/camelai"
  >
    Design visual web data pipelines
  </Card>

  <Card
    title="SourceSync.ai"
    icon={
    <img
      src="https://raw.githubusercontent.com/hellofirecrawl/docs/main/images/integrations/sourcesyncai.png"
      alt="SourceSync.ai"
    />
  }
    href="integrations/sourcesyncai"
  >
    Build RAG applications with web data
  </Card>
</CardGroup>


# Camel AI
Source: https://docs.firecrawl.dev/integrations/camelai

Firecrawl integrates with Camel AI as a data loader.

## Installation

```bash
pip install camel-ai

```

## Usage

With Camel AI and Firecrawl you can quickly build multi-agent systems than use data from the web.

### Using Firecrawl to Gather an Entire Website

```python
mock_app = MockFirecrawlApp.return_value
firecrawl = Firecrawl(
    api_key='FC_API_KEY', api_url='https://api.test.com'
)
url = 'https://example.com'
response = [{'markdown': 'Markdown content'}]
mock_app.crawl_url.return_value = respons
result = firecrawl.markdown_crawl(url)
```

### Using Firecrawl to Gather a Single Page

```python
mock_app = MockFirecrawlApp.return_value
firecrawl = Firecrawl(
    api_key='test_api_key', api_url='https://api.test.com'
)
url = 'https://example.com'
response = 'Scraped content'
mock_app.scrape_url.return_value = response

result = firecrawl.scrape(url)
```


# CrewAI
Source: https://docs.firecrawl.dev/integrations/crewai

Learn how to use Firecrawl with CrewAI

## Using Firecrawl with CrewAI

Firecrawl is integrated with [CrewAI, the framework for orchestrating AI agents](https://www.crewai.com/). This page introduces all of the Firecrawl tools added to the framework.

### Installing Firecrawl Tools inside of CrewAI

* Get an API key from your [firecrawl.dev dashboard](https://firecrawl.dev) and set it in environment variables (`FIRECRAWL_API_KEY`).
* Install the [Firecrawl SDK](https://github.com/mendableai/firecrawl) along with `crewai[tools]` package:

```
pip install firecrawl-py 'crewai[tools]'
```

## Tools

### FirecrawlCrawlWebsiteTool

#### Example

Utilize the FirecrawlScrapeFromWebsiteTool as follows to allow your agent to load websites:

```python
from crewai_tools import FirecrawlCrawlWebsiteTool

tool = FirecrawlCrawlWebsiteTool(url='firecrawl.dev')
```

#### Arguments

* `api_key`: Optional. Specifies Firecrawl API key. Defaults is the `FIRECRAWL_API_KEY` environment variable.
* `url`: The base URL to start crawling from.
* `page_options`: Optional.
  * `onlyMainContent`: Optional. Only return the main content of the page excluding headers, navs, footers, etc.
  * `includeHtml`: Optional. Include the raw HTML content of the page. Will output a html key in the response.
* `crawler_options`: Optional. Options for controlling the crawling behavior.
  * `includes`: Optional. URL patterns to include in the crawl.
  * `exclude`: Optional. URL patterns to exclude from the crawl.
  * `generateImgAltText`: Optional. Generate alt text for images using LLMs (requires a paid plan).
  * `returnOnlyUrls`: Optional. If true, returns only the URLs as a list in the crawl status. Note: the response will be a list of URLs inside the data, not a list of documents.
  * `maxDepth`: Optional. Maximum depth to crawl. Depth 1 is the base URL, depth 2 includes the base URL and its direct children, and so on.
  * `mode`: Optional. The crawling mode to use. Fast mode crawls 4x faster on websites without a sitemap but may not be as accurate and shouldn't be used on heavily JavaScript-rendered websites.
  * `limit`: Optional. Maximum number of pages to crawl.
  * `timeout`: Optional. Timeout in milliseconds for the crawling operation.

### FirecrawlScrapeWebsiteTool

#### Example

Utilize the FirecrawlScrapeWebsiteTool as follows to allow your agent to load websites:

```python
from crewai_tools import FirecrawlScrapeWebsiteTool

tool = FirecrawlScrapeWebsiteTool(url='firecrawl.dev')
```

#### Arguments

* `api_key`: Optional. Specifies Firecrawl API key. Defaults is the `FIRECRAWL_API_KEY` environment variable.
* `url`: The URL to scrape.
* `page_options`: Optional.
  * `onlyMainContent`: Optional. Only return the main content of the page excluding headers, navs, footers, etc.
  * `includeHtml`: Optional. Include the raw HTML content of the page. Will output a html key in the response.
* `extractor_options`: Optional. Options for LLM-based extraction of structured information from the page content
  * `mode`: The extraction mode to use, currently supports 'llm-extraction'
  * `extractionPrompt`: Optional. A prompt describing what information to extract from the page
  * `extractionSchema`: Optional. The schema for the data to be extracted
* `timeout`: Optional. Timeout in milliseconds for the request

### FirecrawlSearchTool

#### Example

Utilize the FirecrawlSearchTool as follows to allow your agent to load websites:

```python
from crewai_tools import FirecrawlSearchTool

tool = FirecrawlSearchTool(query='what is firecrawl?')
```

#### Arguments

* `api_key`: Optional. Specifies Firecrawl API key. Defaults is the `FIRECRAWL_API_KEY` environment variable.
* `query`: The search query string to be used for searching.
* `page_options`: Optional. Options for result formatting.
  * `onlyMainContent`: Optional. Only return the main content of the page excluding headers, navs, footers, etc.
  * `includeHtml`: Optional. Include the raw HTML content of the page. Will output a html key in the response.
  * `fetchPageContent`: Optional. Fetch the full content of the page.
* `search_options`: Optional. Options for controlling the crawling behavior.
  * `limit`: Optional. Maximum number of pages to crawl.


# Dify
Source: https://docs.firecrawl.dev/integrations/dify

Learn how to use Firecrawl on Dify

## Sync Data from Websites for Dify workflows

Firecrawl can be used inside of [Dify the LLM workflow builder](https://cloud.dify.ai/). This page introduces how to scrape data from a web page, parse it into Markdown, and import it into the Dify knowledge base using their Firecrawl integration.

### Configuring Firecrawl

First, you need to configure Firecrawl credentials in the Data Source section of the Settings page.

<img className="block" src="https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/images/fc_dify_config.avif" alt="Configure Firecrawl key" />

Log in to your Firecrawl account and get your API Key, and then enter and save it in Dify.

<img className="block" src="https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/images/fc_dify_savekey.png" alt="Save Firecrawl key" />

### Scrape target webpage

Now comes the fun part, scraping and crawling. On the knowledge base creation page, select Sync from website and enter the URL to be scraped.

<img className="block" src="https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/images/fc_dify_webscrape.webp" alt="Scraping setup" />

The configuration options include: Whether to crawl sub-pages, Page crawling limit, Page scraping max depth, Excluded paths, Include only paths, and Content extraction scope. After completing the configuration, click Run to preview the parsed pages.

<img className="block" src="https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/images/fc_dify_fcoptions.webp" alt="Set Firecrawl configuration" />

### Review import results

After importing the parsed text from the webpage, it is stored in the knowledge base documents. View the import results and click Add URL to continue importing new web pages.

<img className="block" src="https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/images/fc_dify_results.webp" alt="See results of the Firecrawl scrape" />


# Flowise
Source: https://docs.firecrawl.dev/integrations/flowise

Learn how to use Firecrawl on Flowise

## Sync web data in Flowise workflows

Firecrawl can be used inside of [Flowise the Chatflow builder](https://flowiseai.com/). This page introduces how to configure and use a Firecrawl block inside of Flowise.

<img className="block" src="https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/images/fc_flowise_block.png" alt="Firecrawl Flowise block" />

### Crawling with Firecrawl blocks

1. Log in to your Firecrawl account and get your API Key, and then enter it on the block.
2. (Optional) Connect Text Splitter.
3. Select the crawl mode to pick up a crawl pages below the target url.
4. Input target URL to be crawled.
5. Use the resulting documents in your workflows.

### Scraping with Firecrawl blocks

1. Log in to your Firecrawl account and get your API Key, and then enter it on the block.
2. (Optional) Connect Text Splitter.
3. Select the scrape mode to pick up a single page.
4. Input target URL to be scraped.
5. Use the resulting documents in your workflows.


# Langchain
Source: https://docs.firecrawl.dev/integrations/langchain

Firecrawl integrates with Langchain as a document loader.

> Note: this integration is still using [v0 version of the Firecrawl API](/v0/introduction). You can install the 0.0.20 version for the Python SDK or the 0.0.36 for the Node SDK.

## Installation

```bash
pip install firecrawl-py==0.0.20
```

## Usage

You will need to get your own API key. See [https://firecrawl.dev](https://firecrawl.dev)

```python
from langchain_community.document_loaders import FireCrawlLoader

loader = FireCrawlLoader(
    api_key="YOUR_API_KEY", url="https://firecrawl.dev", mode="crawl"
)

docs = loader.load()
```

### Modes

Scrape: Scrape single url and return the markdown.
Crawl: Crawl the url and all accessible sub pages and return the markdown for each one.

```python
loader = FireCrawlLoader(
    api_key="YOUR_API_KEY",
    url="https://firecrawl.dev",
    mode="scrape",
)

data = loader.load()
```

### Crawler Options

You can also pass params to the loader. This is a dictionary of options to pass to the crawler. See the FireCrawl API documentation for more information.

## Langchain JS

To use it in Langchain JS, you can install it via npm:

```bash
npm install @mendableai/firecrawl-js
```

Then, you can use it like this:

```typescript
import { FireCrawlLoader } from "langchain/document_loaders/web/firecrawl";

const loader = new FireCrawlLoader({
  url: "https://firecrawl.dev", // The URL to scrape
  apiKey: process.env.FIRECRAWL_API_KEY, // Optional, defaults to `FIRECRAWL_API_KEY` in your env.
  mode: "scrape", // The mode to run the crawler in. Can be "scrape" for single urls or "crawl" for all accessible subpages
  params: {
    // optional parameters based on Firecrawl API docs
    // For API documentation, visit https://docs.firecrawl.dev
  },
});

const docs = await loader.load();
```


# Langflow
Source: https://docs.firecrawl.dev/integrations/langflow

Learn how to use Firecrawl on Langflow

## Sync web data in Langflow workflows

Firecrawl can be used inside of [Langflow, the AI workflow builder](https://www.langflow.org/). This page introduces how to configure and use a Firecrawl block inside of Langflow.

<img className="block" src="https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/images/fc_langflow_block.png" alt="Firecrawl Langflow block" />

### Scraping with Firecrawl blocks

1. Log in to your Firecrawl account and get your API Key, and then enter it on the block or pass it in from another part of the workflow.
2. (Optional) Connect Text Splitter.
3. Select the scrape mode to pick up a single page.
4. Input target URL to be scraped or pass it in from another part of the workflow.
5. Set up any Page Options and Extractor Options depending on what website and data you are trying to get. You can also pass these in from another part of the workflow.
6. Use the data in your workflows.


# Llamaindex
Source: https://docs.firecrawl.dev/integrations/llamaindex

Firecrawl integrates with LlamaIndex as a document reader.

> Note: this integration is still using [v0 version of the Firecrawl API](/v0/introduction). You can install the 0.0.20 version for the Python SDK or the 0.0.36 for the Node SDK.

## Installation

```bash
pip install firecrawl-py==0.0.20 llama_index llama-index llama-index-readers-web

```

## Usage

### Using FireCrawl to Gather an Entire Website

```python
from llama_index.readers.web import FireCrawlWebReader
from llama_index.core import SummaryIndex
import os


# Initialize FireCrawlWebReader to crawl a website
firecrawl_reader = FireCrawlWebReader(
    api_key="<your_api_key>",  # Replace with your actual API key from https://www.firecrawl.dev/
    mode="scrape",  # Choose between "crawl" and "scrape" for single page scraping
    params={"additional": "parameters"}  # Optional additional parameters
)

# Set the environment variable for the virtual key
os.environ["OPENAI_API_KEY"] = "<OPENAI_API_KEY>"

# Load documents from a single page URL
documents = firecrawl_reader.load_data(url="http://paulgraham.com/")
index = SummaryIndex.from_documents(documents)

# Set Logging to DEBUG for more detailed outputs
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")
display(Markdown(f"<b>{response}</b>"))
```

### Using FireCrawl to Gather a Single Page

```python
from llama_index.readers.web import FireCrawlWebReader

# Initialize the FireCrawlWebReader with your API key and desired mode
firecrawl_reader = FireCrawlWebReader(
    api_key="<your_api_key>",  # Replace with your actual API key from https://www.firecrawl.dev/
    mode="scrape",  # Choose between "crawl" and "scrape"
    params={"additional": "parameters"}  # Optional additional parameters
)

# Load documents from a specified URL
documents = firecrawl_reader.load_data(url="http://paulgraham.com/worked.html")
index = SummaryIndex.from_documents(documents)

# Set Logging to DEBUG for more detailed outputs
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")
display(Markdown(f"<b>{response}</b>"))
```


# SourceSync.ai
Source: https://docs.firecrawl.dev/integrations/sourcesyncai

Firecrawl integrates with SourceSync.ai for web scraping capabilities.

[SourceSync.ai](https://sourcesync.ai) is a Retrieval Augmented Generation as a Service platform that helps you build AI applications with your own data. This guide explains how to use Firecrawl with SourceSync.ai for web scraping capabilities.

## Setup

1. First, obtain your Firecrawl API key from your [Firecrawl dashboard](https://www.firecrawl.dev/app)

2. Configure your SourceSync.ai namespace to use Firecrawl as the web scraping provider:

<CodeGroup>
  ```bash cURL
  curl -X PATCH https://api.sourcesync.ai/v1/namespaces/YOUR_NAMESPACE_ID \
    -H "Authorization: Bearer YOUR_SOURCE_SYNC_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "webScraperConfig": {
        "provider": "FIRECRAWL",
        "apiKey": "YOUR_FIRECRAWL_API_KEY"
      }
    }'
  ```

  ```javascript JavaScript
  const response = await fetch(
    'https://api.sourcesync.ai/v1/namespaces/YOUR_NAMESPACE_ID',
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${SOURCE_SYNC_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        webScraperConfig: {
          provider: 'FIRECRAWL',
          apiKey: 'YOUR_FIRECRAWL_API_KEY',
        },
      }),
    }
  )
  ```

  ```python Python
  import requests

  response = requests.patch(
      'https://api.sourcesync.ai/v1/namespaces/YOUR_NAMESPACE_ID',
      headers={
          'Authorization': f'Bearer {SOURCE_SYNC_API_KEY}',
          'Content-Type': 'application/json',
      },
      json={
          'webScraperConfig': {
              'provider': 'FIRECRAWL',
              'apiKey': 'YOUR_FIRECRAWL_API_KEY',
          },
      },
  )
  ```
</CodeGroup>

## Usage

Once configured, you can use SourceSync.ai's web scraping endpoints with Firecrawl's capabilities. Here are the main ingestion methods:

### URL List Ingestion

Scrape specific URLs:

<CodeGroup>
  ```bash cURL
  curl -X POST https://api.sourcesync.ai/v1/ingest/urls \
    -H "Authorization: Bearer YOUR_SOURCE_SYNC_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "namespaceId": "YOUR_NAMESPACE_ID",
      "ingestConfig": {
        "source": "URLS_LIST",
        "config": {
          "urls": [
            "https://example.com/page1",
            "https://example.com/page2"
          ],
          "scrapeOptions": {
            "includeSelectors": ["article", "main"],
            "excludeSelectors": [".navigation", ".footer"]
          }
        }
      }
    }'
  ```

  ```javascript JavaScript
  const response = await fetch('https://api.sourcesync.ai/v1/ingest/urls', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SOURCE_SYNC_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      namespaceId: 'YOUR_NAMESPACE_ID',
      ingestConfig: {
        source: 'URLS_LIST',
        config: {
          urls: ['https://example.com/page1', 'https://example.com/page2'],
          scrapeOptions: {
            includeSelectors: ['article', 'main'],
            excludeSelectors: ['.navigation', '.footer'],
          },
        },
      },
    }),
  })
  ```

  ```python Python
  response = requests.post(
      'https://api.sourcesync.ai/v1/ingest/urls',
      headers={
          'Authorization': f'Bearer {SOURCE_SYNC_API_KEY}',
          'Content-Type': 'application/json',
      },
      json={
          'namespaceId': 'YOUR_NAMESPACE_ID',
          'ingestConfig': {
              'source': 'URLS_LIST',
              'config': {
                  'urls': ['https://example.com/page1', 'https://example.com/page2'],
                  'scrapeOptions': {
                      'includeSelectors': ['article', 'main'],
                      'excludeSelectors': ['.navigation', '.footer'],
                  },
              },
          },
      },
  )
  ```
</CodeGroup>

### Website Crawling

Crawl an entire website with custom rules:

<CodeGroup>
  ```bash cURL
  curl -X POST https://api.sourcesync.ai/v1/ingest/website \
    -H "Authorization: Bearer YOUR_SOURCE_SYNC_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "namespaceId": "YOUR_NAMESPACE_ID",
      "ingestConfig": {
        "source": "WEBSITE",
        "config": {
          "url": "https://example.com",
          "maxDepth": 3,
          "maxLinks": 100,
          "includePaths": ["/docs", "/blog"],
          "excludePaths": ["/admin"],
          "scrapeOptions": {
            "includeSelectors": ["article", "main"],
            "excludeSelectors": [".navigation", ".footer"]
          }
        }
      }
    }'
  ```

  ```javascript JavaScript
  const response = await fetch('https://api.sourcesync.ai/v1/ingest/website', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SOURCE_SYNC_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      namespaceId: 'YOUR_NAMESPACE_ID',
      ingestConfig: {
        source: 'WEBSITE',
        config: {
          url: 'https://example.com',
          maxDepth: 3,
          maxLinks: 100,
          includePaths: ['/docs', '/blog'],
          excludePaths: ['/admin'],
          scrapeOptions: {
            includeSelectors: ['article', 'main'],
            excludeSelectors: ['.navigation', '.footer'],
          },
        },
      },
    }),
  })
  ```

  ```python Python
  response = requests.post(
      'https://api.sourcesync.ai/v1/ingest/website',
      headers={
          'Authorization': f'Bearer {SOURCE_SYNC_API_KEY}',
          'Content-Type': 'application/json',
      },
      json={
          'namespaceId': 'YOUR_NAMESPACE_ID',
          'ingestConfig': {
              'source': 'WEBSITE',
              'config': {
                  'url': 'https://example.com',
                  'maxDepth': 3,
                  'maxLinks': 100,
                  'includePaths': ['/docs', '/blog'],
                  'excludePaths': ['/admin'],
                  'scrapeOptions': {
                      'includeSelectors': ['article', 'main'],
                      'excludeSelectors': ['.navigation', '.footer'],
                  },
              },
          },
      },
  )
  ```
</CodeGroup>

### Sitemap Processing

Process all URLs from a sitemap:

<CodeGroup>
  ```bash cURL
  curl -X POST https://api.sourcesync.ai/v1/ingest/sitemap \
    -H "Authorization: Bearer YOUR_SOURCE_SYNC_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "namespaceId": "YOUR_NAMESPACE_ID",
      "ingestConfig": {
        "source": "SITEMAP",
        "config": {
          "url": "https://example.com/sitemap.xml",
          "scrapeOptions": {
            "includeSelectors": ["article", "main"],
            "excludeSelectors": [".navigation", ".footer"]
          }
        }
      }
    }'
  ```

  ```javascript JavaScript
  const response = await fetch('https://api.sourcesync.ai/v1/ingest/sitemap', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SOURCE_SYNC_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      namespaceId: 'YOUR_NAMESPACE_ID',
      ingestConfig: {
        source: 'SITEMAP',
        config: {
          url: 'https://example.com/sitemap.xml',
          scrapeOptions: {
            includeSelectors: ['article', 'main'],
            excludeSelectors: ['.navigation', '.footer'],
          },
        },
      },
    }),
  })
  ```

  ```python Python
  response = requests.post(
      'https://api.sourcesync.ai/v1/ingest/sitemap',
      headers={
          'Authorization': f'Bearer {SOURCE_SYNC_API_KEY}',
          'Content-Type': 'application/json',
      },
      json={
          'namespaceId': 'YOUR_NAMESPACE_ID',
          'ingestConfig': {
              'source': 'SITEMAP',
              'config': {
                  'url': 'https://example.com/sitemap.xml',
                  'scrapeOptions': {
                      'includeSelectors': ['article', 'main'],
                      'excludeSelectors': ['.navigation', '.footer'],
                  },
              },
          },
      },
  )
  ```
</CodeGroup>

## Features

When using Firecrawl with SourceSync.ai, you get access to:

* JavaScript rendering support
* Automatic rate limiting
* CSS selector-based content extraction
* Recursive crawling with depth control
* Sitemap processing

## Resources

* [SourceSync.ai Documentation](https://sourcesync.ai)
* [Web Scraping Guide](https://sourcesync.ai/web-scraping)
* [API Reference](https://sourcesync.ai/api-reference/data-ingestion#ingest-urls)

For additional support:

* Email: [support@sourcesync.ai](mailto:support@sourcesync.ai)
* Discord: [Join our community](https://discord.gg/Fx3GnFKnRT)


# Quickstart
Source: https://docs.firecrawl.dev/introduction

Firecrawl allows you to turn entire websites into LLM-ready markdown

<img className="block" src="https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/images/hero.png" alt="Hero Light" />

## Welcome to Firecrawl

[Firecrawl](https://firecrawl.dev?ref=github) is an API service that takes a URL, crawls it, and converts it into clean markdown. We crawl all accessible subpages and give you clean markdown for each. No sitemap required.

## How to use it?

We provide an easy to use API with our hosted version. You can find the playground and documentation [here](https://firecrawl.dev/playground). You can also self host the backend if you'd like.

Check out the following resources to get started:

* [x] **API**: [Documentation](https://docs.firecrawl.dev/api-reference/introduction)
* [x] **SDKs**: [Python](https://docs.firecrawl.dev/sdks/python), [Node](https://docs.firecrawl.dev/sdks/node), [Go](https://docs.firecrawl.dev/sdks/go), [Rust](https://docs.firecrawl.dev/sdks/rust)
* [x] **LLM Frameworks**: [Langchain (python)](https://python.langchain.com/docs/integrations/document_loaders/firecrawl/), [Langchain (js)](https://js.langchain.com/docs/integrations/document_loaders/web_loaders/firecrawl), [Llama Index](https://docs.llamaindex.ai/en/latest/examples/data_connectors/WebPageDemo/#using-firecrawl-reader), [Crew.ai](https://docs.crewai.com/), [Composio](https://composio.dev/tools/firecrawl/all), [PraisonAI](https://docs.praison.ai/firecrawl/), [Superinterface](https://superinterface.ai/docs/assistants/functions/firecrawl), [Vectorize](https://docs.vectorize.io/integrations/source-connectors/firecrawl)
* [x] **Low-code Frameworks**: [Dify](https://dify.ai/blog/dify-ai-blog-integrated-with-firecrawl), [Langflow](https://docs.langflow.org/), [Flowise AI](https://docs.flowiseai.com/integrations/langchain/document-loaders/firecrawl), [Cargo](https://docs.getcargo.io/integration/firecrawl), [Pipedream](https://pipedream.com/apps/firecrawl/)
* [x] **Others**: [Zapier](https://zapier.com/apps/firecrawl/integrations), [Pabbly Connect](https://www.pabbly.com/connect/integrations/firecrawl/)
* [ ] Want an SDK or Integration? Let us know by opening an issue.

**Self-host:** To self-host refer to guide [here](/contributing/self-host).

### API Key

To use the API, you need to sign up on [Firecrawl](https://firecrawl.dev) and get an API key.

### Features

* [**Scrape**](#scraping): scrapes a URL and get its content in LLM-ready format (markdown, structured data via [LLM Extract](#extraction), screenshot, html)
* [**Crawl**](#crawling): scrapes all the URLs of a web page and return content in LLM-ready format
* [**Map**](/features/map): input a website and get all the website urls - extremely fast
* [**Extract**](/features/extract): get structured data from single page, multiple pages or entire websites with AI.

### Powerful Capabilities

* **LLM-ready formats**: markdown, structured data, screenshot, HTML, links, metadata
* **The hard stuff**: proxies, anti-bot mechanisms, dynamic content (js-rendered), output parsing, orchestration
* **Customizability**: exclude tags, crawl behind auth walls with custom headers, max crawl depth, etc...
* **Media parsing**: pdfs, docx, images.
* **Reliability first**: designed to get the data you need - no matter how hard it is.
* **Actions**: click, scroll, input, wait and more before extracting data

You can find all of Firecrawl's capabilities and how to use them in our [documentation](https://docs.firecrawl.dev)

## Crawling

Used to crawl a URL and all accessible subpages. This submits a crawl job and returns a job ID to check the status of the crawl.

### Installation

<CodeGroup>
  ```bash Python
  pip install firecrawl-py
  ```

  ```bash Node
  npm install @mendable/firecrawl-js
  ```

  ```bash Go
  go get github.com/mendableai/firecrawl-go
  ```

  ```yaml Rust
  # Add this to your Cargo.toml
  [dependencies]
  firecrawl = "^1.0"
  tokio = { version = "^1", features = ["full"] }
  ```
</CodeGroup>

### Usage

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

  # Crawl a website:
  crawl_status = app.crawl_url(
    'https://firecrawl.dev', 
    params={
      'limit': 100, 
      'scrapeOptions': {'formats': ['markdown', 'html']}
    },
    poll_interval=30
  )
  print(crawl_status)
  ```

  ```js Node
  import FirecrawlApp from '@mendable/firecrawl-js';

  const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

  const crawlResponse = await app.crawlUrl('https://firecrawl.dev', {
    limit: 100,
    scrapeOptions: {
      formats: ['markdown', 'html'],
    }
  })

  if (!crawlResponse.success) {
    throw new Error(`Failed to crawl: ${crawlResponse.error}`)
  }

  console.log(crawlResponse)
  ```

  ```go Go
  import (
  	"fmt"
  	"log"

  	"github.com/mendableai/firecrawl-go"
  )

  func main() {
  	// Initialize the FirecrawlApp with your API key
  	apiKey := "fc-YOUR_API_KEY"
  	apiUrl := "https://api.firecrawl.dev"
  	version := "v1"

  	app, err := firecrawl.NewFirecrawlApp(apiKey, apiUrl, version)
  	if err != nil {
  		log.Fatalf("Failed to initialize FirecrawlApp: %v", err)
  	}

  	// Crawl a website
  	crawlStatus, err := app.CrawlUrl("https://firecrawl.dev", map[string]any{
  		"limit": 100,
  		"scrapeOptions": map[string]any{
  			"formats": []string{"markdown", "html"},
  		},
  	})
  	if err != nil {
  		log.Fatalf("Failed to send crawl request: %v", err)
  	}

  	fmt.Println(crawlStatus) 
  }
  ```

  ```rust Rust
  use firecrawl::{crawl::{CrawlOptions, CrawlScrapeOptions, CrawlScrapeFormats}, FirecrawlApp};

  #[tokio::main]
  async fn main() {
      // Initialize the FirecrawlApp with the API key
      let app = FirecrawlApp::new("fc-YOUR_API_KEY").expect("Failed to initialize FirecrawlApp");

      // Crawl a website
      let crawl_options = CrawlOptions {
          scrape_options: CrawlScrapeOptions {
              formats: vec![ CrawlScrapeFormats::Markdown, CrawlScrapeFormats::HTML ].into(),
              ..Default::default()
          }.into(),
          limit: 100.into(),
          ..Default::default()
      };

      let crawl_result = app
          .crawl_url("https://mendable.ai", crawl_options)
          .await;

      match crawl_result {
          Ok(data) => println!("Crawl Result (used {} credits):\n{:#?}", data.credits_used, data.data),
          Err(e) => eprintln!("Crawl failed: {}", e),
      }
  }
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/crawl \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "url": "https://docs.firecrawl.dev",
        "limit": 100,
        "scrapeOptions": {
          "formats": ["markdown", "html"]
        }
      }'
  ```
</CodeGroup>

If you're using cURL or `async crawl` functions on SDKs, this will return an `ID` where you can use to check the status of the crawl.

```json
{
  "success": true,
  "id": "123-456-789",
  "url": "https://api.firecrawl.dev/v1/crawl/123-456-789"
}
```

### Check Crawl Job

Used to check the status of a crawl job and get its result.

<CodeGroup>
  ```python Python
  crawl_status = app.check_crawl_status("<crawl_id>")
  print(crawl_status)
  ```

  ```js Node
  const crawlResponse = await app.checkCrawlStatus("<crawl_id>");

  if (!crawlResponse.success) {
    throw new Error(`Failed to check crawl status: ${crawlResponse.error}`)
  }

  console.log(crawlResponse)
  ```

  ```go Go
  // Get crawl status
  crawlStatus, err := app.CheckCrawlStatus("<crawl_id>")

  if err != nil {
    log.Fatalf("Failed to get crawl status: %v", err)
  }

  fmt.Println(crawlStatus)
  ```

  ```rust Rust
  let crawl_status = app.check_crawl_status(crawl_id).await;

  match crawl_status {
      Ok(data) => println!("Crawl Status:\n{:#?}", data),
      Err(e) => eprintln!("Check crawl status failed: {}", e),
  }
  ```

  ```bash cURL
  curl -X GET https://api.firecrawl.dev/v1/crawl/<crawl_id> \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY'
  ```
</CodeGroup>

#### Response

The response will be different depending on the status of the crawl. For not completed or large responses exceeding 10MB, a `next` URL parameter is provided. You must request this URL to retrieve the next 10MB of data. If the `next` parameter is absent, it indicates the end of the crawl data.

<CodeGroup>
  ```json Scraping
  {
    "status": "scraping",
    "total": 36,
    "completed": 10,
    "creditsUsed": 10,
    "expiresAt": "2024-00-00T00:00:00.000Z",
    "next": "https://api.firecrawl.dev/v1/crawl/123-456-789?skip=10",
    "data": [
      {
        "markdown": "[Firecrawl Docs home page![light logo](https://mintlify.s3-us-west-1.amazonaws.com/firecrawl/logo/light.svg)!...",
        "html": "<!DOCTYPE html><html lang=\"en\" class=\"js-focus-visible lg:[--scroll-mt:9.5rem]\" data-js-focus-visible=\"\">...",
        "metadata": {
          "title": "Build a 'Chat with website' using Groq Llama 3 | Firecrawl",
          "language": "en",
          "sourceURL": "https://docs.firecrawl.dev/learn/rag-llama3",
          "description": "Learn how to use Firecrawl, Groq Llama 3, and Langchain to build a 'Chat with your website' bot.",
          "ogLocaleAlternate": [],
          "statusCode": 200
        }
      },
      ...
    ]
  }
  ```

  ```json Completed
  {
    "status": "completed",
    "total": 36,
    "completed": 36,
    "creditsUsed": 36,
    "expiresAt": "2024-00-00T00:00:00.000Z",
    "next": "https://api.firecrawl.dev/v1/crawl/123-456-789?skip=26",
    "data": [
      {
        "markdown": "[Firecrawl Docs home page![light logo](https://mintlify.s3-us-west-1.amazonaws.com/firecrawl/logo/light.svg)!...",
        "html": "<!DOCTYPE html><html lang=\"en\" class=\"js-focus-visible lg:[--scroll-mt:9.5rem]\" data-js-focus-visible=\"\">...",
        "metadata": {
          "title": "Build a 'Chat with website' using Groq Llama 3 | Firecrawl",
          "language": "en",
          "sourceURL": "https://docs.firecrawl.dev/learn/rag-llama3",
          "description": "Learn how to use Firecrawl, Groq Llama 3, and Langchain to build a 'Chat with your website' bot.",
          "ogLocaleAlternate": [],
          "statusCode": 200
        }
      },
      ...
    ]
  }
  ```
</CodeGroup>

## Scraping

To scrape a single URL, use the `scrape_url` method. It takes the URL as a parameter and returns the scraped data as a dictionary.

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

  # Scrape a website:
  scrape_result = app.scrape_url('firecrawl.dev', params={'formats': ['markdown', 'html']})
  print(scrape_result)
  ```

  ```js Node
  import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';

  const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

  // Scrape a website:
  const scrapeResult = await app.scrapeUrl('firecrawl.dev', { formats: ['markdown', 'html'] }) as ScrapeResponse;

  if (!scrapeResult.success) {
    throw new Error(`Failed to scrape: ${scrapeResult.error}`)
  }

  console.log(scrapeResult)
  ```

  ```go Go
  import (
  	"fmt"
  	"log"

  	"github.com/mendableai/firecrawl-go"
  )

  func main() {
  	// Initialize the FirecrawlApp with your API key
  	apiKey := "fc-YOUR_API_KEY"
  	apiUrl := "https://api.firecrawl.dev"
  	version := "v1"

  	app, err := firecrawl.NewFirecrawlApp(apiKey, apiUrl, version)
  	if err != nil {
  		log.Fatalf("Failed to initialize FirecrawlApp: %v", err)
  	}

  	// Scrape a website
  	scrapeResult, err := app.ScrapeUrl("https://firecrawl.dev", map[string]any{
  		"formats": []string{"markdown", "html"},
  	})
  	if err != nil {
  		log.Fatalf("Failed to scrape URL: %v", err)
  	}

  	fmt.Println(scrapeResult)
  }
  ```

  ```rust Rust
  use firecrawl::{FirecrawlApp, scrape::{ScrapeOptions, ScrapeFormats}};

  #[tokio::main]
  async fn main() {
      // Initialize the FirecrawlApp with the API key
      let app = FirecrawlApp::new("fc-YOUR_API_KEY").expect("Failed to initialize FirecrawlApp");

      let options = ScrapeOptions {
          formats vec! [ ScrapeFormats::Markdown, ScrapeFormats::HTML ].into(),
          ..Default::default()
      };

      let scrape_result = app.scrape_url("https://firecrawl.dev", options).await;

      match scrape_result {
          Ok(data) => println!("Scrape Result:\n{}", data.markdown.unwrap()),
          Err(e) => eprintln!("Map failed: {}", e),
      }
  }
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "url": "https://docs.firecrawl.dev",
        "formats" : ["markdown", "html"]
      }'
  ```
</CodeGroup>

### Response

SDKs will return the data object directly. cURL will return the payload exactly as shown below.

```json
{
  "success": true,
  "data" : {
    "markdown": "Launch Week I is here! [See our Day 2 Release 🚀](https://www.firecrawl.dev/blog/launch-week-i-day-2-doubled-rate-limits)[💥 Get 2 months free...",
    "html": "<!DOCTYPE html><html lang=\"en\" class=\"light\" style=\"color-scheme: light;\"><body class=\"__variable_36bd41 __variable_d7dc5d font-inter ...",
    "metadata": {
      "title": "Home - Firecrawl",
      "description": "Firecrawl crawls and converts any website into clean markdown.",
      "language": "en",
      "keywords": "Firecrawl,Markdown,Data,Mendable,Langchain",
      "robots": "follow, index",
      "ogTitle": "Firecrawl",
      "ogDescription": "Turn any website into LLM-ready data.",
      "ogUrl": "https://www.firecrawl.dev/",
      "ogImage": "https://www.firecrawl.dev/og.png?123",
      "ogLocaleAlternate": [],
      "ogSiteName": "Firecrawl",
      "sourceURL": "https://firecrawl.dev",
      "statusCode": 200
    }
  }
}
```

## Extraction

With LLM extraction, you can easily extract structured data from any URL. We support pydantic schemas to make it easier for you too. Here is how you to use it:

v1 is only supported on node, python and cURL at this time.

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp
  from pydantic import BaseModel, Field

  # Initialize the FirecrawlApp with your API key
  app = FirecrawlApp(api_key='your_api_key')

  class ExtractSchema(BaseModel):
      company_mission: str
      supports_sso: bool
      is_open_source: bool
      is_in_yc: bool

  data = app.scrape_url('https://docs.firecrawl.dev/', {
      'formats': ['json'],
      'jsonOptions': {
          'schema': ExtractSchema.model_json_schema(),
      }
  })
  print(data["json"])
  ```

  ```js Node
  import FirecrawlApp from "@mendable/firecrawl-js";
  import { z } from "zod";

  const app = new FirecrawlApp({
    apiKey: "fc-YOUR_API_KEY"
  });

  // Define schema to extract contents into
  const schema = z.object({
    company_mission: z.string(),
    supports_sso: z.boolean(),
    is_open_source: z.boolean(),
    is_in_yc: z.boolean()
  });

  const scrapeResult = await app.scrapeUrl("https://docs.firecrawl.dev/", {
    formats: ["json"],
    jsonOptions: { schema: schema }
  });

  if (!scrapeResult.success) {
    throw new Error(`Failed to scrape: ${scrapeResult.error}`)
  }

  console.log(scrapeResult.extract);
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "url": "https://docs.firecrawl.dev/",
        "formats": ["json"],
        "jsonOptions": {
          "schema": {
            "type": "object",
            "properties": {
              "company_mission": {
                        "type": "string"
              },
              "supports_sso": {
                        "type": "boolean"
              },
              "is_open_source": {
                        "type": "boolean"
              },
              "is_in_yc": {
                        "type": "boolean"
              }
            },
            "required": [
              "company_mission",
              "supports_sso",
              "is_open_source",
              "is_in_yc"
            ]
          }
        }
      }'
  ```
</CodeGroup>

Output:

```json JSON
{
    "success": true,
    "data": {
      "json": {
        "company_mission": "Train a secure AI on your technical resources that answers customer and employee questions so your team doesn't have to",
        "supports_sso": true,
        "is_open_source": false,
        "is_in_yc": true
      },
      "metadata": {
        "title": "Mendable",
        "description": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
        "robots": "follow, index",
        "ogTitle": "Mendable",
        "ogDescription": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
        "ogUrl": "https://docs.firecrawl.dev/",
        "ogImage": "https://docs.firecrawl.dev/mendable_new_og1.png",
        "ogLocaleAlternate": [],
        "ogSiteName": "Mendable",
        "sourceURL": "https://docs.firecrawl.dev/"
      },
    }
}
```

### Extracting without schema (New)

You can now extract without a schema by just passing a `prompt` to the endpoint. The llm chooses the structure of the data.

<CodeGroup>
  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "url": "https://docs.firecrawl.dev/",
        "formats": ["json"],
        "jsonOptions": {
          "prompt": "Extract the company mission from the page."
        }
      }'
  ```
</CodeGroup>

Output:

```json JSON
{
    "success": true,
    "data": {
      "json": {
        "company_mission": "Train a secure AI on your technical resources that answers customer and employee questions so your team doesn't have to",
      },
      "metadata": {
        "title": "Mendable",
        "description": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
        "robots": "follow, index",
        "ogTitle": "Mendable",
        "ogDescription": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
        "ogUrl": "https://docs.firecrawl.dev/",
        "ogImage": "https://docs.firecrawl.dev/mendable_new_og1.png",
        "ogLocaleAlternate": [],
        "ogSiteName": "Mendable",
        "sourceURL": "https://docs.firecrawl.dev/"
      },
    }
}
```

### Extraction (v0)

<CodeGroup>
  ```python Python

  app = FirecrawlApp(version="v0")

  class ArticleSchema(BaseModel):
      title: str
      points: int 
      by: str
      commentsURL: str

  class TopArticlesSchema(BaseModel):
  top: List[ArticleSchema] = Field(..., max_items=5, description="Top 5 stories")

  data = app.scrape_url('https://news.ycombinator.com', {
  'extractorOptions': {
  'extractionSchema': TopArticlesSchema.model_json_schema(),
  'mode': 'llm-extraction'
  },
  'pageOptions':{
  'onlyMainContent': True
  }
  })
  print(data["llm_extraction"])
  ```

  ```js JavaScript
  import FirecrawlApp from "@mendable/firecrawl-js";
  import { z } from "zod";

  const app = new FirecrawlApp<"v0">({
    apiKey: "fc-YOUR_API_KEY",
    version: "v0",
  });

  // Define schema to extract contents into
  const schema = z.object({
    top: z
      .array(
        z.object({
          title: z.string(),
          points: z.number(),
          by: z.string(),
          commentsURL: z.string(),
        })
      )
      .length(5)
      .describe("Top 5 stories on Hacker News"),
  });

  const scrapeResult = await app.scrapeUrl("https://news.ycombinator.com", {
    extractorOptions: { extractionSchema: schema },
  });

  console.log(scrapeResult.data["llm_extraction"]);
  ```

  ```go Go
  import (
    "fmt"
    "log"

    "github.com/mendableai/firecrawl-go"
  )

  app, err := NewFirecrawlApp(TEST_API_KEY, API_URL)
  if err != nil {
    log.Fatalf("Failed to initialize FirecrawlApp: %v", err)
  }

  params := map[string]any{
    "extractorOptions": ExtractorOptions{
      Mode:             "llm-extraction",
      ExtractionPrompt: "Based on the information on the page, find what the company's mission is and whether it supports SSO, and whether it is open source",
      ExtractionSchema: map[string]any{
        "type": "object",
        "properties": map[string]any{
          "company_mission": map[string]string{"type": "string"},
          "supports_sso":    map[string]string{"type": "boolean"},
          "is_open_source":  map[string]string{"type": "boolean"},
        },
        "required": []string{"company_mission", "supports_sso", "is_open_source"},
      },
    },
  }

  scrapeResult, err := app.ScrapeURL("https://news.ycombinator.com", params)
  if err != nil {
    log.Fatalf("Failed to scrape URL: %v", err)
  }
  fmt.Println(scrapeResult.LLMExtraction)
  ```

  ```rust Rust
  use firecrawl::FirecrawlApp;

  #[tokio::main]
  async fn main() {
      // Initialize the FirecrawlApp with the API key
      let api_key = "YOUR_API_KEY";
      let api_url = "https://api.firecrawl.dev";
      let app = FirecrawlApp::new(api_key, api_url).expect("Failed to initialize FirecrawlApp");

      // Define schema to extract contents into
      let json_schema = json!({
          "type": "object",
          "properties": {
              "top": {
                  "type": "array",
                  "items": {
                      "type": "object",
                      "properties": {
                          "title": {"type": "string"},
                          "points": {"type": "number"},
                          "by": {"type": "string"},
                          "commentsURL": {"type": "string"}
                      },
                      "required": ["title", "points", "by", "commentsURL"]
                  },
                  "minItems": 5,
                  "maxItems": 5,
                  "description": "Top 5 stories on Hacker News"
              }
          },
          "required": ["top"]
      });

      let llm_extraction_params = json!({
          "extractorOptions": {
              "extractionSchema": json_schema,
              "mode": "llm-extraction"
          },
          "pageOptions": {
              "onlyMainContent": true
          }
      });

      let llm_extraction_result = app
          .scrape_url("https://news.ycombinator.com", Some(llm_extraction_params))
          .await;
      match llm_extraction_result {
          Ok(data) => println!("LLM Extraction Result:\n{}", data["llm_extraction"]),
          Err(e) => eprintln!("LLM Extraction failed: {}", e),
      }
  }
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v0/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "url": "https://docs.firecrawl.dev/",
        "extractorOptions": {
          "mode": "llm-extraction",
          "extractionPrompt": "Based on the information on the page, extract the information from the schema. ",
          "extractionSchema": {
            "type": "object",
            "properties": {
              "company_mission": {
                        "type": "string"
              },
              "supports_sso": {
                        "type": "boolean"
              },
              "is_open_source": {
                        "type": "boolean"
              },
              "is_in_yc": {
                        "type": "boolean"
              }
            },
            "required": [
              "company_mission",
              "supports_sso",
              "is_open_source",
              "is_in_yc"
            ]
          }
        }
      }'
  ```
</CodeGroup>

## Interacting with the page with Actions

Firecrawl allows you to perform various actions on a web page before scraping its content. This is particularly useful for interacting with dynamic content, navigating through pages, or accessing content that requires user interaction.

Here is an example of how to use actions to navigate to google.com, search for Firecrawl, click on the first result, and take a screenshot.

It is important to almost always use the `wait` action before/after executing other actions to give enough time for the page to load.

### Example

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

  # Scrape a website:
  scrape_result = app.scrape_url('firecrawl.dev', 
      params={
          'formats': ['markdown', 'html'], 
          'actions': [
              {"type": "wait", "milliseconds": 2000},
              {"type": "click", "selector": "textarea[title=\"Search\"]"},
              {"type": "wait", "milliseconds": 2000},
              {"type": "write", "text": "firecrawl"},
              {"type": "wait", "milliseconds": 2000},
              {"type": "press", "key": "ENTER"},
              {"type": "wait", "milliseconds": 3000},
              {"type": "click", "selector": "h3"},
              {"type": "wait", "milliseconds": 3000},
              {"type": "scrape"},
              {"type": "screenshot"}
          ]
      }
  )
  print(scrape_result)
  ```

  ```js Node
  import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';

  const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

  // Scrape a website:
  const scrapeResult = await app.scrapeUrl('firecrawl.dev', { formats: ['markdown', 'html'], actions: [
      { type: "wait", milliseconds: 2000 },
      { type: "click", selector: "textarea[title=\"Search\"]" },
      { type: "wait", milliseconds: 2000 },
      { type: "write", text: "firecrawl" },
      { type: "wait", milliseconds: 2000 },
      { type: "press", key: "ENTER" },
      { type: "wait", milliseconds: 3000 },
      { type: "click", selector: "h3" },
      { type: "scrape" },
      {"type": "screenshot"}
  ] }) as ScrapeResponse;

  if (!scrapeResult.success) {
    throw new Error(`Failed to scrape: ${scrapeResult.error}`)
  }

  console.log(scrapeResult)
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
          "url": "google.com",
          "formats": ["markdown"],
          "actions": [
              {"type": "wait", "milliseconds": 2000},
              {"type": "click", "selector": "textarea[title=\"Search\"]"},
              {"type": "wait", "milliseconds": 2000},
              {"type": "write", "text": "firecrawl"},
              {"type": "wait", "milliseconds": 2000},
              {"type": "press", "key": "ENTER"},
              {"type": "wait", "milliseconds": 3000},
              {"type": "click", "selector": "h3"},
              {"type": "wait", "milliseconds": 3000},
              {"type": "screenshot"}
          ]
      }'
  ```
</CodeGroup>

### Output

<CodeGroup>
  ```json JSON
  {
    "success": true,
    "data": {
      "markdown": "Our first Launch Week is over! [See the recap 🚀](blog/firecrawl-launch-week-1-recap)...",
      "actions": {
        "screenshots": [
          "https://alttmdsdujxrfnakrkyi.supabase.co/storage/v1/object/public/media/screenshot-75ef2d87-31e0-4349-a478-fb432a29e241.png"
        ],
        "scrapes": [
          {
            "url": "https://www.firecrawl.dev/",
            "html": "<html><body><h1>Firecrawl</h1></body></html>"
          }
        ]
      },
      "metadata": {
        "title": "Home - Firecrawl",
        "description": "Firecrawl crawls and converts any website into clean markdown.",
        "language": "en",
        "keywords": "Firecrawl,Markdown,Data,Mendable,Langchain",
        "robots": "follow, index",
        "ogTitle": "Firecrawl",
        "ogDescription": "Turn any website into LLM-ready data.",
        "ogUrl": "https://www.firecrawl.dev/",
        "ogImage": "https://www.firecrawl.dev/og.png?123",
        "ogLocaleAlternate": [],
        "ogSiteName": "Firecrawl",
        "sourceURL": "http://google.com",
        "statusCode": 200
      }
    }
  }
  ```
</CodeGroup>

## Open Source vs Cloud

Firecrawl is open source available under the [AGPL-3.0 license](https://github.com/mendableai/firecrawl/blob/main/LICENSE).

To deliver the best possible product, we offer a hosted version of Firecrawl alongside our open-source offering. The cloud solution allows us to continuously innovate and maintain a high-quality, sustainable service for all users.

Firecrawl Cloud is available at [firecrawl.dev](https://firecrawl.dev) and offers a range of features that are not available in the open source version:

![Firecrawl Cloud vs Open Source](https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/images/open-source-cloud.png)

## Contributing

We love contributions! Please read our [contributing guide](https://github.com/mendableai/firecrawl/blob/main/CONTRIBUTING.md) before submitting a pull request.


# Launch Week III (New)
Source: https://docs.firecrawl.dev/launch-week

Check out what's new coming to Firecrawl in Launch Week III (April 14 - 20th)

## Day 0 - Firecrawl Editor Theme

![Firecrawl Editor Theme](https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/images/launch-week/lw3d0.webp)

We're excited to release our official Firecrawl Editor Theme! Available now for most editors including Cursor, Windsurf, and more.

### Download

You can download the editor theme on the VS Code Marketplace [here](https://firecrawl.link/lw3-editor-theme).

### Features

The Firecrawl Editor Theme provides a clean, focused coding experience for everyone. Our color palette emphasizes readability while maintaining the Firecrawl brand identity.


# Rate Limits
Source: https://docs.firecrawl.dev/rate-limits

Rate limits for different pricing plans and API requests

## Standard Plans

| Plan     | /scrape (requests/min) | /map (requests/min) | /crawl (requests/min) | /search (requests/min) |
| -------- | ---------------------- | ------------------- | --------------------- | ---------------------- |
| Free     | 10                     | 10                  | 1                     | 5                      |
| Hobby    | 100                    | 100                 | 15                    | 50                     |
| Standard | 500                    | 500                 | 50                    | 250                    |
| Growth   | 5000                   | 5000                | 250                   | 2500                   |

## Concurrent Requests

| Plan     | Concurrent Browsers |
| -------- | ------------------- |
| Free     | 2                   |
| Hobby    | 5                   |
| Standard | 50                  |
| Growth   | 100                 |

|         | /crawl/status (requests/min) |
| ------- | ---------------------------- |
| Default | 1500                         |

These rate limits are enforced to ensure fair usage and availability of the API for all users. If you require higher limits, please contact us at [hello@firecrawl.com](mailto:hello@firecrawl.com) to discuss custom plans.

### Batch Endpoints

Batch endpoints follow the /crawl rate limit.

## Extract

| Plan       | /extract (requests/min) |
| ---------- | ----------------------- |
| Free       | 10                      |
| Hobby      | 100                     |
| Standard   | 500                     |
| Growth     | 5000                    |
| Enterprise | Custom                  |

|      | /extract/status (requests/min) |
| ---- | ------------------------------ |
| Free | 500                            |

## Legacy Plans

| Plan            | /scrape (requests/min) | /crawl (concurrent req) | /search (requests/min) |
| --------------- | ---------------------- | ----------------------- | ---------------------- |
| Starter         | 100                    | 15                      | 100                    |
| Standard Legacy | 200                    | 200                     | 200                    |
| Scaled Legacy   | 250                    | 100                     | 250                    |

If you require higher limits, please contact us at [hello@firecrawl.com](mailto:hello@firecrawl.com) to discuss custom plans.


# Go
Source: https://docs.firecrawl.dev/sdks/go

Firecrawl Go SDK is a wrapper around the Firecrawl API to help you easily turn websites into markdown.

## Installation

To install the Firecrawl Go SDK, you can use go get:

```bash Go
go get github.com/mendableai/firecrawl-go
```

## Usage

1. Get an API key from [firecrawl.dev](https://firecrawl.dev)
2. Set the `API key` as a parameter to the `FirecrawlApp` struct.
3. Set the `API URL` and/or pass it as a parameter to the `FirecrawlApp` struct. Defaults to `https://api.firecrawl.dev`.
4. Set the `version` and/or pass it as a parameter to the `FirecrawlApp` struct. Defaults to `v1`.

Here's an example of how to use the SDK with error handling:

```go Go
import (
	"fmt"
	"log"
	"github.com/google/uuid"
	"github.com/mendableai/firecrawl-go"
)

func ptr[T any](v T) *T {
	return &v
}

func main() {
	// Initialize the FirecrawlApp with your API key
	apiKey := "fc-YOUR_API_KEY"
	apiUrl := "https://api.firecrawl.dev"
	version := "v1"

	app, err := firecrawl.NewFirecrawlApp(apiKey, apiUrl, version)
	if err != nil {
		log.Fatalf("Failed to initialize FirecrawlApp: %v", err)
	}

  // Scrape a website
  scrapeStatus, err := app.ScrapeUrl("https://firecrawl.dev", firecrawl.ScrapeParams{
    Formats: []string{"markdown", "html"},
  })
  if err != nil {
    log.Fatalf("Failed to send scrape request: %v", err)
  }

  fmt.Println(scrapeStatus)

	// Crawl a website
  idempotencyKey := uuid.New().String() // optional idempotency key
  crawlParams := &firecrawl.CrawlParams{
		ExcludePaths: []string{"blog/*"},
		MaxDepth:     ptr(2),
	}

	crawlStatus, err := app.CrawlUrl("https://firecrawl.dev", crawlParams, &idempotencyKey)
	if err != nil {
		log.Fatalf("Failed to send crawl request: %v", err)
	}

	fmt.Println(crawlStatus) 
}
```

### Scraping a URL

To scrape a single URL with error handling, use the `ScrapeURL` method. It takes the URL as a parameter and returns the scraped data as a dictionary.

```go Go
// Scrape a website
scrapeResult, err := app.ScrapeUrl("https://firecrawl.dev", map[string]any{
  "formats": []string{"markdown", "html"},
})
if err != nil {
  log.Fatalf("Failed to scrape URL: %v", err)
}

fmt.Println(scrapeResult)
```

### Crawling a Website

To crawl a website, use the `CrawlUrl` method. It takes the starting URL and optional parameters as arguments. The `params` argument allows you to specify additional options for the crawl job, such as the maximum number of pages to crawl, allowed domains, and the output format.

```go Go
crawlStatus, err := app.CrawlUrl("https://firecrawl.dev", map[string]any{
  "limit": 100,
  "scrapeOptions": map[string]any{
    "formats": []string{"markdown", "html"},
  },
})
if err != nil {
  log.Fatalf("Failed to send crawl request: %v", err)
}

fmt.Println(crawlStatus) 
```

### Checking Crawl Status

To check the status of a crawl job, use the `CheckCrawlStatus` method. It takes the job ID as a parameter and returns the current status of the crawl job.

```go Go
// Get crawl status
crawlStatus, err := app.CheckCrawlStatus("<crawl_id>")

if err != nil {
  log.Fatalf("Failed to get crawl status: %v", err)
}

fmt.Println(crawlStatus)
```

### Map a Website

Use `MapUrl` to generate a list of URLs from a website. The `params` argument let you customize the mapping process, including options to exclude subdomains or to utilize the sitemap.

```go Go
// Map a website
mapResult, err := app.MapUrl("https://firecrawl.dev", nil)
if err != nil {
  log.Fatalf("Failed to map URL: %v", err)
}

fmt.Println(mapResult)
```

## Error Handling

The SDK handles errors returned by the Firecrawl API and raises appropriate exceptions. If an error occurs during a request, an exception will be raised with a descriptive error message.


# Node
Source: https://docs.firecrawl.dev/sdks/node

Firecrawl Node SDK is a wrapper around the Firecrawl API to help you easily turn websites into markdown.

## Installation

To install the Firecrawl Node SDK, you can use npm:

```bash Node
npm install @mendable/firecrawl-js
```

## Usage

1. Get an API key from [firecrawl.dev](https://firecrawl.dev)
2. Set the API key as an environment variable named `FIRECRAWL_API_KEY` or pass it as a parameter to the `FirecrawlApp` class.

Here's an example of how to use the SDK with error handling:

```js Node
import FirecrawlApp, { CrawlParams, CrawlStatusResponse } from '@mendable/firecrawl-js';

const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

// Scrape a website
const scrapeResponse = await app.scrapeUrl('https://firecrawl.dev', {
  formats: ['markdown', 'html'],
});

if (!scrapeResponse.success) {
  throw new Error(`Failed to scrape: ${scrapeResponse.error}`)
}

console.log(scrapeResponse)

// Crawl a website
const crawlResponse = await app.crawlUrl('https://firecrawl.dev', {
  limit: 100,
  scrapeOptions: {
    formats: ['markdown', 'html'],
  }
});

if (!crawlResponse.success) {
  throw new Error(`Failed to crawl: ${crawlResponse.error}`)
}

console.log(crawlResponse)
```

### Scraping a URL

To scrape a single URL with error handling, use the `scrapeUrl` method. It takes the URL as a parameter and returns the scraped data as a dictionary.

```js Node
// Scrape a website:
const scrapeResult = await app.scrapeUrl('firecrawl.dev', { formats: ['markdown', 'html'] });

if (!scrapeResult.success) {
  throw new Error(`Failed to scrape: ${scrapeResult.error}`)
}

console.log(scrapeResult)
```

### Crawling a Website

To crawl a website with error handling, use the `crawlUrl` method. It takes the starting URL and optional parameters as arguments. The `params` argument allows you to specify additional options for the crawl job, such as the maximum number of pages to crawl, allowed domains, and the output format.

```js Node
const crawlResponse = await app.crawlUrl('https://firecrawl.dev', {
  limit: 100,
  scrapeOptions: {
    formats: ['markdown', 'html'],
  }
})

if (!crawlResponse.success) {
  throw new Error(`Failed to crawl: ${crawlResponse.error}`)
}

console.log(crawlResponse)
```

### Asynchronous Crawling

To crawl a website asynchronously, use the `crawlUrlAsync` method. It returns the crawl `ID` which you can use to check the status of the crawl job. It takes the starting URL and optional parameters as arguments. The `params` argument allows you to specify additional options for the crawl job, such as the maximum number of pages to crawl, allowed domains, and the output format.

```js Node
const crawlResponse = await app.asyncCrawlUrl('https://firecrawl.dev', {
  limit: 100,
  scrapeOptions: {
    formats: ['markdown', 'html'],
  }
});

if (!crawlResponse.success) {
  throw new Error(`Failed to crawl: ${crawlResponse.error}`)
}

console.log(crawlResponse)
```

### Checking Crawl Status

To check the status of a crawl job with error handling, use the `checkCrawlStatus` method. It takes the `ID` as a parameter and returns the current status of the crawl job.

```js Node
const crawlResponse = await app.checkCrawlStatus("<crawl_id>");

if (!crawlResponse.success) {
  throw new Error(`Failed to check crawl status: ${crawlResponse.error}`)
}

console.log(crawlResponse)
```

### Cancelling a Crawl

To cancel an asynchronous crawl job, use the `cancelCrawl` method. It takes the job ID of the asynchronous crawl as a parameter and returns the cancellation status.

```js Node
const cancelCrawl = await app.cancelCrawl(id);
console.log(cancelCrawl)
```

### Mapping a Website

To map a website with error handling, use the `mapUrl` method. It takes the starting URL as a parameter and returns the mapped data as a dictionary.

```js Node
const mapResult = await app.mapUrl('https://firecrawl.dev');

if (!mapResult.success) {
  throw new Error(`Failed to map: ${mapResult.error}`)
}

console.log(mapResult)
```

{/* ### Extracting Structured Data from Websites

  To extract structured data from websites with error handling, use the `extractUrl` method. It takes the starting URL as a parameter and returns the extracted data as a dictionary.

  <ExtractNodeShort /> */}

### Crawling a Website with WebSockets

To crawl a website with WebSockets, use the `crawlUrlAndWatch` method. It takes the starting URL and optional parameters as arguments. The `params` argument allows you to specify additional options for the crawl job, such as the maximum number of pages to crawl, allowed domains, and the output format.

```js Node
const watch = await app.crawlUrlAndWatch('mendable.ai', { excludePaths: ['blog/*'], limit: 5});

watch.addEventListener("document", doc => {
  console.log("DOC", doc.detail);
});

watch.addEventListener("error", err => {
  console.error("ERR", err.detail.error);
});

watch.addEventListener("done", state => {
  console.log("DONE", state.detail.status);
});
```

## Error Handling

The SDK handles errors returned by the Firecrawl API and raises appropriate exceptions. If an error occurs during a request, an exception will be raised with a descriptive error message. The examples above demonstrate how to handle these errors using `try/catch` blocks.


# Overview
Source: https://docs.firecrawl.dev/sdks/overview

Firecrawl SDKs are wrappers around the Firecrawl API to help you easily turn websites into markdown.

## Official SDKs

<CardGroup cols={2}>
  <Card title="Python SDK" icon="python" href="python">
    Explore the Python SDK for Firecrawl.
  </Card>

  <Card title="Node SDK" icon="node" href="node">
    Explore the Node SDK for Firecrawl.
  </Card>
</CardGroup>

## Community SDKs

<CardGroup cols={2}>
  <Card title="Go SDK" icon="golang" href="go">
    Explore the Go SDK for Firecrawl.
  </Card>

  <Card title="Rust SDK" icon="rust" href="rust">
    Explore the Rust SDK for Firecrawl.
  </Card>
</CardGroup>


# Python
Source: https://docs.firecrawl.dev/sdks/python

Firecrawl Python SDK is a wrapper around the Firecrawl API to help you easily turn websites into markdown.

## Installation

To install the Firecrawl Python SDK, you can use pip:

```bash Python
pip install firecrawl-py
```

## Usage

1. Get an API key from [firecrawl.dev](https://firecrawl.dev)
2. Set the API key as an environment variable named `FIRECRAWL_API_KEY` or pass it as a parameter to the `FirecrawlApp` class.

Here's an example of how to use the SDK:

```python Python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

# Scrape a website:
scrape_status = app.scrape_url(
  'https://firecrawl.dev', 
  params={'formats': ['markdown', 'html']}
)
print(scrape_status)

# Crawl a website:
crawl_status = app.crawl_url(
  'https://firecrawl.dev', 
  params={
    'limit': 100, 
    'scrapeOptions': {'formats': ['markdown', 'html']}
  }
)
print(crawl_status)
```

### Scraping a URL

To scrape a single URL, use the `scrape_url` method. It takes the URL as a parameter and returns the scraped data as a dictionary.

```python Python
# Scrape a website:
scrape_result = app.scrape_url('firecrawl.dev', params={'formats': ['markdown', 'html']})
print(scrape_result)
```

### Crawling a Website

To crawl a website, use the `crawl_url` method. It takes the starting URL and optional parameters as arguments. The `params` argument allows you to specify additional options for the crawl job, such as the maximum number of pages to crawl, allowed domains, and the output format.

```python Python
crawl_status = app.crawl_url(
  'https://firecrawl.dev', 
  params={
    'limit': 100, 
    'scrapeOptions': {'formats': ['markdown', 'html']}
  }, 
  poll_interval=30
)
print(crawl_status)
```

### Asynchronous Crawling

To crawl a website asynchronously, use the `crawl_url_async` method. It returns the crawl `ID` which you can use to check the status of the crawl job. It takes the starting URL and optional parameters as arguments. The `params` argument allows you to specify additional options for the crawl job, such as the maximum number of pages to crawl, allowed domains, and the output format.

```python Python
crawl_status = app.async_crawl_url(
  'https://firecrawl.dev', 
  params={
    'limit': 100, 
    'scrapeOptions': {'formats': ['markdown', 'html']}
  }
)
print(crawl_status)
```

### Checking Crawl Status

To check the status of a crawl job, use the `check_crawl_status` method. It takes the job ID as a parameter and returns the current status of the crawl job.

```python Python
crawl_status = app.check_crawl_status("<crawl_id>")
print(crawl_status)
```

### Cancelling a Crawl

To cancel an asynchronous crawl job, use the `cancel_crawl` method. It takes the job ID of the asynchronous crawl as a parameter and returns the cancellation status.

```python Python
cancel_crawl = app.cancel_crawl(id)
print(cancel_crawl)
```

### Map a Website

Use `map_url` to generate a list of URLs from a website. The `params` argument let you customize the mapping process, including options to exclude subdomains or to utilize the sitemap.

```python Python
# Map a website:
map_result = app.map_url('https://firecrawl.dev')
print(map_result)
```

{/* ### Extracting Structured Data from Websites

  To extract structured data from websites, use the `extract` method. It takes the URLs to extract data from, a prompt, and a schema as arguments. The schema is a Pydantic model that defines the structure of the extracted data.

  <ExtractPythonShort /> */}

### Crawling a Website with WebSockets

To crawl a website with WebSockets, use the `crawl_url_and_watch` method. It takes the starting URL and optional parameters as arguments. The `params` argument allows you to specify additional options for the crawl job, such as the maximum number of pages to crawl, allowed domains, and the output format.

```python Python
# inside an async function...
nest_asyncio.apply()

# Define event handlers
def on_document(detail):
    print("DOC", detail)

def on_error(detail):
    print("ERR", detail['error'])

def on_done(detail):
    print("DONE", detail['status'])

    # Function to start the crawl and watch process
async def start_crawl_and_watch():
    # Initiate the crawl job and get the watcher
    watcher = app.crawl_url_and_watch('firecrawl.dev', { 'excludePaths': ['blog/*'], 'limit': 5 })

    # Add event listeners
    watcher.add_event_listener("document", on_document)
    watcher.add_event_listener("error", on_error)
    watcher.add_event_listener("done", on_done)

    # Start the watcher
    await watcher.connect()

# Run the event loop
await start_crawl_and_watch()
```

## Error Handling

The SDK handles errors returned by the Firecrawl API and raises appropriate exceptions. If an error occurs during a request, an exception will be raised with a descriptive error message.


# Rust
Source: https://docs.firecrawl.dev/sdks/rust

Firecrawl Rust SDK is a library to help you easily scrape and crawl websites, and output the data in a format ready for use with language models (LLMs).

## Installation

To install the Firecrawl Rust SDK, add the following to your `Cargo.toml`:

```yaml Rust
# Add this to your Cargo.toml
[dependencies]
firecrawl = "^1.0"
tokio = { version = "^1", features = ["full"] }
```

## Usage

First, you need to obtain an API key from [firecrawl.dev](https://firecrawl.dev). Then, you need to initialize the `FirecrawlApp`. From there, you can access functions like `FirecrawlApp::scrape_url`, which let you use our API.

Here's an example of how to use the SDK in Rust:

```rust Rust
use firecrawl::{crawl::{CrawlOptions, CrawlScrapeOptions, CrawlScrapeFormats}, FirecrawlApp, scrape::{ScrapeOptions, ScrapeFormats}};

#[tokio::main]
async fn main() {
    // Initialize the FirecrawlApp with the API key
    let app = FirecrawlApp::new("fc-YOUR_API_KEY").expect("Failed to initialize FirecrawlApp");

    // Scrape a URL
    let options = ScrapeOptions {
        formats vec! [ ScrapeFormats::Markdown, ScrapeFormats::HTML ].into(),
        ..Default::default()
    };

    let scrape_result = app.scrape_url("https://firecrawl.dev", options).await;

    match scrape_result {
        Ok(data) => println!("Scrape Result:\n{}", data.markdown.unwrap()),
        Err(e) => eprintln!("Map failed: {}", e),
    }

    // Crawl a website
    let crawl_options = CrawlOptions {
        scrape_options: CrawlScrapeOptions {
            formats: vec![ CrawlScrapeFormats::Markdown, CrawlScrapeFormats::HTML ].into(),
            ..Default::default()
        }.into(),
        limit: 100.into(),
        ..Default::default()
    };

    let crawl_result = app
        .crawl_url("https://mendable.ai", crawl_options)
        .await;

    match crawl_result {
        Ok(data) => println!("Crawl Result (used {} credits):\n{:#?}", data.credits_used, data.data),
        Err(e) => eprintln!("Crawl failed: {}", e),
    }
}
```

### Scraping a URL

To scrape a single URL, use the `scrape_url` method. It takes the URL as a parameter and returns the scraped data as a `Document`.

```rust Rust
let options = ScrapeOptions {
    formats vec! [ ScrapeFormats::Markdown, ScrapeFormats::HTML ].into(),
    ..Default::default()
};

let scrape_result = app.scrape_url("https://firecrawl.dev", options).await;

match scrape_result {
    Ok(data) => println!("Scrape Result:\n{}", data.markdown.unwrap()),
    Err(e) => eprintln!("Map failed: {}", e),
}
```

### Scraping with Extract

With Extract, you can easily extract structured data from any URL. You need to specify your schema in the JSON Schema format, using the `serde_json::json!` macro.

```rust Rust
let json_schema = json!({
    "type": "object",
    "properties": {
        "top": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "title": {"type": "string"},
                    "points": {"type": "number"},
                    "by": {"type": "string"},
                    "commentsURL": {"type": "string"}
                },
                "required": ["title", "points", "by", "commentsURL"]
            },
            "minItems": 5,
            "maxItems": 5,
            "description": "Top 5 stories on Hacker News"
        }
    },
    "required": ["top"]
});

let llm_extraction_options = ScrapeOptions {
    formats: vec![ ScrapeFormats::Extract ].into(),
    extract: ExtractOptions {
        schema: json_schema.into(),
        ..Default::default()
    }.into(),
    ..Default::default()
};

let llm_extraction_result = app
    .scrape_url("https://news.ycombinator.com", llm_extraction_options)
    .await;

match llm_extraction_result {
    Ok(data) => println!("LLM Extraction Result:\n{:#?}", data.extract.unwrap()),
    Err(e) => eprintln!("LLM Extraction failed: {}", e),
}
```

### Crawling a Website

To crawl a website, use the `crawl_url` method. This will wait for the crawl to complete, which may take a long time based on your starting URL and your options.

```rust Rust
let crawl_options = CrawlOptions {
    scrape_options: CrawlScrapeOptions {
        formats: vec![ CrawlScrapeFormats::Markdown, CrawlScrapeFormats::HTML ].into(),
        ..Default::default()
    }.into(),
    limit: 100.into(),
    ..Default::default()
};

let crawl_result = app
    .crawl_url("https://mendable.ai", crawl_options)
    .await;

match crawl_result {
    Ok(data) => println!("Crawl Result (used {} credits):\n{:#?}", data.credits_used, data.data),
    Err(e) => eprintln!("Crawl failed: {}", e),
}
```

#### Crawling asynchronously

To crawl without waiting for the result, use the `crawl_url_async` method. It takes the same parameters, but it returns a `CrawlAsyncRespone` struct, containing the crawl's ID. You can use that ID with the `check_crawl_status` method to check the status at any time. Do note that completed crawls are deleted after 24 hours.

```rust Rust
let crawl_id = app.crawl_url_async("https://mendable.ai", None).await?.id;

// ... later ...

let status = app.check_crawl_status(crawl_id).await?;

if status.status == CrawlStatusTypes::Completed {
    println!("Crawl is done: {:#?}", status.data);
} else {
    // ... wait some more ...
}
```

### Map a URL

Map all associated links from a starting URL.

```rust Rust
let map_result = app.map_url("https://firecrawl.dev", None).await;

match map_result {
    Ok(data) => println!("Mapped URLs: {:#?}", data),
    Err(e) => eprintln!("Map failed: {}", e),
}
```

## Error Handling

The SDK handles errors returned by the Firecrawl API and by our dependencies, and combines them into the `FirecrawlError` enum, implementing `Error`, `Debug` and `Display`. All of our methods return a `Result<T, FirecrawlError>`.


# Welcome to V1
Source: https://docs.firecrawl.dev/v1-welcome

Firecrawl allows you to turn entire websites into LLM-ready markdown

Firecrawl V1 is here! With that we introduce a more reliable and developer friendly API.

Here is what's new:

* Output Formats for `/scrape`. Choose what formats you want your output in.
* New [`/map` endpoint](/features/map) for getting most of the URLs of a webpage.
* Developer friendly API for `/crawl/{id}` status.
* 2x Rate Limits for all plans.
* [Go SDK](/sdks/go) and [Rust SDK](/sdks/rust)
* Teams support
* API Key Management in the dashboard.
* `onlyMainContent` is now default to `true`.
* `/crawl` webhooks and websocket support.

## Scrape Formats

You can now choose what formats you want your output in. You can specify multiple output formats. Supported formats are:

* Markdown (markdown)
* HTML (html)
* Raw HTML (rawHtml) (with no modifications)
* Screenshot (screenshot or screenshot\@fullPage)
* Links (links)
* Extract (extract) - structured output

Output keys will match the format you choose.

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

  # Scrape a website:
  scrape_result = app.scrape_url('firecrawl.dev', params={'formats': ['markdown', 'html']})
  print(scrape_result)
  ```

  ```js Node
  import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';

  const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

  // Scrape a website:
  const scrapeResult = await app.scrapeUrl('firecrawl.dev', { formats: ['markdown', 'html'] }) as ScrapeResponse;

  if (!scrapeResult.success) {
    throw new Error(`Failed to scrape: ${scrapeResult.error}`)
  }

  console.log(scrapeResult)
  ```

  ```go Go
  import (
  	"fmt"
  	"log"

  	"github.com/mendableai/firecrawl-go"
  )

  func main() {
  	// Initialize the FirecrawlApp with your API key
  	apiKey := "fc-YOUR_API_KEY"
  	apiUrl := "https://api.firecrawl.dev"
  	version := "v1"

  	app, err := firecrawl.NewFirecrawlApp(apiKey, apiUrl, version)
  	if err != nil {
  		log.Fatalf("Failed to initialize FirecrawlApp: %v", err)
  	}

  	// Scrape a website
  	scrapeResult, err := app.ScrapeUrl("https://firecrawl.dev", map[string]any{
  		"formats": []string{"markdown", "html"},
  	})
  	if err != nil {
  		log.Fatalf("Failed to scrape URL: %v", err)
  	}

  	fmt.Println(scrapeResult)
  }
  ```

  ```rust Rust
  use firecrawl::{FirecrawlApp, scrape::{ScrapeOptions, ScrapeFormats}};

  #[tokio::main]
  async fn main() {
      // Initialize the FirecrawlApp with the API key
      let app = FirecrawlApp::new("fc-YOUR_API_KEY").expect("Failed to initialize FirecrawlApp");

      let options = ScrapeOptions {
          formats vec! [ ScrapeFormats::Markdown, ScrapeFormats::HTML ].into(),
          ..Default::default()
      };

      let scrape_result = app.scrape_url("https://firecrawl.dev", options).await;

      match scrape_result {
          Ok(data) => println!("Scrape Result:\n{}", data.markdown.unwrap()),
          Err(e) => eprintln!("Map failed: {}", e),
      }
  }
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "url": "https://docs.firecrawl.dev",
        "formats" : ["markdown", "html"]
      }'
  ```
</CodeGroup>

### Response

SDKs will return the data object directly. cURL will return the payload exactly as shown below.

```json
{
  "success": true,
  "data" : {
    "markdown": "Launch Week I is here! [See our Day 2 Release 🚀](https://www.firecrawl.dev/blog/launch-week-i-day-2-doubled-rate-limits)[💥 Get 2 months free...",
    "html": "<!DOCTYPE html><html lang=\"en\" class=\"light\" style=\"color-scheme: light;\"><body class=\"__variable_36bd41 __variable_d7dc5d font-inter ...",
    "metadata": {
      "title": "Home - Firecrawl",
      "description": "Firecrawl crawls and converts any website into clean markdown.",
      "language": "en",
      "keywords": "Firecrawl,Markdown,Data,Mendable,Langchain",
      "robots": "follow, index",
      "ogTitle": "Firecrawl",
      "ogDescription": "Turn any website into LLM-ready data.",
      "ogUrl": "https://www.firecrawl.dev/",
      "ogImage": "https://www.firecrawl.dev/og.png?123",
      "ogLocaleAlternate": [],
      "ogSiteName": "Firecrawl",
      "sourceURL": "https://firecrawl.dev",
      "statusCode": 200
    }
  }
}
```

## Introducing /map (Alpha)

The easiest way to go from a single url to a map of the entire website.

### Usage

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp

  app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

  # Map a website:
  map_result = app.map_url('https://firecrawl.dev')
  print(map_result)
  ```

  ```js Node
  import FirecrawlApp, { MapResponse } from '@mendable/firecrawl-js';

  const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

  const mapResult = await app.mapUrl('https://firecrawl.dev') as MapResponse;

  if (!mapResult.success) {
      throw new Error(`Failed to map: ${mapResult.error}`)
  }

  console.log(mapResult)
  ```

  ```go Go
  import (
  	"fmt"
  	"log"

  	"github.com/mendableai/firecrawl-go"
  )

  func main() {
  	// Initialize the FirecrawlApp with your API key
  	apiKey := "fc-YOUR_API_KEY"
  	apiUrl := "https://api.firecrawl.dev"
  	version := "v1"

  	app, err := firecrawl.NewFirecrawlApp(apiKey, apiUrl, version)
  	if err != nil {
  		log.Fatalf("Failed to initialize FirecrawlApp: %v", err)
  	}

  	// Map a website
  	mapResult, err := app.MapUrl("https://firecrawl.dev", nil)
  	if err != nil {
  		log.Fatalf("Failed to map URL: %v", err)
  	}

  	fmt.Println(mapResult)
  }
  ```

  ```rust Rust
  use firecrawl::FirecrawlApp;

  #[tokio::main]
  async fn main() {
      // Initialize the FirecrawlApp with the API key
      let app = FirecrawlApp::new("fc-YOUR_API_KEY").expect("Failed to initialize FirecrawlApp");

      let map_result = app.map_url("https://firecrawl.dev", None).await;

      match map_result {
          Ok(data) => println!("Mapped URLs: {:#?}", data),
          Err(e) => eprintln!("Map failed: {}", e),
      }
  }
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/map \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "url": "https://firecrawl.dev"
      }'
  ```
</CodeGroup>

### Response

SDKs will return the data object directly. cURL will return the payload exactly as shown below.

```json
{
  "status": "success",
  "links": [
    "https://firecrawl.dev",
    "https://www.firecrawl.dev/pricing",
    "https://www.firecrawl.dev/blog",
    "https://www.firecrawl.dev/playground",
    "https://www.firecrawl.dev/smart-crawl",
    ...
  ]
}
```

## WebSockets

To crawl a website with WebSockets, use the `Crawl URL and Watch` method.

<CodeGroup>
  ```python Python
  # inside an async function...
  nest_asyncio.apply()

  # Define event handlers
  def on_document(detail):
      print("DOC", detail)

  def on_error(detail):
      print("ERR", detail['error'])

  def on_done(detail):
      print("DONE", detail['status'])

      # Function to start the crawl and watch process
  async def start_crawl_and_watch():
      # Initiate the crawl job and get the watcher
      watcher = app.crawl_url_and_watch('firecrawl.dev', { 'excludePaths': ['blog/*'], 'limit': 5 })

      # Add event listeners
      watcher.add_event_listener("document", on_document)
      watcher.add_event_listener("error", on_error)
      watcher.add_event_listener("done", on_done)

      # Start the watcher
      await watcher.connect()

  # Run the event loop
  await start_crawl_and_watch()
  ```

  ```js Node
  const watch = await app.crawlUrlAndWatch('mendable.ai', { excludePaths: ['blog/*'], limit: 5});

  watch.addEventListener("document", doc => {
    console.log("DOC", doc.detail);
  });

  watch.addEventListener("error", err => {
    console.error("ERR", err.detail.error);
  });

  watch.addEventListener("done", state => {
    console.log("DONE", state.detail.status);
  });
  ```
</CodeGroup>

## Extract format

LLM extraction is now available in v1 under the `extract` format. To extract structured from a page, you can pass a schema to the endpoint or just provide a prompt.

<CodeGroup>
  ```python Python
  from firecrawl import FirecrawlApp
  from pydantic import BaseModel, Field

  # Initialize the FirecrawlApp with your API key
  app = FirecrawlApp(api_key='your_api_key')

  class ExtractSchema(BaseModel):
      company_mission: str
      supports_sso: bool
      is_open_source: bool
      is_in_yc: bool

  data = app.scrape_url('https://docs.firecrawl.dev/', {
      'formats': ['json'],
      'jsonOptions': {
          'schema': ExtractSchema.model_json_schema(),
      }
  })
  print(data["json"])
  ```

  ```js Node
  import FirecrawlApp from "@mendable/firecrawl-js";
  import { z } from "zod";

  const app = new FirecrawlApp({
    apiKey: "fc-YOUR_API_KEY"
  });

  // Define schema to extract contents into
  const schema = z.object({
    company_mission: z.string(),
    supports_sso: z.boolean(),
    is_open_source: z.boolean(),
    is_in_yc: z.boolean()
  });

  const scrapeResult = await app.scrapeUrl("https://docs.firecrawl.dev/", {
    formats: ["json"],
    jsonOptions: { schema: schema }
  });

  if (!scrapeResult.success) {
    throw new Error(`Failed to scrape: ${scrapeResult.error}`)
  }

  console.log(scrapeResult.extract);
  ```

  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "url": "https://docs.firecrawl.dev/",
        "formats": ["json"],
        "jsonOptions": {
          "schema": {
            "type": "object",
            "properties": {
              "company_mission": {
                        "type": "string"
              },
              "supports_sso": {
                        "type": "boolean"
              },
              "is_open_source": {
                        "type": "boolean"
              },
              "is_in_yc": {
                        "type": "boolean"
              }
            },
            "required": [
              "company_mission",
              "supports_sso",
              "is_open_source",
              "is_in_yc"
            ]
          }
        }
      }'
  ```
</CodeGroup>

Output:

```json JSON
{
    "success": true,
    "data": {
      "json": {
        "company_mission": "Train a secure AI on your technical resources that answers customer and employee questions so your team doesn't have to",
        "supports_sso": true,
        "is_open_source": false,
        "is_in_yc": true
      },
      "metadata": {
        "title": "Mendable",
        "description": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
        "robots": "follow, index",
        "ogTitle": "Mendable",
        "ogDescription": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
        "ogUrl": "https://docs.firecrawl.dev/",
        "ogImage": "https://docs.firecrawl.dev/mendable_new_og1.png",
        "ogLocaleAlternate": [],
        "ogSiteName": "Mendable",
        "sourceURL": "https://docs.firecrawl.dev/"
      },
    }
}
```

### Extracting without schema (New)

You can now extract without a schema by just passing a `prompt` to the endpoint. The llm chooses the structure of the data.

<CodeGroup>
  ```bash cURL
  curl -X POST https://api.firecrawl.dev/v1/scrape \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "url": "https://docs.firecrawl.dev/",
        "formats": ["json"],
        "jsonOptions": {
          "prompt": "Extract the company mission from the page."
        }
      }'
  ```
</CodeGroup>

Output:

```json JSON
{
    "success": true,
    "data": {
      "json": {
        "company_mission": "Train a secure AI on your technical resources that answers customer and employee questions so your team doesn't have to",
      },
      "metadata": {
        "title": "Mendable",
        "description": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
        "robots": "follow, index",
        "ogTitle": "Mendable",
        "ogDescription": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
        "ogUrl": "https://docs.firecrawl.dev/",
        "ogImage": "https://docs.firecrawl.dev/mendable_new_og1.png",
        "ogLocaleAlternate": [],
        "ogSiteName": "Mendable",
        "sourceURL": "https://docs.firecrawl.dev/"
      },
    }
}
```

## New Crawl Webhook

You can now pass a `webhook` parameter to the `/crawl` endpoint. This will send a POST request to the URL you specify when the crawl is started, updated and completed.

The webhook will now trigger for every page crawled and not just the whole result at the end.

```bash cURL
curl -X POST https://api.firecrawl.dev/v1/crawl \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
      "url": "https://docs.firecrawl.dev",
      "limit": 100,
      "webhook": "https://example.com/webhook"
    }'
```

### Webhook Events

There are now 4 types of events:

* `crawl.started` - Triggered when the crawl is started.
* `crawl.page` - Triggered for every page crawled.
* `crawl.completed` - Triggered when the crawl is completed to let you know it's done.
* `crawl.failed` - Triggered when the crawl fails.

### Webhook Response

* `success` - If the webhook was successful in crawling the page correctly.
* `type` - The type of event that occurred.
* `id` - The ID of the crawl.
* `data` - The data that was scraped (Array). This will only be non empty on `crawl.page` and will contain 1 item if the page was scraped successfully. The response is the same as the `/scrape` endpoint.
* `error` - If the webhook failed, this will contain the error message.

## Migrating from V0

> ⚠️ **Deprecation Notice**: V0 endpoints will be deprecated on April 1st, 2025. Please migrate to V1 endpoints before then to ensure uninterrupted service.

## /scrape endpoint

The updated `/scrape` endpoint has been redesigned for enhanced reliability and ease of use. The structure of the new `/scrape` request body is as follows:

```json
{
  "url": "<string>",
  "formats": ["markdown", "html", "rawHtml", "links", "screenshot", "json"],
  "includeTags": ["<string>"],
  "excludeTags": ["<string>"],
  "headers": { "<key>": "<value>" },
  "waitFor": 123,
  "timeout": 123
}
```

### Formats

You can now choose what formats you want your output in. You can specify multiple output formats. Supported formats are:

* Markdown (markdown)
* HTML (html)
* Raw HTML (rawHtml) (with no modifications)
* Screenshot (screenshot or screenshot\@fullPage)
* Links (links)
* JSON (json)

By default, the output will be include only the markdown format.

### Details on the new request body

The table below outlines the changes to the request body parameters for the `/scrape` endpoint in V1.

| Parameter                          | Change            | Description                                                                                           |
| ---------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------- |
| `onlyIncludeTags`                  | Moved and Renamed | Moved to root level. And renamed to `includeTags`.                                                    |
| `removeTags`                       | Moved and Renamed | Moved to root level. And renamed to `excludeTags`.                                                    |
| `onlyMainContent`                  | Moved             | Moved to root level. `true` by default.                                                               |
| `waitFor`                          | Moved             | Moved to root level.                                                                                  |
| `headers`                          | Moved             | Moved to root level.                                                                                  |
| `parsePDF`                         | Moved             | Moved to root level.                                                                                  |
| `extractorOptions`                 | No Change         |                                                                                                       |
| `timeout`                          | No Change         |                                                                                                       |
| `pageOptions`                      | Removed           | No need for `pageOptions` parameter. The scrape options were moved to root level.                     |
| `replaceAllPathsWithAbsolutePaths` | Removed           | `replaceAllPathsWithAbsolutePaths` is not needed anymore. Every path is now default to absolute path. |
| `includeHtml`                      | Removed           | add `"html"` to `formats` instead.                                                                    |
| `includeRawHtml`                   | Removed           | add `"rawHtml"` to `formats` instead.                                                                 |
| `screenshot`                       | Removed           | add `"screenshot"` to `formats` instead.                                                              |
| `fullPageScreenshot`               | Removed           | add `"screenshot@fullPage"` to `formats` instead.                                                     |
| `extractorOptions`                 | Removed           | Use `"extract"` format instead with `extract` object.                                                 |

The new `extract` format is described in the [llm-extract](/features/extract) section.

## /crawl endpoint

We've also updated the `/crawl` endpoint on `v1`. Check out the improved body request below:

```json
{
  "url": "<string>",
  "excludePaths": ["<string>"],
  "includePaths": ["<string>"],
  "maxDepth": 2,
  "ignoreSitemap": true,
  "limit": 10,
  "allowBackwardLinks": true,
  "allowExternalLinks": true,
  "scrapeOptions": {
    // same options as in /scrape
    "formats": ["markdown", "html", "rawHtml", "screenshot", "links"],
    "headers": { "<key>": "<value>" },
    "includeTags": ["<string>"],
    "excludeTags": ["<string>"],
    "onlyMainContent": true,
    "waitFor": 123
  }
}
```

### Details on the new request body

The table below outlines the changes to the request body parameters for the `/crawl` endpoint in V1.

| Parameter               | Change            | Description                                                                         |
| ----------------------- | ----------------- | ----------------------------------------------------------------------------------- |
| `pageOptions`           | Renamed           | Renamed to `scrapeOptions`.                                                         |
| `includes`              | Moved and Renamed | Moved to root level. Renamed to `includePaths`.                                     |
| `excludes`              | Moved and Renamed | Moved to root level. Renamed to `excludePaths`.                                     |
| `allowBackwardCrawling` | Moved and Renamed | Moved to root level. Renamed to `allowBackwardLinks`.                               |
| `allowExternalLinks`    | Moved             | Moved to root level.                                                                |
| `maxDepth`              | Moved             | Moved to root level.                                                                |
| `ignoreSitemap`         | Moved             | Moved to root level.                                                                |
| `limit`                 | Moved             | Moved to root level.                                                                |
| `crawlerOptions`        | Removed           | No need for `crawlerOptions` parameter. The crawl options were moved to root level. |
| `timeout`               | Removed           | Use `timeout` in `scrapeOptions` instead.                                           |


