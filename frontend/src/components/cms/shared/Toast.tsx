"use client"

import { createContext, useCallback, useContext, useState } from "react"

// ── Types ─────────────────────────────────────────────────────────────────────

type ToastType = "success" | "error"

interface ToastItem {
  id:      number
  message: string
  type:    ToastType
  visible: boolean
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

// ── Context ───────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  let nextId = 0

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++nextId
    setToasts(prev => [...prev, { id, message, type, visible: false }])

    // trigger enter animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: true } : t))
      })
    })

    // remove after 3s
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t))
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 220)
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  )
}

// ── Container & Item ─────────────────────────────────────────────────────────

function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="bg-[#1a1a1a] text-white px-[18px] py-[11px] rounded-[9px] text-[13px] font-medium shadow-[0_4px_20px_rgba(0,0,0,.3)] pointer-events-auto flex items-center gap-2 min-w-[220px] transition-all duration-200"
          style={{
            opacity:   t.visible ? 1 : 0,
            transform: t.visible ? "translateY(0)" : "translateY(8px)",
          }}
        >
          {t.type === "success"
            ? <span className="text-[#4ade80]">✓</span>
            : <span className="text-[#f87171]">✕</span>
          }
          {t.message}
        </div>
      ))}
    </div>
  )
}
