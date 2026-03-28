import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, CheckCircle2, AlertCircle, FileText, Receipt } from "lucide-react"

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }>; step: number }> = {
  pending: { label: "Menunggu Konfirmasi", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock, step: 1 },
  in_progress: { label: "Sedang Dikerjakan", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: AlertCircle, step: 2 },
  review: { label: "Review & Testing", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", icon: AlertCircle, step: 3 },
  completed: { label: "Selesai", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2, step: 4 },
  cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: AlertCircle, step: 0 },
}

const progressSteps = [
  { step: 1, label: "Konfirmasi" },
  { step: 2, label: "Pengerjaan" },
  { step: 3, label: "Review" },
  { step: 4, label: "Selesai" },
]

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

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user?.id)
    .single()

  if (!project) {
    notFound()
  }

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false })

  const status = statusConfig[project.status] || statusConfig.pending
  const StatusIcon = status.icon
  const currentStep = status.step

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link 
        href="/dashboard/projects" 
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
                <Badge className={`${status.color} gap-1`}>
                  <StatusIcon className="size-3" />
                  {status.label}
                </Badge>
              </div>
              <p className="text-muted-foreground capitalize">
                {project.project_type?.replace("_", " ")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{formatCurrency(project.budget || 0)}</p>
              <p className="text-sm text-muted-foreground">Total Budget</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracker */}
      {project.status !== "cancelled" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progress Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {progressSteps.map((step, index) => (
                <div key={step.step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`size-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      currentStep >= step.step
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {currentStep > step.step ? (
                        <CheckCircle2 className="size-5" />
                      ) : (
                        step.step
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${
                      currentStep >= step.step ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${
                      currentStep > step.step ? "bg-foreground" : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detail Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            {project.description && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Deskripsi:</p>
                <p className="text-sm bg-muted p-3 rounded-lg">{project.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Invoice</CardTitle>
            <CardDescription>Daftar tagihan untuk project ini</CardDescription>
          </CardHeader>
          <CardContent>
            {invoices && invoices.length > 0 ? (
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/dashboard/invoices/${invoice.id}`}
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
              <div className="text-center py-6">
                <Receipt className="size-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Belum ada invoice</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact Support */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1">Butuh Bantuan?</h3>
              <p className="text-sm text-muted-foreground">
                Hubungi tim kami jika ada pertanyaan tentang project ini
              </p>
            </div>
            <Button className="rounded-full gap-2" variant="outline">
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <FileText className="size-4" />
                Hubungi via WhatsApp
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
