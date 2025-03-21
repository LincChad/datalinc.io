import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Create a response object to modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => 
            request.cookies.set({ name, value })
          )
          
          // Create a new response with updated cookies
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          
          // Set the cookies in the response
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set({ name, value, ...options })
          )
        },
      },
    }
  )

  // This will refresh the session if it exists and is expired
  await supabase.auth.getSession()
  const { data: userData } = await supabase.auth.getUser()
  
  console.log('Middleware session check:', {
    hasUser: !!userData.user,
    userId: userData.user?.id,
    userEmail: userData.user?.email
  })

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!userData.user) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (userData.user && (
    request.nextUrl.pathname.startsWith('/sign-in') ||
    request.nextUrl.pathname.startsWith('/sign-up')
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}