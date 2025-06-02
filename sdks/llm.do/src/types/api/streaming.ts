export type DataUsageFrame = {
  timeToComplete: number;
  cachedInputTokens: number;
  inputTokens: number;
  outputTokens: number;
  reasoningTokens: number;
  totalTokens: number;
  tokensPerSecond: number;
}