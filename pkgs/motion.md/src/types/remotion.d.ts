declare module 'remotion' {
  export function bundle(options: { entryPoint: string; webpackOverride?: (config: any) => any }): Promise<{
    serveUrl: string
  }>

  export function renderMedia(options: {
    composition: {
      id: string
      durationInFrames: number
      fps: number
      width: number
      height: number
    }
    serveUrl: string
    codec: string
    outputLocation: string
    inputProps: any
    imageFormat: string
    quality: number
    fps: number
    dumpBrowserLogs?: boolean
  }): Promise<{
    sizeInBytes: number
  }>

  export function selectComposition(options: { serveUrl: string; id: string; inputProps: any }): Promise<{
    id: string
    durationInFrames: number
    fps: number
    width: number
    height: number
  }>

  export const Composition: React.FC<{
    id: string
    component: React.ComponentType<any>
    durationInFrames: number
    fps: number
    width: number
    height: number
    defaultProps?: any
  }>

  export const AbsoluteFill: React.FC<React.HTMLAttributes<HTMLDivElement>>

  export function useVideoConfig(): {
    width: number
    height: number
    fps: number
    durationInFrames: number
    compositionWidth: number
    compositionHeight: number
  }
}
