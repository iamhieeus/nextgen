"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import StoriesFilters from "@/components/cms/stories/StoriesFilters"
import StoriesTable, { type StoryRow } from "@/components/cms/stories/StoriesTable"
import ConfirmModal  from "@/components/cms/shared/ConfirmModal"
import Pagination    from "@/components/cms/shared/Pagination"
import { useToast }  from "@/components/cms/shared/Toast"

export default function StoriesPage() {
  const router = useRouter()
  const { showToast } = useToast()

  const [stories,  setStories]  = useState<StoryRow[]>([])
  const [total,    setTotal]    = useState(0)
  const [page,     setPage]     = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading,  setLoading]  = useState(true)

  const [search,   setSearch]   = useState("")
  const [category, setCategory] = useState("")
  const [status,   setStatus]   = useState("")

  const [confirm, setConfirm] = useState<{ open: boolean; story?: StoryRow }>({ open: false })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const sp = new URLSearchParams()
      if (search)   sp.set("search",     search)
      if (category) sp.set("categoryId", category)
      if (status)   sp.set("status",     status)
      sp.set("page",     String(page))
      sp.set("pageSize", String(pageSize))

      const res  = await fetch(`/api/cms/stories?${sp}`)
      const data = await res.json()
      setStories(data.items ?? [])
      setTotal(data.total   ?? 0)
    } finally {
      setLoading(false)
    }
  }, [search, category, status, page, pageSize])

  useEffect(() => { load() }, [load])

  function handleClear() {
    setSearch(""); setCategory(""); setStatus(""); setPage(1)
  }

  async function handleDelete(story: StoryRow) {
    try {
      await fetch(`/api/cms/stories/${story.id}`, { method: "DELETE" })
      showToast(`Đã xóa truyện "${story.title}"`, "success")
      load()
    } catch {
      showToast("Xóa thất bại", "error")
    }
  }

  const subtitle = loading
    ? "Đang tải..."
    : `Tổng cộng ${total} truyện trong hệ thống`

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">Quản lý Truyện</h1>
          <p className="text-[12.5px] text-[#888] mt-0.5">{subtitle}</p>
        </div>
        <Link
          href="/cms/stories/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-[7px] bg-[#e5353e] text-white rounded-[7px] text-[13px] font-medium hover:bg-[#b82830] transition-colors"
        >
          + Thêm truyện mới
        </Link>
      </div>

      <div className="bg-white rounded-[10px] border border-[#e5e5e5] overflow-hidden">
        <StoriesFilters
          search={search} author="" category={category} status={status}
          onSearch={v  => { setSearch(v);   setPage(1) }}
          onAuthor={() => {}}
          onCategory={v => { setCategory(v); setPage(1) }}
          onStatus={v  => { setStatus(v);   setPage(1) }}
          onClear={handleClear}
        />

        <table className="w-full border-collapse">
          <thead>
            <tr>
              {[["Tên truyện","40%"],["Thể loại",""],["Số chương",""],["Trạng thái",""],["Đánh giá",""],["Thao tác","100px"]].map(([label, width]) => (
                <th
                  key={label}
                  className="bg-[#fafafa] text-[11.5px] font-semibold text-[#666] uppercase tracking-[.05em] px-3.5 py-2.5 text-left border-b border-[#e5e5e5] whitespace-nowrap"
                  style={width ? { width } : {}}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[13px] text-[#aaa]">Đang tải...</td>
              </tr>
            ) : (
              <StoriesTable
                stories={stories}
                onEdit={id => router.push(`/cms/stories/${id}`)}
                onChapters={id => router.push(`/cms/stories/${id}/chapters`)}
                onDelete={story => setConfirm({ open: true, story })}
                onFilterAuthor={name => { showToast(`Đang lọc truyện của "${name}"`, "success"); setSearch(name); setPage(1) }}
              />
            )}
          </tbody>
        </table>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPage={setPage}
          onPageSize={s => { setPageSize(s); setPage(1) }}
        />
      </div>

      <ConfirmModal
        open={confirm.open}
        title={`Xóa truyện "${confirm.story?.title}"?`}
        message="Tất cả chương và dữ liệu liên quan sẽ bị xóa vĩnh viễn."
        onConfirm={() => confirm.story && handleDelete(confirm.story)}
        onClose={() => setConfirm({ open: false })}
      />
    </>
  )
}
