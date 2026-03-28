import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, CheckCircle2, Clock, Download, CreditCard } from "lucide-react"

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

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, projects(project_name, project_type)")
    .eq("id", id)
    .eq("user_id", user?.id)
    .single()

  if (!invoice) {
    notFound()
  }

  const isPaid = invoice.status === "paid"

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link 
        href="/dashboard/invoices" 
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
          {/* Project Info */}
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Project</p>
            <p className="font-semibold">{invoice.projects?.project_name}</p>
            <p className="text-sm text-muted-foreground capitalize">
              {invoice.projects?.project_type?.replace("_", " ")}
            </p>
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

          {/* Payment Info for unpaid */}
          {!isPaid && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
              <h4 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Informasi Pembayaran</h4>
              <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>Bank BCA: 1234567890 a.n. CuanPage</p>
                <p>Bank Mandiri: 0987654321 a.n. CuanPage</p>
              </div>
              <p className="text-xs mt-3 text-yellow-600 dark:text-yellow-400">
                Setelah transfer, konfirmasi pembayaran via WhatsApp
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!isPaid && (
              <Button className="flex-1 rounded-full gap-2 bg-foreground text-background hover:bg-foreground/90">
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <CreditCard className="size-4" />
                  Konfirmasi Pembayaran
                </a>
              </Button>
            )}
            <Button variant="outline" className="flex-1 rounded-full gap-2">
              <Download className="size-4" />
              Download Invoice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
