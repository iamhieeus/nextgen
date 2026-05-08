"use client"

import { useEffect, useState } from "react"
import { registerToast, unregisterToast } from "@/lib/toast"

export default function Toast() {
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    registerToast(setMsg)
    return () => unregisterToast()
  }, [])

  useEffect(() => {
    if (!msg) return
    const t = setTimeout(() => setMsg(null), 2500)
    return () => clearTimeout(t)
  }, [msg])

  if (!msg) return null

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#333] text-white px-5 py-[10px] rounded-[4px] shadow-lg text-[13px] whitespace-nowrap animate-in fade-in slide-in-from-top-2 duration-200">
      {msg}
    </div>
  )
}
