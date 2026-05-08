"use client"

import { useState, useRef, useEffect } from "react"

const CLAMP_LINES = 4

export default function SynopsisCollapse({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // The paragraph is rendered with -webkit-line-clamp applied.
    // scrollHeight reflects the full text height; clientHeight reflects
    // the clamped height. If they differ, the text was truncated.
    setOverflows(el.scrollHeight > el.clientHeight)
  }, []) // measure once on mount; text is fixed for the lifetime of this page

  return (
    <div className="mb-4">
      <p
        ref={ref}
        className="text-[13px] text-[#666] leading-[1.7] whitespace-pre-line"
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
        {text}
      </p>

      {overflows && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-[12px] text-ac hover:text-ac-dk font-semibold transition-colors cursor-pointer"
        >
          {expanded ? "Thu gọn ▲" : "Xem thêm ▼"}
        </button>
      )}
    </div>
  )
}
