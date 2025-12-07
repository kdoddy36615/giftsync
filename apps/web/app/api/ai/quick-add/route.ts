import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { openai, calculateCost, DEFAULT_MODEL } from '@/lib/ai/openai-client'
import {
  getCachedResponse,
  setCachedResponse,
  isWithinBudget,
  trackUsage,
} from '@/lib/ai/cache'
import { createLogger } from '@/lib/utils/logger'
import type { QuickAddResult, QuickAddData } from '@/types/ai'

const log = createLogger('AI Quick Add')

export const runtime = 'nodejs'

interface QuickAddRequest {
  itemName: string
  recipientContext?: string
}

export async function POST(request: Request): Promise<Response> {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json<QuickAddResult>(
        { success: false, error: 'Unauthorized', code: 'INVALID_INPUT' },
        { status: 401 }
      )
    }

    // Parse request
    const body: QuickAddRequest = await request.json()
    const { itemName, recipientContext } = body

    // Validation
    if (!itemName || itemName.trim().length < 3) {
      return NextResponse.json<QuickAddResult>(
        {
          success: false,
          error: 'Item name must be at least 3 characters',
          code: 'INVALID_INPUT',
        },
        { status: 400 }
      )
    }

    if (itemName.length > 500) {
      return NextResponse.json<QuickAddResult>(
        {
          success: false,
          error: 'Item name too long (max 500 characters)',
          code: 'INVALID_INPUT',
        },
        { status: 400 }
      )
    }

    // Check budget
    const withinBudget = await isWithinBudget(user.id)
    if (!withinBudget) {
      return NextResponse.json<QuickAddResult>(
        {
          success: false,
          error:
            'Monthly AI budget exceeded ($10/month). Use manual entry or try again next month.',
          code: 'BUDGET_EXCEEDED',
        },
        { status: 429 }
      )
    }

    // Check cache
    const query = recipientContext
      ? `${itemName} | ${recipientContext}`
      : itemName
    const cached = await getCachedResponse(query)

    if (cached) {
      return NextResponse.json<QuickAddResult>({
        success: true,
        data: cached,
        cached: true,
      })
    }

    // Build improved prompt with search URLs and image keywords
    const systemPrompt = `You are a gift shopping research assistant. Given a product name, provide shopping information using SEARCH URLs only.

CRITICAL RULES:
1. Generate SEARCH URLs, NOT direct product links
   Format: https://www.amazon.com/s?k={product+name+url+encoded}
2. Estimate realistic prices based on your knowledge (be conservative)
3. Always include Amazon, Walmart, and Target
4. Add 1-2 specialty retailers if relevant
5. Mark cheapest option as isBestPrice: true
6. Mark premium options as isHighend: true
7. Suggest if item is "required" or "optional" based on context
8. Generate imageKeywords with specific product name, brand (if identifiable), and type for finding accurate product images

Respond with ONLY valid JSON. No markdown, no explanations.`

    const userPrompt = recipientContext
      ? `Find shopping options for: "${itemName}"
Context: Gift for ${recipientContext}

Return JSON:
{
  "description": "Brief 1-2 sentence product description",
  "priceRange": { "low": number, "high": number },
  "suggestedStatus": "required" | "optional",
  "imageKeywords": "specific product name brand type for image search",
  "retailers": [
    {
      "storeName": "Amazon",
      "searchUrl": "https://www.amazon.com/s?k=product+name",
      "estimatedPrice": number,
      "isBestPrice": boolean,
      "isHighend": boolean
    }
  ]
}`
      : `Find shopping options for: "${itemName}"

Return JSON:
{
  "description": "Brief 1-2 sentence product description",
  "priceRange": { "low": number, "high": number },
  "suggestedStatus": "required" | "optional",
  "imageKeywords": "specific product name brand type for image search",
  "retailers": [
    {
      "storeName": "Amazon",
      "searchUrl": "https://www.amazon.com/s?k=product+name",
      "estimatedPrice": number,
      "isBestPrice": boolean,
      "isHighend": boolean
    }
  ]
}`

    // Call OpenAI with GPT-4o-mini
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      max_tokens: 800,
      temperature: 0.3, // Lower for more consistent results
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0].message.content
    if (!content) {
      return NextResponse.json<QuickAddResult>(
        { success: false, error: 'No response from AI', code: 'AI_FAILURE' },
        { status: 500 }
      )
    }

    // Parse and validate response
    let parsedData: QuickAddData
    try {
      const rawData = JSON.parse(content)

      // Basic validation
      if (
        !rawData.description ||
        !rawData.priceRange ||
        !Array.isArray(rawData.retailers) ||
        rawData.retailers.length === 0
      ) {
        throw new Error('Invalid AI response structure')
      }

      // Generate Google Images search URL from imageKeywords
      const imageKeywords = rawData.imageKeywords || itemName
      const imageSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(imageKeywords)}`

      parsedData = {
        ...rawData,
        imageKeywords,
        imageSearchUrl,
      }
    } catch (parseError) {
      log.error('Failed to parse AI response', parseError, { content })
      return NextResponse.json<QuickAddResult>(
        {
          success: false,
          error: 'AI returned invalid data. Please try again.',
          code: 'AI_FAILURE',
        },
        { status: 500 }
      )
    }

    // Track usage
    if (completion.usage) {
      const costCents = calculateCost(completion.usage, DEFAULT_MODEL)
      await trackUsage(user.id, completion.usage.total_tokens, Math.round(costCents))

      log.info('Request completed', {
        tokens: completion.usage.total_tokens,
        cost: `$${(costCents / 100).toFixed(4)}`,
        userId: user.id,
      })
    }

    // Cache the response
    await setCachedResponse(query, parsedData)

    return NextResponse.json<QuickAddResult>({
      success: true,
      data: parsedData,
      cached: false,
      usage: completion.usage,
    })
  } catch (error) {
    log.error('Request failed', error)

    return NextResponse.json<QuickAddResult>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process request',
        code: 'UNKNOWN',
      },
      { status: 500 }
    )
  }
}
