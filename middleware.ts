import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { checkProfileCompletion } from '@/lib/profile-check'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => 
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get authenticated user from Supabase (server-side method)
  let user = null
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser || null
  } catch (error) {
    console.error('Failed to get user:', error)
  }

  const publicRoutes = [
    '/login',
    '/signup',
    '/verify-email',
    '/auth/callback',
    '/auth/confirm',
    '/auth/auth-code-error',
    '/error',
    '/terms',
    '/privacy-policy',
  ]

  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Allow access to public routes and static files
  if (
    isPublicRoute || 
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return supabaseResponse
  }

  // Redirect to login if not authenticated
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Check if user is an employer and has completed profile
  if (user) {
    try {
      const { data: employerData, error } = await supabase
        .from('employer')
        .select('*')
        .eq('auth_user_id', user.id)
        .maybeSingle()

      if (error || !employerData) {
        // User is authenticated but not an employer
        await supabase.auth.signOut()
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('error', 'not_employer')
        return NextResponse.redirect(url)
      }

      // Check if profile is complete using utility function
      const isProfileComplete = await checkProfileCompletion(user.id)

      // If accessing dashboard but profile not complete, redirect to profile
      if (!isProfileComplete && request.nextUrl.pathname.startsWith('/dashboard')) {
        const url = request.nextUrl.clone()
        url.pathname = '/profile'
        return NextResponse.redirect(url)
      }

      // If accessing profile but already complete, redirect to dashboard
      if (isProfileComplete && request.nextUrl.pathname === '/profile') {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error('Middleware error:', error)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}