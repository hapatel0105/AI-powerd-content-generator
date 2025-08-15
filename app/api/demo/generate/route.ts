import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function POST(request: NextRequest) {
  try {
    const { contentType, topic, tone } = await request.json()

    // Validate input
    if (!contentType || !topic || !tone) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate prompt
    const prompt = generatePrompt(contentType, topic, tone)

    // Call OpenRouter API
    const openrouterRes = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo', // You can make this dynamic if you want
        messages: [
          { role: 'system', content: 'You are a professional content writer. Generate high-quality, engaging content based on the user\'s requirements. Keep the content concise and engaging.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7,
      })
    })
    if (!openrouterRes.ok) {
      const error = await openrouterRes.json()
      console.error('OpenRouter API error:', error)
      return NextResponse.json(
        { message: 'Failed to generate content', error },
        { status: 500 }
      )
    }
    const openrouterData = await openrouterRes.json()
    const generatedContent = openrouterData.choices?.[0]?.message?.content || ''

    if (!generatedContent) {
      return NextResponse.json(
        { message: 'Failed to generate content' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      content: generatedContent,
      message: `Demo content generated successfully (openrouter)`,
    })
  } catch (error) {
    console.error('Demo content generation error:', error)
    return NextResponse.json(
      { message: 'Failed to generate demo content', error: String(error) },
      { status: 500 }
    )
  }
}

function generatePrompt(contentType: string, topic: string, tone: string) {
  return `Create a ${contentType} about "${topic}" with a ${tone} tone. The content should be engaging, well-structured, and appropriate for the specified content type and tone. Keep it concise and impactful.`
}
