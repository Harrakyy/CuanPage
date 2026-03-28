import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
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

  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.user_metadata?.is_admin === true
  const { pathname } = request.nextUrl

  // DEBUG - hapus setelah masalah selesai
  console.log('🔍 PATH:', pathname)
  console.log('👤 USER:', user?.email ?? 'null')
  console.log('🔑 IS_ADMIN:', isAdmin)

  // Protect client dashboard
  if (pathname.startsWith('/client') && !user) {
    console.log('→ redirect: /client no user → /auth/login')
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Protect admin routes (kecuali /admin-login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin-login') && !user) {
    console.log('→ redirect: /admin no user → /admin-login')
    const url = request.nextUrl.clone()
    url.pathname = '/admin-login'
    return NextResponse.redirect(url)
  }

  // User login tapi bukan admin coba akses /admin/*
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin-login') && user && !isAdmin) {
    console.log('→ redirect: /admin not admin → /client/dashboard')
    const url = request.nextUrl.clone()
    url.pathname = '/client/dashboard'
    return NextResponse.redirect(url)
  }

  // Sudah login, buka /admin-login
  if (pathname.startsWith('/admin-login') && user) {
    const target = isAdmin ? '/admin/dashboard' : '/client/dashboard'
    console.log('→ redirect: /admin-login already logged in →', target)
    const url = request.nextUrl.clone()
    url.pathname = target
    return NextResponse.redirect(url)
  }

  // Sudah login, buka /auth/login
  if (pathname.startsWith('/auth/login') && user) {
    console.log('→ redirect: /auth/login already logged in → /client/dashboard')
    const url = request.nextUrl.clone()
    url.pathname = '/client/dashboard'
    return NextResponse.redirect(url)
  }

  console.log('→ pass through')
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
