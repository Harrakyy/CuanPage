"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, ArrowUp, X, Send, Loader2, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  role: "user" | "assistant"
  content: string
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content: "Halo! Saya **CuanPage Assistant** 👋\n\nSaya siap membantu kamu seputar Jasa CuanPage Group — Company Profile, Portofolio, Manajemen Inventaris, Point of Sale, \n\nAda yang bisa saya bantu?",
}

export function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [chatOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMessage: Message = { role: "user", content: trimmed }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      if (!res.ok) throw new Error("Gagal menghubungi server")

      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Maaf, terjadi kesalahan. Silakan coba lagi ya 🙏",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Simple markdown: bold (**text**) and newlines
  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g)
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      )
    })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && !chatOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className={cn(
              "size-12 rounded-full bg-muted border border-border flex items-center justify-center",
              "text-muted-foreground hover:text-foreground hover:border-foreground/30",
              "transition-colors shadow-lg"
            )}
            aria-label="Scroll to top"
          >
            <ArrowUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col"
            style={{ height: "500px" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-foreground text-background">
              <div className="size-9 rounded-full bg-background/20 flex items-center justify-center flex-shrink-0">
                <Bot className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-none">Ashira Assistant</p>
                <p className="text-xs text-background/60 mt-0.5">ASHIRA GROUP · Online</p>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="size-8 rounded-full hover:bg-background/20 flex items-center justify-center transition-colors"
                aria-label="Tutup chat"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-2 items-end",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "size-7 rounded-full flex-shrink-0 flex items-center justify-center",
                      msg.role === "assistant"
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <Bot className="size-4" />
                    ) : (
                      <User className="size-4" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      msg.role === "assistant"
                        ? "bg-muted text-foreground rounded-bl-sm"
                        : "bg-foreground text-background rounded-br-sm"
                    )}
                  >
                    {renderContent(msg.content)}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-2 items-end">
                  <div className="size-7 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0">
                    <Bot className="size-4" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="size-1.5 rounded-full bg-muted-foreground/60"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border flex gap-2 items-center bg-background">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan..."
                disabled={loading}
                className={cn(
                  "flex-1 text-sm bg-muted rounded-full px-4 py-2.5 outline-none",
                  "placeholder:text-muted-foreground/60",
                  "focus:ring-2 focus:ring-foreground/20 transition-shadow",
                  "disabled:opacity-50"
                )}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className={cn(
                  "size-10 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0",
                  "hover:opacity-80 transition-opacity",
                  "disabled:opacity-30 disabled:cursor-not-allowed"
                )}
                aria-label="Kirim pesan"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        onClick={() => setChatOpen((prev) => !prev)}
        className={cn(
          "size-14 rounded-full bg-foreground text-background flex items-center justify-center",
          "shadow-xl hover:scale-105 transition-transform relative"
        )}
        aria-label={chatOpen ? "Tutup chat" : "Buka chat"}
      >
        <AnimatePresence mode="wait">
          {chatOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="size-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="size-6" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread dot — tampil hanya saat chat tutup */}
        <AnimatePresence>
          {!chatOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1 right-1 size-3 rounded-full bg-green-500 border-2 border-background"
            />
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
