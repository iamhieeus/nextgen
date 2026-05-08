"use client"

import { useState } from "react"
import Link from "next/link"

interface StoryActionsProps {
  storySlug:     string
  firstChapterNo: number | null
  lastChapterNo:  number | null
}

export default function StoryActions({ storySlug, firstChapterNo, lastChapterNo }: StoryActionsProps) {
  const [bookmarked, setBookmarked] = useState(false)

  const base         = `/stories/${storySlug}/chapters`
  const firstHref    = firstChapterNo != null ? `${base}/${firstChapterNo}` : null
  const latestHref   = lastChapterNo  != null ? `${base}/${lastChapterNo}`  : null

  return (
    <div className="flex gap-[10px] items-center flex-wrap">
      {latestHref ? (
        <Link
          href={latestHref}
          className="bg-ac hover:bg-ac-dk text-white text-[15px] font-bold px-8 py-[11px] rounded-[3px] transition-colors"
        >
          ▶ Đọc ngay
        </Link>
      ) : (
        <span className="bg-[#ccc] text-white text-[15px] font-bold px-8 py-[11px] rounded-[3px] cursor-not-allowed">
          ▶ Đọc ngay
        </span>
      )}

      {firstHref ? (
        <Link
          href={firstHref}
          className="text-[13px] font-semibold px-5 py-[10px] rounded-[3px] border border-[#e5e5e5] text-[#333] bg-white hover:border-ac hover:text-ac transition-colors"
        >
          📖 Đọc từ đầu
        </Link>
      ) : (
        <span className="text-[13px] font-semibold px-5 py-[10px] rounded-[3px] border border-[#e5e5e5] text-[#999] bg-white cursor-not-allowed">
          📖 Đọc từ đầu
        </span>
      )}

      <button
        onClick={() => setBookmarked(!bookmarked)}
        className={`text-[13px] font-semibold px-5 py-[10px] rounded-[3px] border transition-colors cursor-pointer ${
          bookmarked
            ? "bg-[#e8f5e9] text-[#2e7d32] border-[#a5d6a7]"
            : "bg-ac-lt text-ac border-ac hover:bg-ac hover:text-white"
        }`}
      >
        {bookmarked ? "✅ Đã thêm vào tủ sách" : "🔖 Thêm vào tủ sách"}
      </button>
    </div>
  )
}
