"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Basic",
    price: "2.5",
    description: "Cocok untuk bisnis kecil yang baru memulai.",
    features: [
      "Landing Page 1 Halaman",
      "Desain Responsif",
      "Optimasi SEO Dasar",
      "Hosting 1 Tahun",
      "Revisi 2x",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "5",
    description: "Pilihan terbaik untuk bisnis yang berkembang.",
    features: [
      "Website hingga 5 Halaman",
      "Desain Custom Premium",
      "Optimasi SEO Lengkap",
      "Hosting & Domain 1 Tahun",
      "Revisi Unlimited",
      "Integrasi Analytics",
      "Support 3 Bulan",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "10",
    description: "Solusi lengkap untuk kebutuhan enterprise.",
    features: [
      "Website Unlimited Halaman",
      "E-Commerce Integration",
      "Custom Backend/CMS",
      "Hosting Premium 1 Tahun",
      "Revisi Unlimited",
      "Maintenance 6 Bulan",
      "Priority Support 24/7",
    ],
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase mb-4">
            PRICING
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Pilih Paket yang Sesuai
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "relative bg-card border rounded-2xl p-6 flex flex-col",
                plan.popular
                  ? "border-foreground shadow-xl scale-105"
                  : "border-border"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-medium px-3 py-1 rounded-full">
                  Popular
                </span>
              )}
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground text-sm"> Juta IDR</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="size-4 text-foreground shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full rounded-full",
                  plan.popular
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : ""
                )}
                variant={plan.popular ? "default" : "outline"}
              >
                Pilih Paket
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
