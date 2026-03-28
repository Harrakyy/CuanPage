"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Sun, Moon, Menu, X, User, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const navLinks = [
  { href: "#home", label: "HOME" },
  { href: "#layanan", label: "LAYANAN" },
  { href: "#project", label: "PROJECT" },
  { href: "#pricing", label: "PRICING" },
  { href: "#testimoni", label: "TESTIMONI" },
  { href: "#faq", label: "FAQ" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
          CuanPage<span className="text-primary">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-full border border-border hover:border-foreground/20"
          >
            {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>

          {user ? (
            <Link href={user.user_metadata?.is_admin ? "/admin/dashboard" : "/client/dashboard"}>
              <Button
                size="sm"
                className="rounded-full px-4 gap-2 bg-foreground text-background hover:bg-foreground/90"
              >
                <User className="size-3.5" />
                <span className="hidden sm:inline text-xs font-medium tracking-wide">DASHBOARD</span>
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full px-4 gap-2"
                >
                  <LogIn className="size-3.5" />
                  <span className="hidden sm:inline text-xs font-medium tracking-wide">MASUK</span>
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="rounded-full px-4 gap-2 bg-foreground text-background hover:bg-foreground/90"
                >
                  <MessageCircle className="size-3.5" />
                  <span className="hidden sm:inline text-xs font-medium tracking-wide">DAFTAR</span>
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-b border-border">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <hr className="border-border" />
            {user ? (
              <Link
                href={user.user_metadata?.is_admin ? "/admin/dashboard" : "/client/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-foreground"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-foreground"
                >
                  Daftar
                </Link>
              </>
            )}
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
