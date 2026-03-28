"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Plus, CheckCircle2 } from "lucide-react"

interface CreateInvoiceFormProps {
  projectId: string
  userId: string
  projectBudget: number
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function CreateInvoiceForm({ projectId, userId, projectBudget }: CreateInvoiceFormProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    amount: projectBudget.toString(),
    dueDate: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const generateInvoiceNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    return `INV-${year}${month}-${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { error: insertError } = await supabase.from("invoices").insert({
      project_id: projectId,
      user_id: userId,
      invoice_number: generateInvoiceNumber(),
      amount: parseInt(formData.amount),
      due_date: formData.dueDate || null,
      notes: formData.notes || null,
      status: "pending",
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => {
      setShowForm(false)
      setSuccess(false)
      setFormData({ amount: projectBudget.toString(), dueDate: "", notes: "" })
      router.refresh()
    }, 2000)
  }

  if (!showForm) {
    return (
      <Button
        onClick={() => setShowForm(true)}
        variant="outline"
        className="w-full rounded-full gap-2"
      >
        <Plus className="size-4" />
        Buat Invoice Baru
      </Button>
    )
  }

  if (success) {
    return (
      <div className="flex items-center justify-center gap-2 py-4 text-green-600 dark:text-green-400">
        <CheckCircle2 className="size-5" />
        <span>Invoice berhasil dibuat!</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-xl border border-border">
      <h4 className="font-semibold">Buat Invoice Baru</h4>
      
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="amount">Jumlah Tagihan (Rp)</FieldLabel>
          <Input
            id="amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Budget project: {formatCurrency(projectBudget)}
          </p>
        </Field>

        <Field>
          <FieldLabel htmlFor="dueDate">Jatuh Tempo (Opsional)</FieldLabel>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="notes">Catatan (Opsional)</FieldLabel>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Catatan tambahan untuk invoice..."
            value={formData.notes}
            onChange={handleChange}
            rows={3}
          />
        </Field>

        {error && <FieldError>{error}</FieldError>}

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            {loading ? <Spinner className="size-4" /> : "Buat Invoice"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowForm(false)}
            className="rounded-full"
          >
            Batal
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
