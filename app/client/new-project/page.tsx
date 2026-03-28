'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'

export default function NewProject() {
  const [description, setDescription] = useState('')
  const [budgetRange, setBudgetRange] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, whatsapp')
        .eq('id', user.id)
        .single()

      const { error } = await supabase.from('projects').insert({
        user_id: user.id,
        full_name: profile?.full_name,
        email: profile?.email,
        whatsapp: profile?.whatsapp,
        description,
        budget_range: budgetRange,
        status: 'pending',
      })

      if (error) throw error
      router.push('/client/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold">CuanPage</h1>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Buat Pesanan Baru</h2>
          <p className="text-muted-foreground">Jelaskan kebutuhan website Anda</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detail Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi Proyek</Label>
                <Textarea
                  id="description"
                  placeholder="Jelaskan kebutuhan website Anda, fitur yang diperlukan, dan target audiens..."
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-32"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="budget">Range Budget</Label>
                <select
                  id="budget"
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">Pilih range budget</option>
                  <option value="1-5jt">Rp 1 - 5 Juta</option>
                  <option value="5-10jt">Rp 5 - 10 Juta</option>
                  <option value="10-20jt">Rp 10 - 20 Juta</option>
                  <option value="20jt+">Rp 20+ Juta</option>
                </select>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Menyimpan...' : 'Buat Pesanan'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Kembali
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
