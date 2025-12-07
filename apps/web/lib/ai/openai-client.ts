import OpenAI from 'openai'

// Lazy-load OpenAI client to allow builds without API key
let _openai: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Missing OPENAI_API_KEY environment variable')
    }
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return _openai
}

// For backward compatibility
export const openai = new Proxy({} as OpenAI, {
  get: (target, prop) => {
    return getOpenAIClient()[prop as keyof OpenAI]
  },
})

// Token usage tracking (to stay under $10 budget)
export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimatedCost: number
}

// Pricing for different models (per 1K tokens)
const PRICING = {
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
  'gpt-4o': { input: 0.005, output: 0.015 },
} as const

export type ModelName = keyof typeof PRICING

// Default model for quick-add (67% cheaper than GPT-3.5)
export const DEFAULT_MODEL: ModelName = 'gpt-4o-mini'

/**
 * Calculate cost in cents for a given model and token usage
 */
export function calculateCost(
  usage: { prompt_tokens: number; completion_tokens: number },
  model: ModelName = DEFAULT_MODEL
): number {
  const pricing = PRICING[model]
  const promptCost = (usage.prompt_tokens / 1000) * pricing.input
  const completionCost = (usage.completion_tokens / 1000) * pricing.output
  return (promptCost + completionCost) * 100 // Return cost in cents
}
