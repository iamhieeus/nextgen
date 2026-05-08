"use client"

import Link from "next/link"
import { showToast } from "@/lib/toast"
import CoverBox from "./CoverBox"

type BookCardVData = {
  title: string
  meta: string
  cover: { bg: string; emoji: string; image?: string }
  badge?: { label: string; type: "hot" | "full" | "new" }
  href?: string
}

const badgeClass: Record<string, string> = {
  hot: "bg-ac",
  full: "bg-[#388e3c]",
  new: "bg-[#1565c0]",
}

const inner = (title: string, meta: string, cover: { bg: string; emoji: string; image?: string }, badge?: { label: string; type: "hot" | "full" | "new" }) => (
  <>
    <div className="w-full aspect-[2/3] rounded-[3px] shadow-[1px_3px_8px_rgba(0,0,0,.18)] mb-[7px] relative overflow-hidden">
      <CoverBox cover={cover} className="w-full h-full rounded-[3px]" emojiSize="text-[34px]" />
      {badge && (
        <span className={`absolute top-0 left-0 text-[10px] font-bold px-[6px] py-[2px] text-white z-10 ${badgeClass[badge.type]}`}>
          {badge.label}
        </span>
      )}
    </div>
    <div className="text-[12px] font-bold overflow-hidden text-ellipsis whitespace-nowrap mb-[2px] group-hover:text-ac transition-colors">
      {title}
    </div>
    <div className="text-[11px] text-[#999] overflow-hidden text-ellipsis whitespace-nowrap">{meta}</div>
  </>
)

export default function BookCardV({ title, meta, cover, badge, href }: BookCardVData) {
  if (href) {
    return (
      <Link href={href} className="cursor-pointer group block">
        {inner(title, meta, cover, badge)}
      </Link>
    )
  }

  return (
    <div className="cursor-pointer group" onClick={() => showToast("Truyện đang được cập nhật")}>
      {inner(title, meta, cover, badge)}
    </div>
  )
}
