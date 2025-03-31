import React, { useState, useEffect } from 'react'
import { Box, Text, useApp } from 'ink'
import { CLI } from '../cli.js'

interface AppProps {
  cli: CLI
  args: string[]
  command?: string
  version: string
}

export const App: React.FC<AppProps> = ({ cli, args, command, version }) => {
  const { exit } = useApp()
  const [output, setOutput] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const runCommand = async () => {
      if (!command) {
        showHelp()
        exit()
        return
      }

      if (command === '--version' || command === '-v') {
        setOutput(`apis.do CLI v${version}`)
        exit()
        return
      }

      if (command === 'help' || command === '--help' || command === '-h') {
        showHelp()
        exit()
        return
      }

      setLoading(true)

      try {
        switch (command) {
          case 'init':
            await cli.init({ force: args.includes('--force') })
            setOutput('Project initialized successfully')
            break
          case 'login':
            await cli.login({ token: args[1] })
            setOutput('Logged in successfully')
            break
          case 'logout':
            await cli.logout()
            setOutput('Logged out successfully')
            break
          case 'pull':
            await cli.pull({ resources: args.slice(1) })
            setOutput('Resources pulled successfully')
            break
          case 'push':
            await cli.push({ resources: args.slice(1) })
            setOutput('Resources pushed successfully')
            break
          case 'sync':
            await cli.sync()
            setOutput('Resources synced successfully')
            break
          case 'list':
            if (!args[1]) {
              setError('Error: Collection name required')
              exit(new Error('Command error'))
              return
            }
            const listResult = await cli.list(args[1])
            setOutput(JSON.stringify(listResult, null, 2))
            break
          case 'get':
            if (!args[1] || !args[2]) {
              setError('Error: Collection name and ID required')
              exit(new Error('Command error'))
              return
            }
            const getResult = await cli.get(args[1], args[2])
            setOutput(JSON.stringify(getResult, null, 2))
            break
          case 'create':
            if (!args[1]) {
              setError('Error: Collection name required')
              exit(new Error('Command error'))
              return
            }
            let createData
            try {
              createData = JSON.parse(args[2] || '{}')
            } catch (e) {
              setError('Error: Invalid JSON data')
              exit(new Error('Command error'))
              return
            }
            const createResult = await cli.create(args[1], createData)
            setOutput(JSON.stringify(createResult, null, 2))
            break
          case 'update':
            if (!args[1] || !args[2]) {
              setError('Error: Collection name and ID required')
              exit(new Error('Command error'))
              return
            }
            let updateData
            try {
              updateData = JSON.parse(args[3] || '{}')
            } catch (e) {
              setError('Error: Invalid JSON data')
              exit(new Error('Command error'))
              return
            }
            const updateResult = await cli.update(args[1], args[2], updateData)
            setOutput(JSON.stringify(updateResult, null, 2))
            break
          case 'delete':
            if (!args[1] || !args[2]) {
              setError('Error: Collection name and ID required')
              exit(new Error('Command error'))
              return
            }
            const deleteResult = await cli.delete(args[1], args[2])
            setOutput(JSON.stringify(deleteResult, null, 2))
            break
          case 'execute':
            if (!args[1]) {
              setError('Error: Function ID required')
              exit(new Error('Command error'))
              return
            }
            let executeInputs
            try {
              executeInputs = JSON.parse(args[2] || '{}')
            } catch (e) {
              setError('Error: Invalid JSON inputs')
              exit(new Error('Command error'))
              return
            }
            const executeResult = await cli.executeFunction(args[1], executeInputs)
            setOutput(JSON.stringify(executeResult, null, 2))
            break
          default:
            setError(`Unknown command: ${command}`)
            showHelp()
            exit(new Error('Command error'))
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        setError(`Error: ${errorMessage}`)
        exit(new Error('Command error'))
      } finally {
        setLoading(false)
        exit()
      }
    }

    runCommand()
  }, [])

  function showHelp() {
    setOutput(`
apis.do CLI v${version}

Usage:
  apis [command] [options]

Commands:
  init                Initialize a new project
  login [token]       Login with API token
  logout              Remove stored credentials
  pull [resources]    Pull remote resources to local project
  push [resources]    Push local resources to remote
  sync                Sync local and remote resources
  list <collection>   List resources in a collection
  get <collection> <id>  Get a specific resource
  create <collection> [data]  Create a new resource
  update <collection> <id> [data]  Update a resource
  delete <collection> <id>  Delete a resource
  execute <functionId> [inputs]  Execute a function

Options:
  --help, -h          Show this help message
  --version, -v       Show version information

Environment Variables:
  APIS_DO_API_KEY     API key for authentication
  DO_API_KEY          Alternative API key for authentication
`)
  }

  return (
    <Box flexDirection="column" padding={1}>
      {loading && <Text>Loading...</Text>}
      {error && <Text color="red">{error}</Text>}
      {output && <Text>{output}</Text>}
    </Box>
  )
}
