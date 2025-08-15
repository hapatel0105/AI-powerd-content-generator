import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user ID from request headers (set by client)
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ message: 'User ID required' }, { status: 400 })
    }

    const contentId = params.id

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Delete content from Supabase (RLS will ensure user can only delete their own content)
    const { data: deletedContent, error: deleteError } = await supabase
      .from('content')
      .delete()
      .eq('id', contentId)
      .eq('user_id', userId)
      .select()
      .single()

    if (deleteError || !deletedContent) {
      return NextResponse.json({ message: 'Content not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Content deleted successfully' })

  } catch (error) {
    console.error('Content deletion error:', error)
    return NextResponse.json({ message: 'Failed to delete content' }, { status: 500 })
  }
}
