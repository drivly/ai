# cli.do

A unified CLI for all .do SDK packages.

## Installation

```bash
npm install -g cli.do
```

## Usage

The CLI supports two command patterns:

### Pattern 1: SDK-first syntax

```bash
functions.do list
workflows.do execute myWorkflow
agents.do list
```

### Pattern 2: Command-first syntax

```bash
do functions list
do workflows execute myWorkflow
do agents list
```

## Available SDKs

- `apis` - APIs Gateway commands
- `functions` - AI Functions commands
- `workflows` - Workflows commands
- `agents` - AI Agents commands

## Common Commands

```bash
# Initialize a new project
do functions init

# Login with API token
do functions login <token>

# Logout and remove stored credentials
do functions logout

# Pull remote resources to local project
do functions pull

# Push local resources to remote
do functions push

# Sync local and remote resources
do functions sync

# List resources in a collection
do functions list <collection>

# Get a specific resource
do functions get <collection> <id>

# Create a new resource
do functions create <collection> <data>

# Update a resource
do functions update <collection> <id> <data>

# Delete a resource
do functions delete <collection> <id>

# Execute a function
do functions execute <functionId> <inputs>
```

## Environment Variables

- `DO_API_KEY` - API key for authentication (used for all SDKs)
- `APIS_DO_API_KEY` - API key for apis.do
- `FUNCTIONS_DO_API_KEY` - API key for functions.do
- `WORKFLOWS_DO_API_KEY` - API key for workflows.do
- `AGENTS_DO_API_KEY` - API key for agents.do

## License

MIT
