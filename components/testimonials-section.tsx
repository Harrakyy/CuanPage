"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Ahmad Rizki",
    role: "CEO, TechStartup",
    content: "Websitenya cepat dan super rapi! Tim FtrTech sangat profesional dan komunikatif selama proses pengerjaan.",
    rating: 5,
  },
  {
    name: "Dewi Sartika",
    role: "Owner, Fashion Store",
    content: "Project selesai on time dengan hasil yang memuaskan. E-commerce kami sekarang berjalan lancar!",
    rating: 5,
  },
  {
    name: "Budi Santoso",
    role: "Marketing Manager",
    content: "Hasil kerjanya sangat memuaskan! Traffic website kami meningkat 200% setelah redesign.",
    rating: 5,
  },
  {
    name: "Siti Nurhaliza",
    role: "Founder, Agency Creative",
    content: "Komunikasi lancar, hasil maksimal! Sangat recommended untuk kebutuhan website profesional.",
    rating: 5,
  },
  {
    name: "Rudi Hermawan",
    role: "Director, Consulting Firm",
    content: "Proses cepat, revisi responsif, dan hasilnya sesuai ekspektasi. Terima kasih FtrTech!",
    rating: 5,
  },
  {
    name: "Maya Putri",
    role: "Owner, Cafe & Restaurant",
    content: "Website kami jadi lebih menarik dan booking online meningkat drastis. Sangat puas!",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimoni" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase mb-4">
            TESTIMONI
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Apa Kata Klien Kami
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-foreground/10 transition-colors"
            >
              <Quote className="size-8 text-muted-foreground/30 mb-4" />
              
              <p className="text-foreground mb-6 leading-relaxed">
                {testimonial.content}
              </p>

              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="size-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
