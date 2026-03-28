import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FolderOpen, Plus, Clock, CheckCircle2, AlertCircle, Calendar } from "lucide-react"
import Link from "next/link"

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: "Menunggu", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
  in_progress: { label: "Dikerjakan", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: AlertCircle },
  review: { label: "Review", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", icon: AlertCircle },
  completed: { label: "Selesai", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
  cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: AlertCircle },
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projects Saya</h1>
          <p className="text-muted-foreground">Kelola dan pantau semua project Anda</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="rounded-full gap-2 bg-foreground text-background hover:bg-foreground/90">
            <Plus className="size-4" />
            Pesan Project Baru
          </Button>
        </Link>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-4">
          {projects.map((project) => {
            const status = statusConfig[project.status] || statusConfig.pending
            const StatusIcon = status.icon
            return (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <Card className="hover:border-foreground/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="size-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        <FolderOpen className="size-7 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{project.project_name}</h3>
                          <Badge className={`${status.color} gap-1 w-fit`}>
                            <StatusIcon className="size-3" />
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground capitalize mb-2">
                          {project.project_type?.replace("_", " ")}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            {formatDate(project.created_at)}
                          </span>
                          {project.budget && (
                            <span className="font-medium text-foreground">
                              {formatCurrency(project.budget)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <FolderOpen className="size-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Project</h3>
            <p className="text-muted-foreground mb-6">
              Mulai pesan project pertama Anda sekarang
            </p>
            <Link href="/dashboard/projects/new">
              <Button className="rounded-full gap-2 bg-foreground text-background hover:bg-foreground/90">
                <Plus className="size-4" />
                Pesan Project Baru
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
