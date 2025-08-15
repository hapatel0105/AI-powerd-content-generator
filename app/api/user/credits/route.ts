import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from request headers
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ message: 'User ID required' }, { status: 400 })
    }

    // Get Supabase admin client
    const supabase = createAdminClient()

    // Fetch user credits
    const { data: user, error } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ credits: user.credits })
  } catch (error) {
    console.error('Error fetching user credits:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
