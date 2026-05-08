import Link from "next/link"
import Badge from "@/components/cms/shared/Badge"
import { getCmsStats } from "@/services/cms/story.service"

function statusBadge(status: string) {
  if (status === "ONGOING")   return <Badge variant="green"  dot>Đang ra</Badge>
  if (status === "HIATUS")    return <Badge variant="yellow" dot>Tạm dừng</Badge>
  if (status === "COMPLETED") return <Badge variant="blue"   dot>Hoàn thành</Badge>
  return <Badge variant="gray" dot>Drop</Badge>
}

export default async function RecentStoriesWidget() {
  const { recentStories } = await getCmsStats()

  return (
    <div className="bg-white rounded-[10px] border border-[#e5e5e5] overflow-hidden">
      <div className="px-[18px] py-[14px] border-b border-[#e5e5e5] font-semibold text-[14px]">
        🕐 Truyện mới nhất trong hệ thống
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Tên truyện", "Thể loại", "Số chương", "Trạng thái"].map(h => (
              <th key={h} className="bg-[#fafafa] text-[11.5px] font-semibold text-[#666] uppercase tracking-[.05em] px-3.5 py-2.5 text-left border-b border-[#e5e5e5] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recentStories.map(row => (
            <tr key={row.id} className="hover:[&>td]:bg-[#fafbfc]">
              <td className="px-3.5 py-[11px] border-b border-[#f0f0f0] text-[13px]">
                <div className="flex items-center gap-[11px]">
                  <div className="w-9 h-9 rounded-[6px] grid place-items-center text-[18px] shrink-0" style={{ background: row.coverBg || "#f0f0f0" }}>
                    {row.coverEmoji || "📚"}
                  </div>
                  <div>
                    <Link href={`/cms/stories/${row.id}`} className="font-semibold text-[#1a1a1a] leading-snug mb-px hover:text-[#e5353e] transition-colors">
                      {row.title}
                    </Link>
                    <div className="text-[12px] text-[#888]">{row.author}</div>
                  </div>
                </div>
              </td>
              <td className="px-3.5 py-[11px] border-b border-[#f0f0f0] text-[13px] text-[#666]">
                {row.category.name}
              </td>
              <td className="px-3.5 py-[11px] border-b border-[#f0f0f0] text-[13px] text-[#666]">
                {row.chapterCount}
              </td>
              <td className="px-3.5 py-[11px] border-b border-[#f0f0f0] text-[13px]">
                {statusBadge(row.status)}
              </td>
            </tr>
          ))}
          {recentStories.length === 0 && (
            <tr>
              <td colSpan={4} className="px-3.5 py-8 text-center text-[13px] text-[#aaa]">
                Chưa có truyện nào trong hệ thống
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
