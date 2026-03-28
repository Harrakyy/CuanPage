"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CheckCircle2, X, AlertCircle } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface ProjectOrderFormProps {
  onClose?: () => void
}

export function ProjectOrderForm({ onClose }: ProjectOrderFormProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    description: "",
    budgetRange: "",
  })

  useEffect(() => {
    const supabase = createClient()
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      // Pre-fill user data if logged in
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email, whatsapp')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          setFormData(prev => ({
            ...prev,
            fullName: profile.full_name || "",
            email: profile.email || "",
            whatsapp: profile.whatsapp || "",
          }))
        }
      }
    }
    getUser()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (!formData.budgetRange) {
      setError("Pilih range budget terlebih dahulu")
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { error: insertError } = await supabase.from("projects").insert({
      user_id: user.id,
      full_name: formData.fullName,
      email: formData.email,
      whatsapp: formData.whatsapp,
      description: formData.description,
      budget_range: formData.budgetRange,
      status: "pending",
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <Card className="border-border">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto mb-4 size-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Pesanan Berhasil Dibuat!</h3>
          <p className="text-muted-foreground mb-6">
            Kami akan menghubungi Anda segera melalui WhatsApp atau email untuk diskusi lebih lanjut.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => router.push("/client/dashboard")}
              className="rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              Lihat Dashboard
            </Button>
            {onClose && (
              <Button variant="outline" onClick={onClose} className="rounded-full">
                Tutup
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="border-border">
        <CardHeader className="text-center">
          <CardTitle>Pesan Project</CardTitle>
          <CardDescription>
            Silakan login terlebih dahulu untuk memesan project
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button 
            onClick={() => router.push("/auth/login")}
            className="rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            Masuk
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push("/auth/signup")}
            className="rounded-full"
          >
            Daftar Akun Baru
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border relative">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-5" />
        </button>
      )}
      <CardHeader>
        <CardTitle>Buat Pesanan Baru</CardTitle>
        <CardDescription>
          Jelaskan kebutuhan website Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Nama Anda"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              placeholder="+62 8xx xxxx xxxx"
              value={formData.whatsapp}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi Proyek</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Jelaskan kebutuhan website Anda, fitur yang diperlukan, dan target audiens..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="budgetRange">Range Budget</Label>
            <select
              id="budgetRange"
              name="budgetRange"
              value={formData.budgetRange}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Pilih range budget</option>
              <option value="1-5jt">Rp 1 - 5 Juta</option>
              <option value="5-10jt">Rp 5 - 10 Juta</option>
              <option value="10-20jt">Rp 10 - 20 Juta</option>
              <option value="20jt+">Rp 20+ Juta</option>
            </select>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="flex gap-3 flex-col sm:flex-row">
            <Button 
              type="submit" 
              className="flex-1 rounded-full bg-foreground text-background hover:bg-foreground/90"
              disabled={loading}
            >
              {loading ? "Mengirim..." : "Kirim Pesanan"}
            </Button>
            {onClose && (
              <Button 
                type="button"
                variant="outline" 
                onClick={onClose} 
                className="flex-1 rounded-full"
                disabled={loading}
              >
                Batal
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
