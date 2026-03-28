"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ProjectOrderForm } from "./project-order-form"

const testimonials = [
  {
    id: 1,
    name: "Ahmad Rizki",
    review: "Websitenya cepat dan super rapi!",
    rating: 5,
    position: { top: "15%", left: "5%" },
    delay: 0,
  },
  {
    id: 2,
    name: "Dewi Sartika",
    review: "CuanPage is the best! Project selesai on time!",
    rating: 5,
    position: { top: "35%", right: "3%" },
    delay: 0.2,
  },
  {
    id: 3,
    name: "Budi Santoso",
    review: "Hasil kerjanya sangat memuaskan!",
    rating: 5,
    position: { bottom: "25%", left: "8%" },
    delay: 0.4,
  },
  {
    id: 4,
    name: "Siti Nurhaliza",
    review: "Komunikasi lancar, hasil maksimal!",
    rating: 5,
    position: { bottom: "15%", right: "5%" },
    delay: 0.6,
  },
]

function TestimonialCard({
  name,
  review,
  rating,
  position,
  delay,
}: {
  name: string
  review: string
  rating: number
  position: { top?: string; bottom?: string; left?: string; right?: string }
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: delay + 0.5,
        duration: 0.5,
        ease: "easeOut",
      }}
      className="absolute hidden lg:block"
      style={position}
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4 + delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="bg-card border border-border rounded-xl p-4 shadow-lg max-w-[200px]"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
            {name.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">{name}</p>
            <div className="flex gap-0.5">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="size-2.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{review}</p>
      </motion.div>
    </motion.div>
  )
}

export function HeroSection() {
  const [showOrderForm, setShowOrderForm] = useState(false)

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
    >
      {/* Floating Testimonial Cards */}
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} {...testimonial} />
      ))}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase mb-6">
            KEAHLIAN KAMI
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight max-w-4xl mx-auto text-balance"
        >
          Website tampilan profesional kelar dalam 24 jam.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto"
        >
          Mentok di Budget?, Butuh cepat?. nego sama AI Assistent kami!.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            size="lg" 
            className="rounded-full px-8 gap-2 bg-foreground text-background hover:bg-foreground/90"
            onClick={() => setShowOrderForm(true)}
          >
            Mulai Project
            <ArrowRight className="size-4" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8">
            <a href="#project">Lihat Portfolio</a>
          </Button>
        </motion.div>
      </div>

      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-muted/50 rounded-full blur-3xl" />
      </div>

      {/* Order Form Modal */}
      <AnimatePresence>
        {showOrderForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowOrderForm(false)
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <ProjectOrderForm onClose={() => setShowOrderForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
