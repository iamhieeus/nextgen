"use client"

import Link from "next/link"
import Badge from "@/components/cms/shared/Badge"

type StoryStatus = "ONGOING" | "COMPLETED" | "HIATUS" | "DROPPED"

export type StoryRow = {
  id: number
  title: string
  author: string
  status: StoryStatus | string
  coverBg: string
  coverEmoji: string
  coverImage?: string
  chapterCount: number
  ratingAvg: number
  category: { id: number; name: string; slug: string }
}

function statusBadge(s: string) {
  if (s === "ONGOING")   return <Badge variant="green"  dot>Đang ra</Badge>
  if (s === "COMPLETED") return <Badge variant="blue"   dot>Hoàn thành</Badge>
  if (s === "HIATUS")    return <Badge variant="yellow" dot>Tạm dừng</Badge>
  return <Badge variant="red" dot>Drop</Badge>
}

interface StoriesTableProps {
  stories:       StoryRow[]
  onEdit:        (id: number) => void
  onChapters:    (id: number) => void
  onDelete:      (story: StoryRow) => void
  onFilterAuthor:(name: string) => void
}

export default function StoriesTable({ stories, onEdit, onChapters, onDelete, onFilterAuthor }: StoriesTableProps) {
  if (!stories.length) {
    return (
      <tr>
        <td colSpan={6} className="text-center py-10 text-[#aaa]">Không tìm thấy truyện nào phù hợp</td>
      </tr>
    )
  }

  return (
    <>
      {stories.map(s => (
        <tr key={s.id} className="hover:[&>td]:bg-[#fafbfc]">
          <td className="px-3.5 py-[11px] border-b border-[#f0f0f0] text-[13px]">
            <div className="flex items-center gap-[11px]">
              {s.coverImage ? (
                <img src={s.coverImage} alt="" className="w-9 h-9 rounded-[6px] object-cover shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-[6px] grid place-items-center text-[18px] shrink-0" style={{ background: s.coverBg || "#f0f0f0" }}>
                  {s.coverEmoji || "📚"}
                </div>
              )}
              <div>
                <div className="font-semibold text-[#1a1a1a] leading-snug mb-px">{s.title}</div>
                <button
                  className="text-[12px] text-[#e5353e] hover:underline cursor-pointer"
                  onClick={() => onFilterAuthor(s.author)}
                  title="Lọc theo tác giả này"
                >
                  {s.author}
                </button>
              </div>
            </div>
          </td>
          <td className="px-3.5 py-[11px] border-b border-[#f0f0f0] text-[13px]">{s.category.name}</td>
          <td className="px-3.5 py-[11px] border-b border-[#f0f0f0] text-[13px]">
            <strong>{s.chapterCount}</strong> chương
          </td>
          <td className="px-3.5 py-[11px] border-b border-[#f0f0f0] text-[13px]">{statusBadge(s.status)}</td>
          <td className="px-3.5 py-[11px] border-b border-[#f0f0f0] text-[13px]">⭐ {s.ratingAvg.toFixed(1)}</td>
          <td className="px-3.5 py-[11px] border-b border-[#f0f0f0] text-[13px]">
            <div className="flex items-center gap-1">
              <button
                title="Sửa"
                onClick={() => onEdit(s.id)}
                className="p-1.5 rounded-[5px] text-[14px] hover:bg-[#f0f0f0] text-[#555] transition-colors"
              >✏️</button>
              <Link
                href={`/cms/stories/${s.id}/chapters`}
                title="Danh sách chương"
                className="p-1.5 rounded-[5px] text-[14px] hover:bg-[#f0f0f0] text-[#555] transition-colors"
              >📄</Link>
              <button
                title="Xóa"
                onClick={() => onDelete(s)}
                className="p-1.5 rounded-[5px] text-[14px] hover:bg-[#fff0f0] text-[#e5353e] border border-[#ffd6d8] hover:border-[#e5353e] transition-colors"
              >🗑️</button>
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}
