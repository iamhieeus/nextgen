"use client"

import { CATEGORIES } from "@/data/cms-mock"
import { useToast } from "@/components/cms/shared/Toast"

interface CategoriesTableProps {
  onDelete: (name: string) => void
}

const TH = "bg-[#fafafa] text-[11.5px] font-semibold text-[#666] uppercase tracking-[.05em] px-3.5 py-2.5 text-left border-b border-[#e5e5e5] whitespace-nowrap"
const TD = "px-3.5 py-[11px] border-b border-[#f0f0f0] text-[13px] align-middle"

export default function CategoriesTable({ onDelete }: CategoriesTableProps) {
  const { showToast } = useToast()

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {["Icon","Tên thể loại","Slug","Số truyện","Thứ tự","Thao tác"].map(h => (
            <th key={h} className={TH}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {CATEGORIES.map(c => (
          <tr key={c.slug} className="hover:[&>td]:bg-[#fafbfc]">
            <td className={TD}>{c.icon}</td>
            <td className={TD}><strong>{c.name}</strong></td>
            <td className={TD}>
              <code className="bg-[#f3f4f6] text-[#374151] px-1.5 py-0.5 rounded text-[12px]">{c.slug}</code>
            </td>
            <td className={TD}>{c.stories}</td>
            <td className={TD}>{c.order}</td>
            <td className={TD}>
              <div className="flex items-center gap-1">
                <button
                  title="Sửa"
                  onClick={() => showToast("Chỉnh sửa thể loại", "success")}
                  className="p-1.5 rounded-[5px] text-[14px] hover:bg-[#f0f0f0] text-[#555] transition-colors"
                >✏️</button>
                <button
                  title="Xóa"
                  onClick={() => onDelete(c.name)}
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
