import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin/admin-nav"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  redirect("/admin/login")
}

  // Check if admin
  if (user.user_metadata?.is_admin !== true) {
    redirect("/client/dashboard")  // ← fix ini
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={user} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
