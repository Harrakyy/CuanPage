import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, Receipt } from "lucide-react"
import { UpdateProjectStatusForm } from "@/components/admin/update-project-status-form"
import { CreateInvoiceForm } from "@/components/admin/create-invoice-form"

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Menunggu Konfirmasi", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  in_progress: { label: "Sedang Dikerjakan", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  review: { label: "Review & Testing", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  completed: { label: "Selesai", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
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

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from("projects")
    .select("*, profiles(full_name, phone)")
    .eq("id", id)
    .single()

  if (!project) {
    notFound()
  }

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false })

  // Get user email from auth
  const { data: authUser } = await supabase.auth.admin.getUserById(project.user_id)

  const status = statusConfig[project.status] || statusConfig.pending

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link 
        href="/admin/projects" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Kembali ke Projects
      </Link>

      {/* Project Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{project.project_name}</h1>
                <Badge className={status.color}>
                  {status.label}
                </Badge>
              </div>
              <p className="text-muted-foreground capitalize">
                {project.project_type?.replace("_", " ")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{formatCurrency(project.budget || 0)}</p>
              <p className="text-sm text-muted-foreground">Budget</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Client Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Klien</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="size-4 text-muted-foreground" />
              <span>{project.profiles?.full_name || "Unknown"}</span>
            </div>
            {project.profiles?.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="size-4 text-muted-foreground" />
                <a href={`https://wa.me/${project.profiles.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">
                  {project.profiles.phone}
                </a>
              </div>
            )}
            {authUser?.user?.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                <a href={`mailto:${authUser.user.email}`} className="text-foreground hover:underline">
                  {authUser.user.email}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detail Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Tanggal Pesan:</span>
              <span className="font-medium">{formatDate(project.created_at)}</span>
            </div>
            {project.deadline && (
              <div className="flex items-center gap-3 text-sm">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Target Deadline:</span>
                <span className="font-medium">{formatDate(project.deadline)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {project.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Deskripsi Project</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{project.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Update Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Update Status</CardTitle>
          <CardDescription>Ubah status project untuk memberitahu klien</CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateProjectStatusForm projectId={project.id} currentStatus={project.status} />
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invoice</CardTitle>
          <CardDescription>Kelola tagihan untuk project ini</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {invoices && invoices.length > 0 ? (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <Link
                  key={invoice.id}
                  href={`/admin/invoices/${invoice.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-foreground/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Receipt className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{invoice.invoice_number}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(invoice.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(invoice.amount)}</p>
                    <Badge className={invoice.status === "paid" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    } variant="outline">
                      {invoice.status === "paid" ? "Lunas" : "Belum Bayar"}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Belum ada invoice</p>
          )}

          <div className="pt-4 border-t border-border">
            <CreateInvoiceForm projectId={project.id} userId={project.user_id} projectBudget={project.budget || 0} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
