import Link from "next/link"
import type { SearchSidebarData } from "@/services/search.service"
import CoverBox from "@/components/story/CoverBox"

const RANK_COLOR = [
  "bg-ac text-white",
  "bg-[#f97316] text-white",
  "bg-[#eab308] text-white",
]

function SbPanel({ children }: { children: React.ReactNode }) {
  return <div className="bg-white border border-[#e5e5e5] mb-[10px]">{children}</div>
}

function SbHeader({ title, more }: { title: string; more?: string }) {
  return (
    <div className="bg-ac px-[12px] py-[8px] flex items-center justify-between">
      <h3 className="text-[13px] font-bold text-white">{title}</h3>
      {more && (
        <a href="#" className="text-[11px] text-white/75 hover:text-white transition-colors">
          {more}
        </a>
      )}
    </div>
  )
}

export default function SearchSidebar({ data }: { data: SearchSidebarData }) {
  return (
    <aside className="w-[220px] flex-shrink-0">

      {/* Login CTA */}
      <div className="bg-[#fff5f5] border border-[#ffb3b5] p-[14px] text-center mb-[10px]">
        <div className="text-[30px] mb-[6px]">📚</div>
        <div className="text-[13px] font-bold text-ac mb-[4px]">Tủ Sách Của Tôi</div>
        <p className="text-[11px] text-[#888] mb-[10px] leading-[1.5]">
          Đăng nhập để lưu truyện và đồng bộ tiến trình
        </p>
        <a href="#" className="block bg-ac text-white py-[6px] text-[12px] font-semibold mb-[6px] rounded-[2px] hover:bg-ac-dk transition-colors">
          Đăng nhập
        </a>
      </div>

      {/* Ranking */}
      <SbPanel>
        <SbHeader title="🏆 Bảng Xếp Hạng" more="Xem thêm" />
        <div>
          {data.ranking.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="flex items-center gap-2 px-[12px] py-[7px] border-b border-[#f5f5f5] last:border-none group hover:bg-ac-lt transition-colors"
            >
              <span
                className={[
                  "w-[18px] h-[18px] rounded-[2px] flex items-center justify-center text-[11px] font-bold flex-shrink-0",
                  RANK_COLOR[i] ?? "bg-[#f0f0f0] text-[#888]",
                ].join(" ")}
              >
                {i + 1}
              </span>
              <span className="flex-1 text-[12px] truncate group-hover:text-ac transition-colors">
                {item.title}
              </span>
              <span className="text-[11px] text-[#999] whitespace-nowrap">{item.viewCount}</span>
            </Link>
          ))}
        </div>
      </SbPanel>

      {/* Recommended */}
      {data.recommended.length > 0 && (
        <SbPanel>
          <SbHeader title="⭐ Đề Xuất Cho Bạn" more="Xem thêm" />
          <div>
            {data.recommended.map((book, i) => (
              <Link
                key={i}
                href={book.href}
                className="flex gap-[9px] px-[12px] py-[8px] border-b border-[#f5f5f5] last:border-none group hover:bg-ac-lt transition-colors"
              >
                <CoverBox cover={book.cover} className="w-[40px] h-[54px] flex-shrink-0 shadow-[0_1px_4px_rgba(0,0,0,.12)]" emojiSize="text-[18px]" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-bold truncate group-hover:text-ac transition-colors">
                    {book.title}
                  </div>
                  <div className="text-[11px] text-[#999] truncate">{book.author}</div>
                  <div className="text-[11px] text-[#999] truncate">{book.category}</div>
                </div>
              </Link>
            ))}
          </div>
        </SbPanel>
      )}

      {/* Related tags */}
      {data.relatedTags.length > 0 && (
        <SbPanel>
          <SbHeader title="🏷️ Từ Khóa Liên Quan" />
          <div className="flex flex-wrap gap-[5px] p-[10px_12px]">
            {data.relatedTags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="text-[12px] px-[9px] py-[3px] border border-[#e0e0e0] rounded-[2px] text-[#555] hover:border-ac hover:text-ac transition-all"
              >
                {tag}
              </Link>
            ))}
          </div>
        </SbPanel>
      )}

    </aside>
  )
}
