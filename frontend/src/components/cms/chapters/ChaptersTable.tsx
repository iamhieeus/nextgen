"use client"

import Badge from "@/components/cms/shared/Badge"

export type ChapterRow = {
  id:          number
  no:          number
  title:       string
  volume:      string
  isFree:      boolean
  isPublished: boolean
  wordCount:   string
  publishedAt: string
}

interface ChaptersTableProps {
  chapters: ChapterRow[]
  onEdit:   (id: number) => void
  onDelete: (chapter: ChapterRow) => void
}

const TH = "bg-[#fafafa] text-[11.5px] font-semibold text-[#666] uppercase tracking-[.05em] px-3.5 py-2.5 text-left border-b border-[#e5e5e5] whitespace-nowrap"
const TD = "px-3.5 py-[11px] border-b border-[#f0f0f0] text-[13px] align-middle"

export default function ChaptersTable({ chapters, onEdit, onDelete }: ChaptersTableProps) {
  if (!chapters.length) {
    return (
      <div className="py-10 text-center text-[13px] text-[#aaa]">Chưa có chương nào</div>
    )
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className={TH}>Chương</th>
          <th className={TH}>Tiêu đề</th>
          <th className={TH}>Quyển</th>
          <th className={TH}>Loại</th>
          <th className={TH}>Số từ</th>
          <th className={TH}>Ngày đăng</th>
          <th className={TH}>Trạng thái</th>
          <th className={TH} style={{ width: 100 }}>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {chapters.map(c => (
          <tr key={c.no} className={`hover:[&>td]:bg-[#fafbfc] ${!c.isPublished ? "opacity-70" : ""}`}>
            <td className={TD}><strong>Ch.{c.no}</strong></td>
            <td className={TD}>
              {c.title}
              {!c.isPublished && <span className="text-[11px] text-[#aaa] ml-1">(nháp)</span>}
            </td>
            <td className={TD}><span className="text-[#888]">{c.volume || "—"}</span></td>
            <td className={TD}>
              {c.isFree
                ? <Badge variant="green">Miễn phí</Badge>
                : <Badge variant="yellow">VIP</Badge>
              }
            </td>
            <td className={TD}>{c.wordCount || "—"}</td>
            <td className={`${TD} text-[12.5px] text-[#555] whitespace-nowrap`}>
              {c.publishedAt || <span className="text-[#bbb]">—</span>}
            </td>
            <td className={TD}>
              {c.isPublished
                ? <Badge variant="blue" dot>Đã đăng</Badge>
                : <Badge variant="gray" dot>Nháp</Badge>
              }
            </td>
            <td className={TD}>
              <div className="flex items-center gap-1">
                <button
                  title="Sửa"
                  onClick={() => onEdit(c.id)}
                  className="p-1.5 rounded-[5px] text-[14px] hover:bg-[#f0f0f0] text-[#555] transition-colors"
                >✏️</button>
                <button
                  title="Xóa"
                  onClick={() => onDelete(c)}
                  className="p-1.5 rounded-[5px] text-[14px] hover:bg-[#fff0f0] text-[#e5353e] border border-[#ffd6d8] hover:border-[#e5353e] transition-colors"
                >🗑️</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
