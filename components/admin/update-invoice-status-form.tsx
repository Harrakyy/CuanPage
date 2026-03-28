"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle2, Clock } from "lucide-react"

interface UpdateInvoiceStatusFormProps {
  invoiceId: string
  currentStatus: string
}

export function UpdateInvoiceStatusForm({ invoiceId, currentStatus }: UpdateInvoiceStatusFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleMarkAsPaid = async () => {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("invoices")
      .update({ 
        status: "paid", 
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      })
      .eq("id", invoiceId)

    if (!error) {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        router.refresh()
      }, 2000)
    }

    setLoading(false)
  }

  const handleMarkAsUnpaid = async () => {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("invoices")
      .update({ 
        status: "pending", 
        paid_at: null,
        updated_at: new Date().toISOString() 
      })
      .eq("id", invoiceId)

    if (!error) {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        router.refresh()
      }, 2000)
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
        <CheckCircle2 className="size-5" />
        <span>Status berhasil diupdate!</span>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-3">
      {currentStatus === "pending" ? (
        <Button
          onClick={handleMarkAsPaid}
          disabled={loading}
          className="rounded-full gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          {loading ? <Spinner className="size-4" /> : (
            <>
              <CheckCircle2 className="size-4" />
              Tandai Sudah Dibayar
            </>
          )}
        </Button>
      ) : (
        <Button
          onClick={handleMarkAsUnpaid}
          disabled={loading}
          variant="outline"
          className="rounded-full gap-2"
        >
          {loading ? <Spinner className="size-4" /> : (
            <>
              <Clock className="size-4" />
              Tandai Belum Dibayar
            </>
          )}
        </Button>
      )}
    </div>
  )
}
