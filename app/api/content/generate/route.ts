import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function POST(request: NextRequest) {
  try {
    // Get user ID from request headers (set by client)
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ message: 'User ID required' }, { status: 400 })
    }

    const { contentType, topic, tone, length, additionalContext } = await request.json()

    // Validate required fields
    if (!contentType || !topic || !tone || !length) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Calculate content cost
    const cost = getContentCost(length)
    
    // Create Supabase admin client to bypass RLS
    const supabase = createAdminClient()
    
    // Check if user has enough credits
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      console.error('User lookup error:', userError)
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (userData.credits < cost) {
      return NextResponse.json({ message: 'Insufficient credits' }, { status: 400 })
    }

    // Generate content using OpenRouter
    const prompt = generatePrompt(contentType, topic, tone, length, additionalContext)
    
    const openrouterRes = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo', // You can make this dynamic if you want
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional content writer. Generate high-quality, engaging content based on the user\'s requirements.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        max_tokens: getMaxTokens(length),
        temperature: 0.7,
      })
    })

    if (!openrouterRes.ok) {
      const error = await openrouterRes.json()
      console.error('OpenRouter API error:', error)
      return NextResponse.json(
        { message: 'Failed to generate content' },
        { status: 500 }
      )
    }

    const openrouterData = await openrouterRes.json()
    const generatedContent = openrouterData.choices?.[0]?.message?.content || ''
    
    if (!generatedContent) {
      return NextResponse.json({ message: 'Failed to generate content' }, { status: 500 })
    }

    // Save content to Supabase
    const { data: contentData, error: contentError } = await supabase
      .from('content')
      .insert({
        user_id: userId,
        content_type: contentType,
        topic,
        content: generatedContent,
        cost,
        metadata: {
          tone,
          length,
          additional_context: additionalContext
        }
      })
      .select()
      .single()

    if (contentError) {
      console.error('Error saving content:', contentError)
      return NextResponse.json({ message: 'Failed to save content' }, { status: 500 })
    }

    // Deduct credits from user
    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: userData.credits - cost })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating credits:', updateError)
      // Content was saved but credits weren't deducted - this is a problem
      return NextResponse.json({ message: 'Content generated but credit deduction failed' }, { status: 500 })
    }

    return NextResponse.json({
      content: generatedContent,
      cost,
      remainingCredits: userData.credits - cost,
      contentId: contentData.id
    })

  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

function generatePrompt(contentType: string, topic: string, tone: string, length: string, additionalContext?: string): string {
  const lengthDescriptions = {
    short: '100-200 words',
    medium: '300-500 words',
    long: '600-1000 words',
    extended: '1000+ words'
  }

  let prompt = `Create a ${tone} ${contentType} about "${topic}". The content should be ${lengthDescriptions[length as keyof typeof lengthDescriptions]}.`
  
  if (additionalContext) {
    prompt += `\n\nAdditional context: ${additionalContext}`
  }

  prompt += `\n\nMake sure the content is engaging, well-structured, and appropriate for the specified tone and length.`

  return prompt
}

function getMaxTokens(length: string): number {
  const tokenMap: { [key: string]: number } = {
    short: 300,
    medium: 600,
    long: 1200,
    extended: 2000
  }
  return tokenMap[length] || 600
}

function getContentCost(length: string): number {
  const costMap: { [key: string]: number } = {
    short: 1,
    medium: 2,
    long: 3,
    extended: 4
  }
  return costMap[length] || 1
}
