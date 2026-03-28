import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Beranda
        </Link>

        <Card className="border-border text-center">
          <CardHeader>
            <div className="mx-auto mb-4 size-16 rounded-full bg-muted flex items-center justify-center">
              <Mail className="size-8 text-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Cek Email Anda</CardTitle>
            <CardDescription className="text-base">
              Kami telah mengirim link konfirmasi ke email Anda. Silakan klik link tersebut untuk mengaktifkan akun.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Tidak menerima email? Cek folder spam atau tunggu beberapa menit.
            </p>
            <Link href="/auth/login">
              <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                Ke Halaman Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
