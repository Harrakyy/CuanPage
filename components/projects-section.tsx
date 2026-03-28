"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"

const projects = [
  {
    title: "E-Commerce Platform",
    category: "Web Development",
    description: "Platform e-commerce modern dengan sistem pembayaran terintegrasi.",
    tags: ["Next.js", "Stripe", "Tailwind"],
  },
  {
    title: "Company Profile",
    category: "Web Design",
    description: "Website company profile profesional dengan animasi interaktif.",
    tags: ["React", "Framer Motion", "GSAP"],
  },
  {
    title: "Dashboard Analytics",
    category: "Web App",
    description: "Dashboard analitik real-time untuk monitoring bisnis.",
    tags: ["TypeScript", "Chart.js", "API"],
  },
  {
    title: "Mobile Landing Page",
    category: "Landing Page",
    description: "Landing page responsif dengan konversi tinggi.",
    tags: ["HTML/CSS", "JavaScript", "SEO"],
  },
]

export function ProjectsSection() {
  return (
    <section id="project" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase mb-4">
            PROJECT
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Portfolio Terbaru
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-muted/50 border border-border rounded-2xl overflow-hidden hover:border-foreground/20 transition-all duration-300"
            >
              {/* Project Image Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <span className="text-4xl font-bold text-muted-foreground/30">
                  {index + 1}
                </span>
              </div>
              
              {/* Project Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {project.category}
                  </span>
                  <ExternalLink className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 bg-background border border-border rounded-full text-muted-foreground"
                    >
                      {tag}
                    </span>
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
