import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Receipt, Calendar, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"

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

export default async function InvoicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, projects(project_name, project_type)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Invoice Saya</h1>
        <p className="text-muted-foreground">Daftar semua tagihan pembayaran</p>
      </div>

      {invoices && invoices.length > 0 ? (
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <Link key={invoice.id} href={`/dashboard/invoices/${invoice.id}`}>
              <Card className="hover:border-foreground/20 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="size-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Receipt className="size-7 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h3 className="font-semibold">{invoice.invoice_number}</h3>
                        <Badge className={invoice.status === "paid" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 gap-1 w-fit"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 gap-1 w-fit"
                        }>
                          {invoice.status === "paid" ? (
                            <><CheckCircle2 className="size-3" /> Lunas</>
                          ) : (
                            <><Clock className="size-3" /> Belum Bayar</>
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {invoice.projects?.project_name}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-4" />
                          {formatDate(invoice.created_at)}
                        </span>
                        {invoice.due_date && (
                          <span>
                            Jatuh tempo: {formatDate(invoice.due_date)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{formatCurrency(invoice.amount)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Receipt className="size-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Invoice</h3>
            <p className="text-muted-foreground">
              Invoice akan muncul setelah Anda memesan project
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
