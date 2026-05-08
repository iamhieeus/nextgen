"use client"

import Link from "next/link"
import { showToast } from "@/lib/toast"
import CoverBox from "@/components/story/CoverBox"

type CompletedItem = { title: string; genreInfo: string; cover: { bg: string; emoji: string; image?: string }; href?: string }

function Row({ item }: { item: CompletedItem }) {
  const inner = (
    <>
      <CoverBox cover={item.cover} className="w-[36px] h-[54px] rounded-[2px] flex-shrink-0 shadow-[1px_1px_4px_rgba(0,0,0,.15)]" emojiSize="text-[19px]" />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-ac transition-colors">
          {item.title}
          <span className="text-[10px] bg-[#388e3c] text-white px-[4px] ml-[3px] rounded-[1px]">FULL</span>
        </div>
        <div className="text-[11px] text-[#999] overflow-hidden text-ellipsis whitespace-nowrap">
          {item.genreInfo}
        </div>
      </div>
      <span className="text-[11px] text-[#388e3c] font-bold flex-shrink-0">Hoàn</span>
    </>
  )

  const cls = "flex items-center gap-[9px] py-[6px] border-b border-[#f5f5f5] last:border-none cursor-pointer group"

  if (item.href) {
    return <Link href={item.href} className={cls}>{inner}</Link>
  }
  return <div className={cls} onClick={() => showToast("Truyện đang được cập nhật")}>{inner}</div>
}

export default function CompletedList({ completedList }: { completedList: CompletedItem[] }) {
  return (
    <div className="bg-white border border-[#e5e5e5]">
      <div className="flex items-center gap-2 px-[14px] pt-[10px] mb-[10px]">
        <h2 className="text-[15px] font-bold border-l-[3px] border-ac pl-2 flex-1">Truyện Đã Hoàn Thành</h2>
        <a href="#" className="text-[12px] text-[#999] hover:text-ac ml-auto whitespace-nowrap transition-colors">Xem tất cả →</a>
      </div>
      <div className="flex flex-col px-[14px] pb-[10px]">
        {completedList.map((item, i) => <Row key={i} item={item} />)}
      </div>
    </div>
  )
}
