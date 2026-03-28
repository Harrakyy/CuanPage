"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle2 } from "lucide-react"

const statuses = [
  { id: "pending", label: "Menunggu Konfirmasi" },
  { id: "in_progress", label: "Sedang Dikerjakan" },
  { id: "review", label: "Review & Testing" },
  { id: "completed", label: "Selesai" },
  { id: "cancelled", label: "Dibatalkan" },
]

interface UpdateProjectStatusFormProps {
  projectId: string
  currentStatus: string
}

export function UpdateProjectStatusForm({ projectId, currentStatus }: UpdateProjectStatusFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleUpdate = async () => {
    if (status === currentStatus) return

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("projects")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", projectId)

    if (!error) {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        router.refresh()
      }, 2000)
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {statuses.map((s) => (
          <button
            key={s.id}
            onClick={() => setStatus(s.id)}
            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
              status === s.id
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-foreground/30"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleUpdate}
          disabled={loading || status === currentStatus}
          className="rounded-full bg-foreground text-background hover:bg-foreground/90"
        >
          {loading ? <Spinner className="size-4" /> : "Update Status"}
        </Button>

        {success && (
          <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="size-4" />
            Status berhasil diupdate
          </span>
        )}
      </div>
    </div>
  )
}
