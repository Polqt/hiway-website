import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const provider = formData.get('provider') as 'google' | 'facebook'

    if (!provider || !['google', 'facebook'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const origin = (await headers()).get('origin') || request.headers.get('origin')

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback?next=/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    })

    if (error) {
      console.error('OAuth error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (data.url) {
      return NextResponse.json({ url: data.url })
    }

    return NextResponse.json(
      { error: 'Failed to initialize OAuth' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Unexpected OAuth error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}