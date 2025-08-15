import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from request headers (set by client)
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ message: 'User ID required' }, { status: 400 })
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Fetch content from Supabase
    const { data: content, error: contentError } = await supabase
      .from('content')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (contentError) {
      console.error('Error fetching content history:', contentError)
      return NextResponse.json({ message: 'Failed to fetch content history' }, { status: 500 })
    }

    return NextResponse.json({ 
      content: content || [], 
      count: content?.length || 0 
    })

  } catch (error) {
    console.error('Content history error:', error)
    return NextResponse.json({ message: 'Failed to fetch content history' }, { status: 500 })
  }
}
