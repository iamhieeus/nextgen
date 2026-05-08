"use client"

import Link from "next/link"
import { showToast } from "@/lib/toast"
import CoverBox from "@/components/story/CoverBox"

type UpdateItem = { title: string; latestChapter: string; latestTitle: string; time: string; cover: { bg: string; emoji: string; image?: string }; isNew?: boolean; href?: string }

function Row({ item }: { item: UpdateItem }) {
  const inner = (
    <>
      <CoverBox cover={item.cover} className="w-[36px] h-[54px] rounded-[2px] flex-shrink-0 shadow-[1px_1px_4px_rgba(0,0,0,.15)]" emojiSize="text-[19px]" />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-ac transition-colors">
          {item.title}
          {item.isNew && (
            <span className="text-[10px] bg-ac text-white px-[4px] ml-[3px] rounded-[1px]">MỚI</span>
          )}
        </div>
        <div className="text-[11px] text-[#999] overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="text-ac">{item.latestChapter}</span> – {item.latestTitle}
        </div>
      </div>
      <span className="text-[11px] text-[#999] flex-shrink-0">{item.time}</span>
    </>
  )

  const cls = "flex items-center gap-[9px] py-[6px] border-b border-[#f5f5f5] last:border-none cursor-pointer group"

  if (item.href) {
    return <Link href={item.href} className={cls}>{inner}</Link>
  }
  return <div className={cls} onClick={() => showToast("Truyện đang được cập nhật")}>{inner}</div>
}

export default function UpdatedList({ updatedList }: { updatedList: UpdateItem[] }) {
  return (
    <div className="bg-white border border-[#e5e5e5]">
      <div className="flex items-center gap-2 px-[14px] pt-[10px] mb-[10px]">
        <h2 className="text-[15px] font-bold border-l-[3px] border-ac pl-2 flex-1">Mới Cập Nhật</h2>
        <a href="#" className="text-[12px] text-[#999] hover:text-ac ml-auto whitespace-nowrap transition-colors">Xem tất cả →</a>
      </div>
      <div className="flex flex-col px-[14px] pb-[10px]">
        {updatedList.map((item, i) => <Row key={i} item={item} />)}
      </div>
    </div>
  )
}
