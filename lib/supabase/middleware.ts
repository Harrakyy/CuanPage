import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
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
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdmin = user?.user_metadata?.is_admin === true

  // Protect client dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Protect admin routes (kecuali /admin/login)
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login') &&
    !user
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  // Kalau sudah login tapi bukan admin, dan coba akses /admin/* → redirect ke client
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login') &&
    user &&
    !isAdmin
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/client/dashboard'
    return NextResponse.redirect(url)
  }

  // Kalau buka /admin/login:
  // - Sudah login sebagai admin → ke admin dashboard
  // - Sudah login tapi bukan admin → ke client dashboard
  if (request.nextUrl.pathname.startsWith('/admin/login') && user) {
    const url = request.nextUrl.clone()
    url.pathname = isAdmin ? '/admin/dashboard' : '/client/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
