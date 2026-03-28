export const dynamic = 'force-dynamic'
'use client'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Project {
  id: string
  full_name: string
  email: string
  whatsapp: string
  description: string
  budget_range: string
  status: string
  created_at: string
  admin_notes?: string
}

interface Invoice {
  id: string
  invoice_number?: string
  amount: number
  status: string
  due_date: string
  paid_at?: string
  notes?: string
}

export default function ProjectDetail() {
  const [project, setProject] = useState<Project | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .eq('user_id', user.id)
          .single()

        if (projectError || !projectData) {
          router.push('/client/dashboard')
          return
        }

        setProject(projectData)

        const { data: invoicesData } = await supabase
          .from('invoices')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })

        setInvoices(invoicesData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router, supabase, projectId])

  if (isLoading) return <div className="p-8">Loading...</div>
  if (!project) return <div className="p-8">Project not found</div>

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/client/dashboard" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
            ← Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Detail Pesanan</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pesanan</CardTitle>
              <CardDescription>Rincian lengkap pesanan Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className={`font-semibold text-lg mt-1 ${
                    project.status === 'completed' ? 'text-green-600' :
                    project.status === 'in_progress' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    {project.status === 'completed' ? 'Selesai' :
                     project.status === 'in_progress' ? 'Sedang Dikerjakan' :
                     'Menunggu'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Pesanan</p>
                  <p className="font-semibold">{new Date(project.created_at).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                  <p className="font-semibold">{project.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{project.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="font-semibold">{project.whatsapp}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Range Budget</p>
                  <p className="font-semibold">{project.budget_range}</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">Deskripsi</p>
                <p className="font-medium mt-2 text-foreground">{project.description}</p>
              </div>
              {project.admin_notes && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900"><strong>Catatan Admin:</strong></p>
                  <p className="mt-1 text-blue-800">{project.admin_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {invoices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Invoice</CardTitle>
                <CardDescription>Daftar invoice untuk pesanan ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{invoice.invoice_number || 'Invoice'}</p>
                          <p className="text-sm text-muted-foreground">
                            Jatuh tempo: {new Date(invoice.due_date).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status === 'paid' ? 'Lunas' :
                           invoice.status === 'pending' ? 'Belum Dibayar' :
                           'Terlewat'}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        Rp {(invoice.amount || 0).toLocaleString('id-ID')}
                      </p>
                      {invoice.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{invoice.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
