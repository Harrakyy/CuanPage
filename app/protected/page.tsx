'use client'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

export default function DashboardRoot() {
  useEffect(() => {
    const checkAdminAndRedirect = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        redirect('/auth/login')
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (profile?.is_admin) {
        redirect('/admin/dashboard')
      } else {
        redirect('/client/dashboard')
      }
    }

    checkAdminAndRedirect()
  }, [])

  return <div>Redirecting...</div>
}
