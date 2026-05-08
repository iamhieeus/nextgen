"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

type Category = { name: string; slug: string }

const STATUS_OPTIONS = [
  { label: "Tất cả",    value: "" },
  { label: "Đang ra",   value: "ONGOING" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Tạm dừng",  value: "HIATUS" },
]

const WORDCOUNT_OPTIONS = [
  { label: "Tất cả",  value: "" },
  { label: "< 300k",  value: "lt300" },
  { label: "300k–1tr", value: "300to1m" },
  { label: "1tr–3tr",  value: "1mto3m" },
  { label: "> 3tr",    value: "gt3m" },
]

const UPDATE_OPTIONS = [
  { label: "Tất cả",  value: "" },
  { label: "Hôm nay", value: "today" },
  { label: "3 ngày",  value: "3days" },
  { label: "7 ngày",  value: "7days" },
]

export default function FilterPanel({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      params.delete("page")
      router.push(`/search?${params.toString()}`)
    },
    [router, searchParams]
  )

  const current = {
    category: searchParams.get("category") ?? "",
    status:   searchParams.get("status")   ?? "",
    wordCount: searchParams.get("wordCount") ?? "",
    update:   searchParams.get("update")   ?? "",
  }

  return (
    <aside className="w-[180px] flex-shrink-0 bg-white border border-[#e5e5e5] self-start">
      {/* Category */}
      <FilterGroup label="Thể loại">
        <FilterTag
          label="Tất cả"
          active={current.category === ""}
          onClick={() => setParam("category", "")}
        />
        {categories.map((c) => (
          <FilterTag
            key={c.slug}
            label={c.name}
            active={current.category === c.slug}
            onClick={() => setParam("category", c.slug)}
          />
        ))}
      </FilterGroup>

      {/* Status */}
      <FilterGroup label="Trạng thái">
        {STATUS_OPTIONS.map((o) => (
          <FilterTag
            key={o.value}
            label={o.label}
            active={current.status === o.value}
            onClick={() => setParam("status", o.value)}
          />
        ))}
      </FilterGroup>

      {/* Word count */}
      <FilterGroup label="Độ dài">
        {WORDCOUNT_OPTIONS.map((o) => (
          <FilterTag
            key={o.value}
            label={o.label}
            active={current.wordCount === o.value}
            onClick={() => setParam("wordCount", o.value)}
          />
        ))}
      </FilterGroup>

      {/* Update time */}
      <FilterGroup label="Cập nhật" last>
        {UPDATE_OPTIONS.map((o) => (
          <FilterTag
            key={o.value}
            label={o.label}
            active={current.update === o.value}
            onClick={() => setParam("update", o.value)}
          />
        ))}
      </FilterGroup>
    </aside>
  )
}

function FilterGroup({
  label,
  last = false,
  children,
}: {
  label: string
  last?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={`p-[10px_12px] ${last ? "" : "border-b border-[#e5e5e5]"}`}>
      <div className="text-[11px] font-bold text-[#999] uppercase tracking-[.5px] mb-[7px]">
        {label}
      </div>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  )
}

function FilterTag({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "text-[12px] px-2 py-[2px] border rounded-[2px] transition-all cursor-pointer",
        active
          ? "bg-ac border-ac text-white"
          : "border-[#e5e5e5] text-[#666] hover:border-ac hover:text-ac",
      ].join(" ")}
    >
      {label}
    </button>
  )
}
