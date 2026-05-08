import Link from "next/link"
import type { AuthorStory } from "@/services/author.service"
import CoverBox from "@/components/story/CoverBox"

const STATUS_LABEL: Record<string, string> = {
  ONGOING:   "Đang ra",
  COMPLETED: "Hoàn thành",
  HIATUS:    "Tạm dừng",
  DROPPED:   "Đã drop",
}

const STATUS_CLS: Record<string, string> = {
  ONGOING:   "bg-[#e8f5e9] text-[#2e7d32] border-[#a5d6a7]",
  COMPLETED: "bg-[#e8f5e9] text-[#2e7d32] border-[#a5d6a7]",
  HIATUS:    "bg-[#fff8e1] text-[#f57f17] border-[#ffe082]",
  DROPPED:   "bg-[#fafafa] text-[#999]   border-[#e0e0e0]",
}

const BADGE_CLS: Record<string, string> = {
  ONGOING:   "bg-ac",
  COMPLETED: "bg-[#388e3c]",
  HIATUS:    "bg-[#f57f17]",
  DROPPED:   "bg-[#999]",
}

function WorkCard({ s }: { s: AuthorStory }) {
  return (
    <div className="flex gap-4 px-3 py-4 border-b border-[#f5f5f5] last:border-none hover:bg-[#fafafa] transition-colors">
      {/* Cover */}
      <Link href={s.href} className="flex-shrink-0 relative">
        <CoverBox cover={s.cover} className="w-[68px] h-[92px] rounded-[3px] shadow-[1px_2px_8px_rgba(0,0,0,.18)]" emojiSize="text-[28px]" />
        <span className={`absolute top-0 left-0 text-[9px] font-bold px-[6px] py-[1.5px] text-white z-10 ${BADGE_CLS[s.status]}`}>
          {s.status === "COMPLETED" ? "FULL" : s.status === "ONGOING" ? "HOT" : STATUS_LABEL[s.status]}
        </span>
      </Link>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <Link href={s.href} className="text-[15px] font-bold hover:text-ac transition-colors line-clamp-1 mb-1">
          {s.title}
        </Link>
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="text-[11px] bg-ac-lt text-ac border border-[#ffc5c7] px-2 py-[1px] rounded-[2px] font-medium">{s.category}</span>
          {s.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[11px] bg-[#f5f5f5] text-[#666] px-2 py-[1px] rounded-[2px]">{tag}</span>
          ))}
          <span className={`text-[11px] border px-2 py-[1px] rounded-[2px] font-medium ${STATUS_CLS[s.status]}`}>
            {s.status === "COMPLETED" ? "✅ " : s.status === "ONGOING" ? "⚡ " : ""}{STATUS_LABEL[s.status]}
          </span>
        </div>
        <p className="text-[12.5px] text-[#666] line-clamp-2 leading-[1.65] mb-2">{s.synopsis}</p>
        <div className="flex gap-4 flex-wrap">
          <span className="text-[11px] text-[#999]">📑 <strong className="text-[#555]">{s.chapterCount.toLocaleString()} chương</strong></span>
          {s.wordCount && <span className="text-[11px] text-[#999]">📝 <strong className="text-[#555]">{s.wordCount} chữ</strong></span>}
          <span className="text-[11px] text-[#999]">👁 <strong className="text-[#555]">{s.viewCount}</strong> đọc</span>
          {s.ratingAvg > 0 && (
            <span className="text-[11px] text-[#999]">⭐ <strong className="text-[#f59e0b]">{s.ratingAvg.toFixed(1)}</strong>/10</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 items-end justify-center flex-shrink-0">
        <Link
          href={s.href}
          className="inline-flex items-center gap-1 bg-ac text-white px-4 py-[6px] rounded-[2px] text-[12px] font-bold hover:bg-ac-dk transition-colors whitespace-nowrap"
        >
          ▶ Đọc ngay
        </Link>
        <button className="text-[11px] text-[#666] border border-[#e5e5e5] px-3 py-[5px] rounded-[2px] hover:border-ac hover:text-ac transition-colors whitespace-nowrap cursor-pointer">
          🔖 Tủ sách
        </button>
      </div>
    </div>
  )
}

export default function AuthorWorksList({ stories }: { stories: AuthorStory[] }) {
  if (stories.length === 0) {
    return (
      <div className="bg-white border border-[#e5e5e5] py-14 text-center text-[#999]">
        <div className="text-[36px] mb-2">📚</div>
        <div className="text-[14px]">Tác giả chưa có tác phẩm</div>
      </div>
    )
  }

  // Split: ongoing first, then completed/others
  const ongoing   = stories.filter(s => s.status === "ONGOING")
  const rest      = stories.filter(s => s.status !== "ONGOING")

  return (
    <div className="flex flex-col gap-2">
      {ongoing.length > 0 && (
        <div className="bg-white border border-[#e5e5e5]">
          <div className="flex items-center gap-2 px-3 py-[10px] border-b border-[#f0f0f0]">
            <h2 className="text-[15px] font-bold border-l-[3px] border-ac pl-2">⚡ Đang ra</h2>
          </div>
          {ongoing.map(s => <WorkCard key={s.id} s={s} />)}
        </div>
      )}

      {rest.length > 0 && (
        <div className="bg-white border border-[#e5e5e5]">
          <div className="flex items-center gap-2 px-3 py-[10px] border-b border-[#f0f0f0]">
            <h2 className="text-[15px] font-bold border-l-[3px] border-ac pl-2">📚 Tất cả tác phẩm</h2>
            <span className="text-[12px] text-[#999]">{rest.length} tác phẩm</span>
          </div>
          {rest.map(s => <WorkCard key={s.id} s={s} />)}
        </div>
      )}
    </div>
  )
}
