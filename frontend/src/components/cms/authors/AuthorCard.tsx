import Badge from "@/components/cms/shared/Badge"
import type { AuthorRow } from "@/components/cms/authors/types"

interface AuthorCardProps {
  author:   AuthorRow
  onEdit:   (id: number) => void
  onDelete: (author: AuthorRow) => void
  onStories:(id: number) => void
}

export default function AuthorCard({ author: a, onEdit, onDelete, onStories }: AuthorCardProps) {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-[10px] p-[18px] flex flex-col gap-3 hover:shadow-[0_4px_18px_rgba(0,0,0,.08)] hover:border-[#d0d0d0] transition-all">

      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-full grid place-items-center text-[20px] font-bold text-white shrink-0"
          style={{ background: a.color }}
        >
          {a.initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-bold text-[#1a1a1a] leading-snug">
            {a.penname}
            {a.status === "inactive" && (
              <Badge variant="gray" className="text-[10px] ml-1">Nghỉ</Badge>
            )}
          </div>
          <div className="text-[12px] text-[#888] mt-px">
            {a.realname || <span className="text-[#bbb]">Chưa cập nhật</span>}
          </div>
          <div className="mt-1">
            <Badge variant="blue" className="text-[10px]">{a.role}</Badge>
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            title="Sửa"
            onClick={() => onEdit(a.id)}
            className="p-1.5 rounded-[5px] text-[14px] hover:bg-[#f0f0f0] text-[#555] transition-colors"
          >✏️</button>
          <button
            title="Xóa"
            onClick={() => onDelete(a)}
            className="p-1.5 rounded-[5px] text-[14px] hover:bg-[#fff0f0] text-[#e5353e] border border-[#ffd6d8] hover:border-[#e5353e] transition-colors"
          >🗑️</button>
        </div>
      </div>

      {/* Bio */}
      <div className="text-[12.5px] text-[#666] leading-[1.55] line-clamp-2">{a.bio}</div>

      {/* Stats */}
      <div className="flex gap-3.5 pt-2.5 border-t border-[#f0f0f0]">
        {[
          { val: a.stories,           lbl: "Truyện" },
          { val: a.views,             lbl: "Lượt đọc" },
          { val: a.joined, lbl: "Tham gia" },
        ].map(s => (
          <div key={s.lbl} className="text-center flex-1">
            <div className="text-[16px] font-bold text-[#1a1a1a]">{s.val}</div>
            <div className="text-[10.5px] text-[#aaa] uppercase tracking-[.04em]">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex gap-1.5 pt-2.5 border-t border-[#f0f0f0]">
        <button
          onClick={() => onStories(a.id)}
          className="flex-1 flex justify-center items-center gap-1.5 px-2.5 py-[5px] text-[12px] font-medium rounded-[7px] bg-white text-[#333] border-[1.5px] border-[#e5e5e5] hover:bg-[#f5f5f5] transition-all"
        >
          📚 Truyện ({a.stories})
        </button>
        <button
          onClick={() => onEdit(a.id)}
          className="flex-1 flex justify-center items-center gap-1.5 px-2.5 py-[5px] text-[12px] font-medium rounded-[7px] text-[#555] hover:bg-[#f0f0f0] hover:text-[#222] transition-all"
        >
          ✏️ Sửa
        </button>
      </div>
    </div>
  )
}
