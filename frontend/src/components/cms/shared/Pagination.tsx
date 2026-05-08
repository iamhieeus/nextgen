"use client"

const PAGE_SIZES = [10, 20, 30, 50]

interface PaginationProps {
  page:       number
  pageSize:   number
  total:      number
  onPage:     (p: number) => void
  onPageSize: (s: number) => void
}

export default function Pagination({ page, pageSize, total, onPage, onPageSize }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to   = Math.min(page * pageSize, total)

  // Build page number list: always show first, last, current ±2, with "…" gaps
  function buildPages(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const set = new Set<number>([1, totalPages, page - 1, page, page + 1, page - 2, page + 2]
      .filter(n => n >= 1 && n <= totalPages))
    const sorted = [...set].sort((a, b) => a - b)
    const result: (number | "…")[] = []
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…")
      result.push(sorted[i])
    }
    return result
  }

  const btnBase = "h-[30px] min-w-[30px] px-2 rounded-[5px] border text-[12px] font-medium transition-all flex items-center justify-center"
  const btnActive = "bg-[#e5353e] text-white border-[#e5353e]"
  const btnNormal = "bg-white text-[#555] border-[#e5e5e5] hover:bg-[#e5353e] hover:text-white hover:border-[#e5353e]"
  const btnDisabled = "bg-white text-[#ccc] border-[#e5e5e5] cursor-not-allowed"

  return (
    <div className="px-4 py-3 border-t border-[#e5e5e5] flex items-center justify-between gap-4 flex-wrap text-[12.5px] text-[#888]">

      {/* Left: info + page size */}
      <div className="flex items-center gap-3">
        <span>
          {total === 0 ? "Không có dữ liệu" : `Hiển thị ${from}–${to} trong ${total} bản ghi`}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] text-[#aaa]">Hiển thị</span>
          <select
            value={pageSize}
            onChange={e => { onPageSize(Number(e.target.value)); onPage(1) }}
            className="px-2 py-[3px] border-[1.5px] border-[#e5e5e5] rounded-[5px] text-[12px] outline-none bg-white cursor-pointer focus:border-[#e5353e]"
          >
            {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="text-[12px] text-[#aaa]">/ trang</span>
        </div>
      </div>

      {/* Right: nav buttons */}
      <div className="flex items-center gap-1">
        {/* First */}
        <button
          onClick={() => onPage(1)}
          disabled={page === 1}
          className={`${btnBase} ${page === 1 ? btnDisabled : btnNormal}`}
          title="Trang đầu"
        >«</button>

        {/* Prev */}
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className={`${btnBase} ${page === 1 ? btnDisabled : btnNormal}`}
          title="Trang trước"
        >‹</button>

        {/* Page numbers */}
        {buildPages().map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-1 text-[#aaa]">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={`${btnBase} ${p === page ? btnActive : btnNormal}`}
            >{p}</button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className={`${btnBase} ${page === totalPages ? btnDisabled : btnNormal}`}
          title="Trang sau"
        >›</button>

        {/* Last */}
        <button
          onClick={() => onPage(totalPages)}
          disabled={page === totalPages}
          className={`${btnBase} ${page === totalPages ? btnDisabled : btnNormal}`}
          title="Trang cuối"
        >»</button>
      </div>
    </div>
  )
}
