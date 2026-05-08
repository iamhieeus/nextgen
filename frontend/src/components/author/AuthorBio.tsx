"use client"

import { useState, useRef, useEffect } from "react"

const CLAMP_LINES = 2

export default function AuthorBio({ bio }: { bio: string }) {
  const [expanded, setExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    setOverflows(el.scrollHeight > el.clientHeight)
  }, [])

  if (!bio) return null

  return (
    <div className="mb-3 max-w-[480px]">
      <p
        ref={ref}
        className="text-[13px] text-white/55 leading-[1.65]"
        style={
          expanded
            ? undefined
            : {
                display: "-webkit-box",
                WebkitLineClamp: CLAMP_LINES,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
        }
      >
        {bio}
      </p>
      {overflows && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-1 text-[12px] text-white/50 hover:text-white font-semibold transition-colors cursor-pointer"
        >
          {expanded ? "Thu gọn ▲" : "Xem thêm ▼"}
        </button>
      )}
    </div>
  )
}
