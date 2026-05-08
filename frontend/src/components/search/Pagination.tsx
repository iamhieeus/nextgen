"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

const MAX_VISIBLE = 5

export default function Pagination({
  total,
  page,
  pageSize,
}: {
  total: number
  page: number
  pageSize: number
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(total / pageSize)

  const goTo = useCallback(
    (p: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", String(p))
      router.push(`/search?${params.toString()}`)
    },
    [router, searchParams]
  )

  if (totalPages <= 1) return null

  // Build page window
  const pages: (number | "…")[] = []
  const half = Math.floor(MAX_VISIBLE / 2)
  let start = Math.max(1, page - half)
  let end   = Math.min(totalPages, start + MAX_VISIBLE - 1)
  if (end - start < MAX_VISIBLE - 1) start = Math.max(1, end - MAX_VISIBLE + 1)

  if (start > 1) { pages.push(1); if (start > 2) pages.push("…") }
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPages) { if (end < totalPages - 1) pages.push("…"); pages.push(totalPages) }

  const btn = (
    label: React.ReactNode,
    onClick: (() => void) | null,
    active = false,
    disabled = false
  ) => (
    <button
      key={String(label)}
      onClick={onClick ?? undefined}
      disabled={disabled}
      className={[
        "w-[30px] h-[30px] flex items-center justify-center border text-[13px] rounded-[2px] transition-all",
        active   ? "bg-ac border-ac text-white font-bold cursor-default" :
        disabled ? "border-[#e5e5e5] text-[#ccc] cursor-not-allowed" :
                   "border-[#e5e5e5] text-[#666] hover:border-ac hover:text-ac cursor-pointer",
      ].join(" ")}
    >
      {label}
    </button>
  )

  return (
    <div className="flex justify-center items-center gap-1 mt-3">
      {btn("‹", page > 1 ? () => goTo(page - 1) : null, false, page <= 1)}
      {pages.map((p, i) =>
        p === "…"
          ? <span key={`ellipsis-${i}`} className="px-1 text-[#999] text-[13px]">…</span>
          : btn(p, () => goTo(p as number), p === page)
      )}
      {btn("›", page < totalPages ? () => goTo(page + 1) : null, false, page >= totalPages)}
    </div>
  )
}
