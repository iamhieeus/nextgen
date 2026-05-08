"use client"

import { useState } from "react"
import BookCardH from "@/components/story/BookCardH"

type BookCardHData = { title: string; tags: { label: string; highlight?: boolean }[]; desc: string; author: string; chapters: string; views: string; cover: { bg: string; emoji: string } }

const tabs = ["Tất cả", "Miễn phí", "Đang ra", "Hoàn thành"]

export default function Recommendations({ recommendations }: { recommendations: BookCardHData[] }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="bg-white border border-[#e5e5e5]">
      <div className="flex items-center gap-2 px-[14px] pt-[10px] mb-[10px]">
        <h2 className="text-[15px] font-bold border-l-[3px] border-ac pl-2 flex-1">Gợi Ý Cho Bạn</h2>
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
        <a href="#" className="text-[12px] text-[#999] hover:text-ac ml-auto whitespace-nowrap transition-colors">Xem thêm →</a>
      </div>
      <div className="grid grid-cols-2 gap-[12px] px-[14px] pb-[14px]">
        {recommendations.map((book, i) => (
          <BookCardH key={i} {...book} />
        ))}
      </div>
    </div>
  )
}
