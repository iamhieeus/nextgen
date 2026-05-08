import Link from "next/link"
import CoverBox from "@/components/story/CoverBox"

type SidebarTopItem = { rank: number; title: string; sub: string; cover: { bg: string; emoji: string; image?: string }; href?: string }

type AuthorItem = { rank: number; name: string; sub: string; cover: { bg: string }; href?: string }

const rankColor = ["text-ac", "text-[#e8892a]", "text-[#e8b52a]"]

const popularTags = ["Full", "Sủng", "HE", "BE", "18+", "Ngôn Tình Ngắn", "Nữ Cường", "Xuyên Không Cổ Đại", "Hài Hước", "Ngược Tâm", "Xuyên Nhanh", "Phản Diện", "Cung Đấu", "Thù Thành Ái", "Trọng Sinh Báo Thù", "HĐN"]
const ngonTinhTags = ["Ngôn Tình Full", "Ngôn Tình Hot", "Ngôn Tình Ngắn", "Ngôn Tình 18+", "Ngôn Tình Hài", "Ngôn Tình Hoàn", "Sủng Văn", "Ngược Văn"]

function SbPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-[#e5e5e5] ${className}`}>{children}</div>
  )
}

function SbHeader({ title, more }: { title: string; more?: string }) {
  return (
    <div className="bg-panel-hd px-[12px] py-[9px] flex items-center border-b border-[#e5e5e5]">
      <h3 className="text-[13px] font-bold text-ac flex-1">{title}</h3>
      {more && <a href="#" className="text-[11px] text-[#999] hover:text-ac transition-colors">{more}</a>}
    </div>
  )
}

export default function Sidebar({ sidebarTopMonth, featuredAuthors }: { sidebarTopMonth: SidebarTopItem[]; featuredAuthors: AuthorItem[] }) {
  return (
    <div className="w-[252px] flex-shrink-0 flex flex-col gap-[10px]">

      {/* Login prompt */}
      <SbPanel className="bg-panel-hd border-[#ffb3b5] p-[14px] text-center">
        <div className="text-[34px] mb-[6px]">📚</div>
        <div className="text-[13px] font-bold text-ac mb-[4px]">Tủ Sách Của Tôi</div>
        <p className="text-[11px] text-[#888] mb-[10px] leading-[1.5]">
          Đăng nhập để lưu truyện và đồng bộ tiến trình đọc đa thiết bị
        </p>
        <a href="#" className="block bg-ac text-white py-[7px] text-[12px] font-semibold mb-[7px] rounded-[2px] hover:bg-ac-dk transition-colors">
          Đăng nhập
        </a>
        <a href="#" className="block border border-ac text-ac py-[7px] text-[12px] rounded-[2px] hover:bg-ac-lt transition-colors">
          Đăng ký miễn phí
        </a>
      </SbPanel>

      {/* Top month */}
      <SbPanel>
        <SbHeader title="🏆 Top Tháng" more="Thêm →" />
        <div className="p-[8px_10px]">
          {sidebarTopMonth.map((item, i) => {
            const inner = (
              <>
                <span className={`w-[17px] text-center text-[12px] font-bold flex-shrink-0 ${rankColor[i] ?? "text-[#999]"}`}>
                  {item.rank}
                </span>
                <CoverBox cover={item.cover} className="w-[28px] h-[38px] rounded-[1px] flex-shrink-0" emojiSize="text-[15px]" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-ac transition-colors">{item.title}</div>
                  <div className="text-[11px] text-[#999]">{item.sub}</div>
                </div>
              </>
            )
            const cls = "flex items-center gap-[7px] py-[6px] border-b border-[#f5f5f5] last:border-none cursor-pointer group"
            return item.href
              ? <Link key={i} href={item.href} className={cls}>{inner}</Link>
              : <div key={i} className={cls}>{inner}</div>
          })}
        </div>
      </SbPanel>

      {/* Featured authors */}
      <SbPanel>
        <SbHeader title="✍️ Tác Giả Nổi Bật" more="Thêm →" />
        <div className="p-[8px_10px]">
          {featuredAuthors.map((author, i) => {
            const inner = (
              <>
                <span className={`w-[17px] text-center text-[12px] font-bold flex-shrink-0 ${rankColor[i] ?? "text-[#999]"}`}>
                  {author.rank}
                </span>
                <div
                  className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[13px] flex-shrink-0"
                  style={{ background: author.cover.bg }}
                >
                  ✍️
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-ac transition-colors">
                    {author.name}
                  </div>
                  <div className="text-[11px] text-[#999]">{author.sub}</div>
                </div>
              </>
            )
            const cls = "flex items-center gap-[7px] py-[6px] border-b border-[#f5f5f5] last:border-none cursor-pointer group"
            return author.href
              ? <Link key={i} href={author.href} className={cls}>{inner}</Link>
              : <div key={i} className={cls}>{inner}</div>
          })}
        </div>
      </SbPanel>

      {/* Popular tags */}
      <SbPanel>
        <SbHeader title="🏷️ Tags Phổ Biến" />
        <div className="flex flex-wrap gap-[5px] p-[8px_10px]">
          {popularTags.map((tag) => (
            <a key={tag} href="#" className="text-[11px] bg-[#f5f5f5] text-[#555] px-[8px] py-[3px] hover:bg-ac-lt hover:text-ac transition-all">
              {tag}
            </a>
          ))}
        </div>
      </SbPanel>

      {/* Ngôn tình tags */}
      <SbPanel>
        <SbHeader title="🌹 Ngôn Tình" />
        <div className="flex flex-wrap gap-[5px] p-[8px_10px]">
          {ngonTinhTags.map((tag) => (
            <a key={tag} href="#" className="text-[11px] bg-[#f5f5f5] text-[#555] px-[8px] py-[3px] hover:bg-ac-lt hover:text-ac transition-all">
              {tag}
            </a>
          ))}
        </div>
      </SbPanel>

      {/* App download */}
      <SbPanel className="bg-panel-hd border-[#ffb3b5] p-[14px] text-center">
        <div className="text-[26px] mb-[5px]">📱</div>
        <div className="text-[12px] font-bold text-ac mb-[3px] tracking-[1px]">Tải App Cấm Địa</div>
        <p className="text-[10px] text-[#888] mb-[10px] leading-[1.5]">
          Đọc offline · Chế độ tối · Đồng bộ đa thiết bị
        </p>
        <div className="flex gap-[6px] justify-center">
          <a href="#" className="bg-ac text-white px-[12px] py-[5px] text-[11px] font-semibold rounded-[2px] hover:bg-ac-dk transition-colors">Android</a>
          <a href="#" className="bg-white text-ac border border-ac px-[12px] py-[5px] text-[11px] font-semibold rounded-[2px] hover:bg-ac-lt transition-colors">iOS</a>
        </div>
      </SbPanel>

    </div>
  )
}
