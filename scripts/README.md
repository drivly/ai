# Scripts

This directory contains utility scripts for the AI Primitives platform.

## Resource Embedding Batch Generation

The `generateResourceEmbeddingsBatch.ts` script is designed to generate embeddings for Resources in batches. This approach helps avoid write conflicts and provides more efficient embedding generation compared to the current implementation that generates embeddings directly in the `afterChange` hook or via a task system job.

### Problem Addressed (ENG-721)

The current implementation generates embeddings for resources in two ways:
1. Directly in the `afterChange` hook of the Resources collection
2. Via a task system job (using `generateThingEmbedding`) if direct generation fails

This approach has led to:
- Write conflicts for certain resources, particularly resource ID `67dd4e7ec37e99e7ed48ffa2`
- Inefficient processing as resources are handled one at a time
- Dependency on the payload job queues/tasks system

### Solution

The batch script simplifies this process by:
1. Removing dependency on the payload job queues/tasks
2. Querying for resources missing embeddings
3. Using `embedMany` from the AI SDK to process resources in batches
4. Directly updating the database with the generated embeddings
5. Implementing special handling for problematic resources

### Usage

Run the script with:

```bash
# Run with default batch size (50)
pnpm tsx scripts/generateResourceEmbeddingsBatch.ts

# Run with custom batch size
pnpm tsx scripts/generateResourceEmbeddingsBatch.ts 100
```

### Setting up as a Cron Job

To run this script on a schedule, add it to your server's crontab:

```bash
# Example: Run every 6 hours
0 */6 * * * cd /path/to/repo && pnpm tsx scripts/generateResourceEmbeddingsBatch.ts
```

### Features

- Batch processing of resources without embeddings
- Special handling for problematic resources to avoid write conflicts
- Efficient embedding generation using `embedMany` from the AI SDK
- Direct database updates with generated embeddings
- Configurable batch size
- Comprehensive error handling and logging
