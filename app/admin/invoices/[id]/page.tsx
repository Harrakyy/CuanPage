import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, CheckCircle2, Clock, User, FolderOpen } from "lucide-react"
import { UpdateInvoiceStatusForm } from "@/components/admin/update-invoice-status-form"

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

export default async function AdminInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, projects(id, project_name, project_type), profiles(full_name, phone)")
    .eq("id", id)
    .single()

  if (!invoice) {
    notFound()
  }

  const isPaid = invoice.status === "paid"

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link 
        href="/admin/invoices" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Kembali ke Invoices
      </Link>

      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Invoice</CardTitle>
              <p className="text-muted-foreground">{invoice.invoice_number}</p>
            </div>
            <Badge className={isPaid 
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 gap-1 text-sm px-3 py-1"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 gap-1 text-sm px-3 py-1"
            }>
              {isPaid ? (
                <><CheckCircle2 className="size-4" /> Lunas</>
              ) : (
                <><Clock className="size-4" /> Belum Bayar</>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Client Info */}
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-2 text-sm mb-2">
              <User className="size-4 text-muted-foreground" />
              <span className="font-medium">{invoice.profiles?.full_name || "Unknown"}</span>
            </div>
            <Link 
              href={`/admin/projects/${invoice.projects?.id}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <FolderOpen className="size-4" />
              {invoice.projects?.project_name}
            </Link>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tanggal Invoice</p>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                {formatDate(invoice.created_at)}
              </p>
            </div>
            {invoice.due_date && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Jatuh Tempo</p>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  {formatDate(invoice.due_date)}
                </p>
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="border-t border-b border-border py-4">
            <div className="flex items-center justify-between">
              <span className="text-lg">Total Tagihan</span>
              <span className="text-2xl font-bold">{formatCurrency(invoice.amount)}</span>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Catatan</p>
              <p className="text-sm bg-muted p-3 rounded-lg">{invoice.notes}</p>
            </div>
          )}

          {/* Update Status */}
          <div className="pt-4 border-t border-border">
            <h4 className="font-semibold mb-3">Update Status Pembayaran</h4>
            <UpdateInvoiceStatusForm invoiceId={invoice.id} currentStatus={invoice.status} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
