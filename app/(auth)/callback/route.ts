import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const verified = searchParams.get('verified')
  let next = searchParams.get('next') ?? '/dashboard'

  // Ensure next path is safe
  if (!next.startsWith('/')) {
    next = '/dashboard'
  }

  if (!code && verified === 'true') {
    return NextResponse.redirect('/login?verified=true')
  }

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // If this is from email verification, redirect to login
      if (verified === 'true') {
        return NextResponse.redirect('/login?verified=true')
      }

      // Check if employer record exists
      const { data: employerData, error: employerError } = await supabase
        .from('employer')
        .select('employer_id, auth_user_id')
        .eq('auth_user_id', data.user.id)
        .maybeSingle()

      // If no employer record exists, create one
      if (!employerData && !employerError) {
        const { error: insertError } = await supabase
          .from('employer')
          .insert({
            auth_user_id: data.user.id,
            company_email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || null,
          })

        if (insertError) {
          console.error('Error creating employer record:', insertError)
          return NextResponse.redirect(`${origin}/auth/auth-code-error?reason=employer_creation_failed`)
        }
      } else if (employerError) {
        console.error('Error checking employer:', employerError)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?reason=employer_check_failed`)
      }

      // Determine the correct redirect URL
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      console.error('Auth exchange error:', error)
    }
  }

  // If we get here, something went wrong
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
