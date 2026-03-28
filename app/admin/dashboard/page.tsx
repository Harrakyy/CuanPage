export const dynamic = 'force-dynamic'
'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
export const dynamic = 'force-dynamic'

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
  project_id: string
  amount: number
  status: string
  due_date: string
  paid_at?: string
  created_at: string
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('projects')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()

        if (!profile?.is_admin) {
          router.push('/client/dashboard')
          return
        }

        setUser(user)

        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })

        const { data: invoicesData } = await supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false })

        setProjects(projectsData || [])
        setInvoices(invoicesData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const updateProjectStatus = async (projectId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId)

      if (error) throw error

      setProjects(projects.map(p =>
        p.id === projectId ? { ...p, status: newStatus } : p
      ))
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  const updateInvoiceStatus = async (invoiceId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status: newStatus, paid_at: newStatus === 'paid' ? new Date().toISOString() : null })
        .eq('id', invoiceId)

      if (error) throw error

      setInvoices(invoices.map(i =>
        i.id === invoiceId ? { ...i, status: newStatus } : i
      ))
    } catch (error) {
      console.error('Error updating invoice:', error)
    }
  }

  if (isLoading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">CuanPage Admin</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 px-4 font-semibold ${
              activeTab === 'projects'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
          >
            Pesanan ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`pb-3 px-4 font-semibold ${
              activeTab === 'invoices'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
          >
            Invoice ({invoices.length})
          </button>
        </div>

        {activeTab === 'projects' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Semua Pesanan</h2>
            {projects.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Belum ada pesanan</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{project.description}</CardTitle>
                          <CardDescription>{project.full_name} • {project.created_at}</CardDescription>
                        </div>
                        <select
                          value={project.status}
                          onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${
                            project.status === 'completed' ? 'bg-green-100 text-green-800' :
                            project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Budget</p>
                          <p className="font-semibold">{project.budget_range}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-semibold">{project.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">WhatsApp</p>
                          <p className="font-semibold">{project.whatsapp}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit Notes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Semua Invoice</h2>
            {invoices.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Belum ada invoice</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {invoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{invoice.invoice_number}</CardTitle>
                          <CardDescription>{invoice.created_at}</CardDescription>
                        </div>
                        <select
                          value={invoice.status}
                          onChange={(e) => updateInvoiceStatus(invoice.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="overdue">Overdue</option>
                        </select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="font-semibold">Rp {(invoice.amount || 0).toLocaleString('id-ID')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Due Date</p>
                          <p className="font-semibold">{invoice.due_date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Paid At</p>
                          <p className="font-semibold">{invoice.paid_at ? invoice.paid_at : '-'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
