import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Phone, Mail } from "lucide-react"

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  // Get project counts for each user
  const userProjectCounts: Record<string, number> = {}
  if (profiles) {
    for (const profile of profiles) {
      const { count } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("user_id", profile.id)
      userProjectCounts[profile.id] = count || 0
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Semua Users</h1>
        <p className="text-muted-foreground">Daftar semua klien yang terdaftar</p>
      </div>

      {profiles && profiles.length > 0 ? (
        <div className="grid gap-4">
          {profiles.map((profile) => (
            <Card key={profile.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="size-14 rounded-full bg-muted flex items-center justify-center shrink-0 text-xl font-bold">
                    {profile.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <h3 className="font-semibold">{profile.full_name || "Unknown"}</h3>
                      {profile.is_admin && (
                        <Badge className="bg-foreground text-background w-fit">Admin</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {profile.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="size-4" />
                          {profile.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        Bergabung {formatDate(profile.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{userProjectCounts[profile.id] || 0}</p>
                    <p className="text-sm text-muted-foreground">Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Users className="size-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Users</h3>
            <p className="text-muted-foreground">Users akan muncul di sini setelah mendaftar</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
