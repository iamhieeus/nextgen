"use client"

import Link from "next/link"
import { showToast } from "@/lib/toast"
import CoverBox from "@/components/story/CoverBox"

type HotItem = { rank: number; title: string; genres: string; chapters: string; bg: string; emoji: string; image?: string; href?: string }

const rankColor = ["text-ac", "text-[#e8892a]", "text-[#e8b52a]"]

const cls = "flex items-center gap-[8px] px-[12px] py-[7px] border-b border-[#f5f5f5] last:border-none cursor-pointer hover:bg-[#fafafa] transition-colors group"

function RowInner({ item }: { item: HotItem }) {
  return (
    <>
      <span className={`w-[20px] text-center text-[13px] font-bold flex-shrink-0 ${rankColor[item.rank - 1] ?? "text-[#999]"}`}>
        {item.rank}
      </span>
      <CoverBox cover={{ bg: item.bg, emoji: item.emoji, image: item.image }} className="w-[34px] h-[51px] rounded-[2px] flex-shrink-0" emojiSize="text-[19px]" />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-ac transition-colors">
          {item.title}
        </div>
        <div className="text-[11px] text-[#999] mt-[1px]">{item.genres}</div>
      </div>
      <span className="text-[11px] text-ac flex-shrink-0">{item.chapters}</span>
    </>
  )
}

export default function HotList({ hotList }: { hotList: HotItem[] }) {
  return (
    <div className="flex-1 bg-white border border-[#e5e5e5] flex flex-col">
      <div className="bg-panel-hd px-[12px] py-[9px] flex items-center border-b border-[#e5e5e5]">
        <span className="text-[14px] font-bold text-ac flex-1">🔥 Truyện Đang Hot</span>
        <a href="#" className="text-[12px] text-[#999] hover:text-ac transition-colors">Xem BXH đầy đủ →</a>
      </div>
      {hotList.map((item) =>
        item.href
          ? <Link key={item.rank} href={item.href} className={cls}><RowInner item={item} /></Link>
          : <div key={item.rank} className={cls} onClick={() => showToast("Truyện đang được cập nhật")}><RowInner item={item} /></div>
      )}
    </div>
  )
}
