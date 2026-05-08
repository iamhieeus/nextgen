import Badge from "@/components/cms/shared/Badge"
import type { AuthorRow } from "@/components/cms/authors/types"

interface AuthorsTableProps {
  authors:  AuthorRow[]
  onEdit:   (id: number) => void
  onDelete: (author: AuthorRow) => void
}

const TH = "bg-[#fafafa] text-[11.5px] font-semibold text-[#666] uppercase tracking-[.05em] px-3.5 py-2.5 text-left border-b border-[#e5e5e5] whitespace-nowrap"
const TD = "px-3.5 py-[11px] border-b border-[#f0f0f0] text-[13px] align-middle"

export default function AuthorsTable({ authors, onEdit, onDelete }: AuthorsTableProps) {
  if (!authors.length) {
    return (
      <tr>
        <td colSpan={6} className="text-center py-10 text-[#aaa]">Không tìm thấy tác giả nào</td>
      </tr>
    )
  }

  return (
    <>
      {authors.map(a => (
        <tr key={a.id} className="hover:[&>td]:bg-[#fafbfc]">
          <td className={TD}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full grid place-items-center text-[14px] font-bold text-white shrink-0"
                style={{ background: a.color }}
              >
                {a.initial}
              </div>
              <div>
                <div className="font-semibold">{a.penname}</div>
                <div className="text-[11.5px] text-[#888]">{a.email}</div>
              </div>
            </div>
          </td>
          <td className={TD}>{a.stories} truyện</td>
          <td className={TD}>{a.views}</td>
          <td className={TD}>{a.joined}</td>
          <td className={TD}>
            {a.status === "active"
              ? <Badge variant="green" dot>Hoạt động</Badge>
              : <Badge variant="gray"  dot>Nghỉ</Badge>
            }
          </td>
          <td className={TD}>
            <div className="flex items-center gap-1">
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
          </td>
        </tr>
      ))}
    </>
  )
}
