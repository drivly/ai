import { watch } from './file'

export const dev = async (glob: string) => {
  const watcher = await watch(glob, (event, path) => {
    console.log(event, path)
  })
}
