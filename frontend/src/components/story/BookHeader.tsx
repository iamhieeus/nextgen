import Link from "next/link"
import StoryActions from "./StoryActions"
import SynopsisCollapse from "./SynopsisCollapse"
import CoverBox from "./CoverBox"

type StoryDetail = {
  title: string
  author: string
  authorId: number | null
  genres: string[]
  status: "ongoing" | "completed"
  rating: number
  ratingCount: number
  views: string
  bookmarks: string
  chapterCount: number
  wordCount: string
  updateSchedule: string
  lastUpdatedAt?: string | null
  cover: { bg: string; emoji: string; image?: string }
  synopsis: string
  slug: string
  firstChapterNo: number | null
  lastChapterNo:  number | null
}

export default function BookHeader({ s }: { s: StoryDetail }) {
  return (
    <div className="flex gap-6 p-6">
      {/* Cover */}
      <div className="flex-shrink-0 relative">
        <CoverBox
          cover={s.cover}
          className="w-[180px] h-[240px] rounded-[4px] shadow-[2px_4px_16px_rgba(0,0,0,.22)]"
          emojiSize="text-[72px]"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/55 text-white text-[11px] font-semibold text-center py-1 tracking-[.5px]">
          📖 {s.status === "completed" ? "Hoàn thành" : "Đang ra"} · {s.chapterCount.toLocaleString()} ch
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h1 className="text-[24px] font-extrabold leading-[1.25] mb-2 text-[#222]">{s.title}</h1>

        {/* Meta row */}
        <div className="flex items-center gap-[10px] mb-[10px] flex-wrap text-[13px]">
          <span className="text-[#999]">Tác giả:</span>
          {s.authorId
            ? <Link href={`/authors/${s.authorId}`} className="text-ac font-semibold hover:text-ac-dk transition-colors">{s.author}</Link>
            : <span className="text-ac font-semibold">{s.author}</span>
          }
          {s.genres.map((g) => (
            <span key={g} className="text-[12px] bg-ac-lt text-ac border border-[#ffc5c7] px-[10px] py-[2px] rounded-[2px] font-medium">{g}</span>
          ))}
          {s.status === "completed"
            ? <span className="text-[12px] bg-[#e8f5e9] text-[#2e7d32] border border-[#a5d6a7] px-[10px] py-[2px] rounded-[2px] font-semibold">✅ Hoàn thành</span>
            : <span className="text-[12px] bg-[#e8f5e9] text-[#2e7d32] border border-[#a5d6a7] px-[10px] py-[2px] rounded-[2px] font-semibold">⚡ Đang ra</span>
          }
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-[14px]">
          <span className="text-amber-400 text-[15px] tracking-[1px]">★★★★★</span>
          <span className="text-[20px] font-extrabold text-amber-400">{s.rating}</span>
          <span className="text-[12px] text-[#999]">/ 5.0 &nbsp;·&nbsp; {s.ratingCount.toLocaleString()} đánh giá</span>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mb-4 py-3 border-t border-b border-[#e5e5e5]">
          {[
            { val: s.views,                           label: "👁 Lượt đọc" },
            { val: s.bookmarks,                       label: "🔖 Đánh dấu" },
            { val: s.chapterCount.toLocaleString(),   label: "📑 Chương" },
            { val: s.wordCount,                       label: "📝 Số từ" },
            { val: s.updateSchedule || s.lastUpdatedAt, label: "⏰ Cập nhật" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-[2px]">
              <span className="text-[16px] font-bold text-[#222]">{stat.val || "—"}</span>
              <span className="text-[11px] text-[#999]">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Synopsis */}
        <SynopsisCollapse text={s.synopsis} />

        {/* Actions */}
        <StoryActions
          storySlug={s.slug}
          firstChapterNo={s.firstChapterNo}
          lastChapterNo={s.lastChapterNo}
        />
      </div>
    </div>
  )
}
