// Reusable AI API client — tries Perplexity first, falls back to OpenAI.
// Returns null on any failure so callers can use their own fallback.
export async function generateAIResponse(prompt: string): Promise<string | null> {
  const apiKey = process.env.PERPLEXITY_API_KEY ?? process.env.OPENAI_API_KEY
  const apiBase = process.env.PERPLEXITY_API_KEY
    ? 'https://api.perplexity.ai/chat/completions'
    : 'https://api.openai.com/v1/chat/completions'
  const model = process.env.PERPLEXITY_API_KEY ? 'sonar' : 'gpt-4o-mini'

  if (!apiKey) return null

  try {
    const response = await fetch(apiBase, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      console.error('AI API error:', response.status, await response.text())
      return null
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>
    }
    return data.choices[0]?.message?.content?.trim() ?? null
  } catch (error) {
    console.error('AI API fetch failed:', error)
    return null
  }
}
