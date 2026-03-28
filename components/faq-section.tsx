"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Berapa lama waktu pengerjaan website?",
    answer: "Waktu pengerjaan bervariasi tergantung kompleksitas project. Landing page biasanya 3-5 hari kerja, website company profile 1-2 minggu, dan website e-commerce 2-4 minggu.",
  },
  {
    question: "Apakah termasuk hosting dan domain?",
    answer: "Ya, semua paket kami sudah termasuk hosting dan domain gratis selama 1 tahun pertama. Setelah itu, Anda bisa memperpanjang dengan biaya terjangkau.",
  },
  {
    question: "Apakah bisa request revisi?",
    answer: "Tentu! Setiap paket memiliki jatah revisi yang berbeda. Paket Basic 2x revisi, Professional unlimited, dan Enterprise juga unlimited revisi.",
  },
  {
    question: "Bagaimana proses pembayaran?",
    answer: "Pembayaran dilakukan secara bertahap: 50% DP di awal project dan 50% sisanya setelah project selesai dan disetujui. Kami menerima transfer bank dan e-wallet.",
  },
  {
    question: "Apakah ada garansi setelah website jadi?",
    answer: "Ya, kami memberikan garansi maintenance sesuai paket yang dipilih. Selama masa garansi, kami akan memperbaiki bug atau error tanpa biaya tambahan.",
  },
  {
    question: "Bisakah website dikelola sendiri?",
    answer: "Tentu! Kami akan memberikan tutorial dan dokumentasi lengkap untuk mengelola konten website Anda. Jika menggunakan CMS, Anda bisa update konten dengan mudah.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Pertanyaan Umum
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-foreground/20"
              >
                <AccordionTrigger className="text-left text-foreground hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
