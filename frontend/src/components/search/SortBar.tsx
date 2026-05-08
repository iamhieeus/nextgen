"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

const SORT_OPTIONS = [
  { label: "Liên quan", value: "relevant" },
  { label: "Mới nhất",  value: "new" },
  { label: "Đánh giá", value: "rating" },
  { label: "Đề cử",    value: "votes" },
]

export default function SortBar({ q, total }: { q?: string; total: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get("sort") ?? "relevant"

  const setSort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("sort", value)
      params.delete("page")
      router.push(`/search?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="bg-white border border-[#e5e5e5] px-[14px] py-[10px] mb-2 flex items-center justify-between flex-wrap gap-2">
      <div className="text-[14px]">
        Kết quả cho:{" "}
        {q ? (
          <strong className="text-ac">&ldquo;{q}&rdquo;</strong>
        ) : (
          <span className="text-[#999]">Tất cả truyện</span>
        )}
        <span className="ml-3 text-[12px] text-[#999]">
          {total.toLocaleString("vi")} bộ
        </span>
      </div>

      <div className="flex items-center gap-[6px]">
        <span className="text-[12px] text-[#999] mr-1">Sắp xếp:</span>
        {SORT_OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => setSort(o.value)}
            className={[
              "text-[12px] px-[10px] py-[3px] border rounded-[2px] transition-all cursor-pointer",
              current === o.value
                ? "bg-ac border-ac text-white font-semibold"
                : "border-[#e5e5e5] text-[#666] hover:border-ac hover:text-ac",
            ].join(" ")}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
