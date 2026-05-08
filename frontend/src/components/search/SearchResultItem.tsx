import Link from "next/link"
import type { SearchResultItem as Item } from "@/services/search.service"
import CoverBox from "@/components/story/CoverBox"

const BADGE_STYLE = {
  hot:  "bg-[#fff0f0] text-ac border border-[#ffd0d0]",
  new:  "bg-[#eef4ff] text-[#2563eb] border border-[#c7d9ff]",
  full: "bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]",
}

const BADGE_LABEL = { hot: "Hot", new: "Mới", full: "Full" }

const STATUS_STYLE: Record<string, string> = {
  "Đang ra":   "bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]",
  "Hoàn thành": "bg-[#f5f5f5] text-[#777] border border-[#e0e0e0]",
  "Tạm dừng":  "bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa]",
  "Drop":      "bg-[#f5f5f5] text-[#999] border border-[#e0e0e0]",
}

export default function SearchResultItem({ item }: { item: Item }) {
  return (
    <article className="bg-white border border-[#e5e5e5] flex hover:shadow-md hover:border-[#d0d0d0] transition-all group">
      {/* Cover */}
      <div className="w-[80px] flex-shrink-0 p-[12px_0_12px_12px]">
        <Link href={item.href}>
          <CoverBox cover={item.cover} className="w-[80px] h-[108px] border border-[#eee]" emojiSize="text-[28px]" />
        </Link>
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 p-[12px_14px] ml-[10px] flex flex-col gap-[5px]">
        {/* Title row */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <Link
            href={item.href}
            className="text-[16px] font-bold text-[#222] group-hover:text-ac transition-colors"
          >
            {item.title}
          </Link>
          <div className="flex gap-1 flex-wrap">
            {item.badge && (
              <span className={`text-[11px] px-[6px] py-[1px] rounded-[2px] font-medium ${BADGE_STYLE[item.badge]}`}>
                {BADGE_LABEL[item.badge]}
              </span>
            )}
            <span className={`text-[11px] px-[6px] py-[1px] rounded-[2px] font-medium ${STATUS_STYLE[item.status] ?? "bg-[#f5f5f5] text-[#777] border border-[#e0e0e0]"}`}>
              {item.status}
            </span>
            <span className="text-[11px] px-[6px] py-[1px] rounded-[2px] font-medium bg-[#eef4ff] text-[#2563eb] border border-[#c7d9ff]">
              {item.category}
            </span>
          </div>
        </div>

        {/* Meta */}
        <div className="text-[12px] text-[#999] flex gap-[10px] flex-wrap">
          <span>✍ {item.author}</span>
          {item.wordCount && <span>📖 {item.wordCount} chữ</span>}
          {item.chapterCount > 0 && <span>📄 {item.chapterCount} chương</span>}
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {item.tags.slice(0, 4).map((t) => (
              <span key={t} className="text-[11px] px-[5px] py-[1px] bg-[#f5f5f5] text-[#777]">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Synopsis */}
        <p className="text-[13px] text-[#666] leading-[1.6] line-clamp-2">{item.synopsis}</p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-[2px]">
          <div className="flex gap-[14px]">
            <span className="text-[12px] text-[#999]">
              Đọc: <strong className="text-[#333] font-semibold">{item.viewCount}</strong>
            </span>
            <span className="text-[12px] text-[#999]">
              Đánh dấu: <strong className="text-[#333] font-semibold">{item.bookmarkCount}</strong>
            </span>
          </div>
          <Link
            href={item.href}
            className="bg-ac hover:bg-ac-dk text-white text-[13px] font-semibold px-[18px] py-[7px] rounded-[2px] transition-colors whitespace-nowrap"
          >
            Đọc ngay
          </Link>
        </div>
      </div>
    </article>
  )
}
