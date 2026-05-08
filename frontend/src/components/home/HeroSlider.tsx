"use client"

import { useState, useEffect, useCallback } from "react"
import { showToast } from "@/lib/toast"

type SlideTag = { label: string; color?: "green" | "blue" }
type SlideData = { title: string; desc: string; tags: SlideTag[]; author: string; chapters: string; views: string; bg: string; emoji: string; href?: string }

const tagBg: Record<string, string> = {
  green: "bg-[#388e3c]",
  blue: "bg-[#1565c0]",
}

export default function HeroSlider({ slides }: { slides: SlideData[] }) {
  const [idx, setIdx] = useState(0)

  const go = useCallback((n: number) => {
    setIdx((n + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    const timer = setInterval(() => go(idx + 1), 4500)
    return () => clearInterval(timer)
  }, [idx, go])

  return (
    <div className="relative w-[460px] flex-shrink-0 min-h-[268px] overflow-hidden bg-[#111]">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 flex transition-opacity duration-500 ${i === idx ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {/* Background */}
          <div
            className="absolute inset-0 flex items-center justify-center text-[90px]"
            style={{ background: s.bg }}
          >
            {s.emoji}
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          {/* Content */}
          <div className="relative z-10 mt-auto p-[14px_18px] cursor-pointer" onClick={() => { if (!s.href) showToast("Truyện đang được cập nhật") }}>
            <div className="flex gap-[5px] mb-[6px]">
              {s.tags.map((tag, j) => (
                <span
                  key={j}
                  className={`text-[11px] text-white px-[7px] py-[1px] rounded-[1px] font-bold ${tagBg[tag.color ?? ""] ?? "bg-ac"}`}
                >
                  {tag.label}
                </span>
              ))}
            </div>
            <div className="text-white text-[19px] font-bold mb-[4px]">{s.title}</div>
            <div className="text-white/70 text-[12px] leading-[1.6] line-clamp-2">{s.desc}</div>
            <div className="flex items-center gap-[10px] mt-[6px] text-[11px] text-white/50">
              <span className="text-white/80">{s.author}</span>
              <span>·</span>
              <span>{s.chapters}</span>
              <span>·</span>
              <span>{s.views}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next buttons */}
      <button
        onClick={() => go(idx - 1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[32px] h-[52px] bg-black/30 hover:bg-orange-500/60 text-white text-[18px] z-30 cursor-pointer transition-colors flex items-center justify-center"
      >
        ‹
      </button>
      <button
        onClick={() => go(idx + 1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[32px] h-[52px] bg-black/30 hover:bg-orange-500/60 text-white text-[18px] z-30 cursor-pointer transition-colors flex items-center justify-center"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-[10px] right-[14px] z-30 flex gap-[4px] items-center">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-[6px] rounded-full cursor-pointer transition-all duration-300 ${
              i === idx ? "bg-ac w-[20px]" : "bg-white/40 w-[6px]"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
