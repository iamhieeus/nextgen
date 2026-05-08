"use client"

import { useState } from "react"
import Link from "next/link"
import { showToast } from "@/lib/toast"

type RankItem = { title: string; genre: string; href?: string }
type Rankings = { mostRead: RankItem[]; topRated: RankItem[]; newTrending: RankItem[] }

const tabs = ["Tuần này", "Tháng này", "Toàn thời gian"]
const rankBg = ["bg-ac text-white", "bg-[#e8892a] text-white", "bg-[#e8b52a] text-white"]
const rowCls = "flex items-center gap-[7px] py-[5px] border-b border-[#f5f5f5] last:border-none cursor-pointer group"

function RankRow({ item, index }: { item: RankItem; index: number }) {
  const inner = (
    <>
      <span className={`w-[18px] h-[18px] rounded-[2px] flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${rankBg[index] ?? "bg-[#eee] text-[#999]"}`}>
        {index + 1}
      </span>
      <span className="flex-1 text-[12px] overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-ac transition-colors">
        {item.title}
      </span>
      <span className="text-[11px] text-[#999] flex-shrink-0 whitespace-nowrap">{item.genre}</span>
    </>
  )

  if (item.href) return <Link href={item.href} className={rowCls}>{inner}</Link>
  return <div className={rowCls} onClick={() => showToast("Truyện đang được cập nhật")}>{inner}</div>
}

function RankCol({ icon, name, data }: { icon: string; name: string; data: RankItem[] }) {
  return (
    <div className="flex-1 min-w-0 px-[14px] first:pl-0 last:pr-0 border-l border-[#e5e5e5] first:border-none">
      <div className="flex items-center gap-[6px] pb-[7px] border-b border-[#e5e5e5] mb-[6px]">
        <span className="text-[14px]">{icon}</span>
        <span className="text-[13px] font-bold flex-1">{name}</span>
        <a href="#" className="text-[11px] text-[#999] hover:text-ac transition-colors">Thêm →</a>
      </div>
      {data.map((item, i) => <RankRow key={i} item={item} index={i} />)}
    </div>
  )
}

export default function RankingPanel({ rankings }: { rankings: Rankings }) {
  const [activeTab, setActiveTab] = useState(0)

  const cols = [
    { icon: "🏆", name: "Đọc nhiều nhất",    data: rankings.mostRead },
    { icon: "⭐", name: "Đánh giá cao nhất", data: rankings.topRated },
    { icon: "✨", name: "Mới & Nổi bật",     data: rankings.newTrending },
  ]

  return (
    <div className="bg-white border border-[#e5e5e5]">
      <div className="flex items-center gap-2 px-[14px] pt-[10px] mb-[10px]">
        <h2 className="text-[15px] font-bold border-l-[3px] border-ac pl-2 flex-1">Bảng Xếp Hạng</h2>
        <div className="flex">
          {tabs.map((tab, i) => (
            <span
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`text-[12px] px-[8px] py-[2px] cursor-pointer transition-colors ${
                i === activeTab ? "text-ac border-b border-ac" : "text-[#999] hover:text-ac"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
        <a href="#" className="text-[12px] text-[#999] hover:text-ac ml-auto whitespace-nowrap transition-colors">Xem đầy đủ →</a>
      </div>
      <div className="flex px-[14px] pb-[12px]">
        {cols.map((col) => <RankCol key={col.name} {...col} />)}
      </div>
    </div>
  )
}
