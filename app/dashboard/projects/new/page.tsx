"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft, Globe, Smartphone, ShoppingCart, Palette, Server, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const projectTypes = [
  { id: "landing_page", label: "Landing Page", icon: Globe, price: 1500000, description: "Website satu halaman untuk promosi produk/jasa" },
  { id: "company_profile", label: "Company Profile", icon: Palette, price: 3000000, description: "Website perusahaan dengan beberapa halaman" },
  { id: "ecommerce", label: "E-Commerce", icon: ShoppingCart, price: 5000000, description: "Toko online dengan sistem pembayaran" },
  { id: "web_app", label: "Web Application", icon: Server, price: 8000000, description: "Aplikasi web custom sesuai kebutuhan" },
  { id: "mobile_app", label: "Mobile App", icon: Smartphone, price: 10000000, description: "Aplikasi mobile Android/iOS" },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    projectType: "",
    projectName: "",
    description: "",
    deadline: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSelectType = (typeId: string) => {
    setFormData(prev => ({
      ...prev,
      projectType: typeId
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.projectType) {
      setError("Pilih jenis project terlebih dahulu")
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    const selectedType = projectTypes.find(t => t.id === formData.projectType)

    const { error: insertError } = await supabase.from("projects").insert({
      user_id: user.id,
      project_name: formData.projectName,
      project_type: formData.projectType,
      description: formData.description,
      budget: selectedType?.price || 0,
      deadline: formData.deadline || null,
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
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 size-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Project Berhasil Dipesan!</h2>
            <p className="text-muted-foreground mb-6">
              Tim kami akan segera menghubungi Anda untuk diskusi lebih lanjut.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => router.push("/dashboard/projects")}
                className="rounded-full bg-foreground text-background hover:bg-foreground/90"
              >
                Lihat Semua Projects
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="rounded-full"
              >
                Ke Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link 
        href="/dashboard/projects" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="size-4" />
        Kembali ke Projects
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Pesan Project Baru</CardTitle>
          <CardDescription>
            Isi form berikut untuk memulai project Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel>Jenis Project</FieldLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {projectTypes.map((type) => {
                    const Icon = type.icon
                    const isSelected = formData.projectType === type.id
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleSelectType(type.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-foreground bg-foreground/5 ring-2 ring-foreground/20"
                            : "border-border hover:border-foreground/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`size-10 rounded-lg flex items-center justify-center ${
                            isSelected ? "bg-foreground text-background" : "bg-muted"
                          }`}>
                            <Icon className="size-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{type.label}</p>
                            <p className="text-xs text-muted-foreground mb-1">{type.description}</p>
                            <p className="text-sm font-semibold text-foreground">{formatCurrency(type.price)}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="projectName">Nama Project</FieldLabel>
                <Input
                  id="projectName"
                  name="projectName"
                  placeholder="Website Toko Online Saya"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Deskripsi Project</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Jelaskan kebutuhan project Anda secara detail..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="deadline">Target Deadline (Opsional)</FieldLabel>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </Field>

              {error && (
                <FieldError className="text-destructive text-sm">{error}</FieldError>
              )}

              <Button 
                type="submit" 
                className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 gap-2"
                disabled={loading}
              >
                {loading ? <Spinner className="size-4" /> : (
                  <>
                    Kirim Pesanan
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
