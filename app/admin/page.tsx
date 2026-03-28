import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FolderOpen, Receipt, Users, TrendingUp, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: "Menunggu", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
  in_progress: { label: "Dikerjakan", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: AlertCircle },
  review: { label: "Review", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", icon: AlertCircle },
  completed: { label: "Selesai", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
  cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: AlertCircle },
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Get stats
  const { count: totalProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })

  const { count: pendingProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .in("status", ["pending", "in_progress", "review"])

  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })

  const { data: revenueData } = await supabase
    .from("invoices")
    .select("amount")
    .eq("status", "paid")

  const totalRevenue = revenueData?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0

  // Get recent projects
  const { data: recentProjects } = await supabase
    .from("projects")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(5)

  // Get pending invoices
  const { data: pendingInvoices } = await supabase
    .from("invoices")
    .select("*, projects(project_name), profiles(full_name)")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Kelola semua project dan invoice di sini</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FolderOpen className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalProjects || 0}</p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Clock className="size-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingProjects || 0}</p>
                <p className="text-sm text-muted-foreground">Dalam Proses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="size-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalUsers || 0}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="size-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Projects Terbaru</CardTitle>
              <CardDescription>Project yang baru masuk</CardDescription>
            </div>
            <Link href="/admin/projects">
              <Button variant="ghost" size="sm" className="gap-1">
                Lihat Semua <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentProjects && recentProjects.length > 0 ? (
              <div className="space-y-3">
                {recentProjects.map((project) => {
                  const status = statusConfig[project.status] || statusConfig.pending
                  const StatusIcon = status.icon
                  return (
                    <Link
                      key={project.id}
                      href={`/admin/projects/${project.id}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-foreground/20 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm">{project.project_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {project.profiles?.full_name || "Unknown"} - {formatDate(project.created_at)}
                        </p>
                      </div>
                      <Badge className={`${status.color} gap-1`}>
                        <StatusIcon className="size-3" />
                        {status.label}
                      </Badge>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">Belum ada project</p>
            )}
          </CardContent>
        </Card>

        {/* Pending Invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Invoice Belum Dibayar</CardTitle>
              <CardDescription>Invoice yang menunggu pembayaran</CardDescription>
            </div>
            <Link href="/admin/invoices">
              <Button variant="ghost" size="sm" className="gap-1">
                Lihat Semua <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {pendingInvoices && pendingInvoices.length > 0 ? (
              <div className="space-y-3">
                {pendingInvoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/admin/invoices/${invoice.id}`}
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-foreground/20 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{invoice.invoice_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {invoice.profiles?.full_name || "Unknown"} - {invoice.projects?.project_name}
                      </p>
                    </div>
                    <span className="font-semibold text-sm">{formatCurrency(invoice.amount)}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">Tidak ada invoice pending</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
