"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AuthorsGrid   from "@/components/cms/authors/AuthorsGrid"
import AuthorsTable  from "@/components/cms/authors/AuthorsTable"
import ConfirmModal  from "@/components/cms/shared/ConfirmModal"
import Pagination    from "@/components/cms/shared/Pagination"
import { useToast }  from "@/components/cms/shared/Toast"

type AuthorItem = {
  id: number
  penname: string
  realname: string
  email: string
  initial: string
  color: string
  role: string
  isActive: boolean
  viewCount: string
  joinedAt: string
  _count: { stories: number }
}

type ViewMode = "grid" | "table"

export default function AuthorsPage() {
  const router = useRouter()
  const { showToast } = useToast()

  const [authors,  setAuthors]  = useState<AuthorItem[]>([])
  const [total,    setTotal]    = useState(0)
  const [page,     setPage]     = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading,  setLoading]  = useState(true)

  const [search,  setSearch]  = useState("")
  const [status,  setStatus]  = useState("")
  const [sort,    setSort]    = useState("name")
  const [view,    setView]    = useState<ViewMode>("grid")
  const [confirm, setConfirm] = useState<{ open: boolean; author?: AuthorItem }>({ open: false })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const sp = new URLSearchParams()
      if (search) sp.set("search", search)
      if (status) sp.set("isActive", status === "active" ? "true" : "false")
      sp.set("page",     String(page))
      sp.set("pageSize", String(pageSize))

      const res  = await fetch(`/api/cms/authors?${sp}`)
      const data = await res.json()
      setAuthors(data.items ?? [])
      setTotal(data.total   ?? 0)
    } finally {
      setLoading(false)
    }
  }, [search, status, page, pageSize])

  useEffect(() => { load() }, [load])

  const sorted = [...authors].sort((a, b) => {
    if (sort === "stories") return b._count.stories - a._count.stories
    if (sort === "views")   return parseFloat(b.viewCount) - parseFloat(a.viewCount)
    return a.penname.localeCompare(b.penname, "vi")
  })

  async function handleDelete(author: AuthorItem) {
    try {
      await fetch(`/api/cms/authors/${author.id}`, { method: "DELETE" })
      showToast(`Đã xóa tác giả "${author.penname}"`, "success")
      load()
    } catch {
      showToast("Xóa thất bại", "error")
    }
  }

  const adapted = sorted.map(a => ({
    id: a.id,
    penname: a.penname,
    realname: a.realname,
    email: a.email,
    initial: a.initial,
    color: a.color,
    role: a.role,
    status: a.isActive ? "active" : "inactive",
    stories: a._count.stories,
    views: a.viewCount,
    joined: new Date(a.joinedAt).toLocaleDateString("vi-VN"),
    bio: "",
  }))

  const selectCls = "px-2.5 py-[7px] border-[1.5px] border-[#e5e5e5] rounded-[7px] text-[13px] outline-none bg-white cursor-pointer focus:border-[#e5353e]"

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">Quản lý Tác giả</h1>
          <p className="text-[12.5px] text-[#888] mt-0.5">
            {loading ? "Đang tải..." : `Tổng cộng ${total} tác giả`}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex border-[1.5px] border-[#e5e5e5] rounded-[7px] overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`px-2.5 py-[5px] text-[12px] font-medium transition-colors border-r border-[#e5e5e5]
                ${view === "grid" ? "bg-[#f0f0f0] font-bold" : "bg-white hover:bg-[#f5f5f5]"}`}
            >⊞ Lưới</button>
            <button
              onClick={() => setView("table")}
              className={`px-2.5 py-[5px] text-[12px] font-medium transition-colors
                ${view === "table" ? "bg-[#f0f0f0] font-bold" : "bg-white hover:bg-[#f5f5f5]"}`}
            >☰ Bảng</button>
          </div>
          <Link
            href="/cms/authors/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-[7px] bg-[#e5353e] text-white rounded-[7px] text-[13px] font-medium hover:bg-[#b82830] transition-colors"
          >+ Thêm tác giả</Link>
        </div>
      </div>

      <div className="flex gap-2.5 mb-4">
        <input
          className="px-3 py-[7px] border-[1.5px] border-[#e5e5e5] rounded-[7px] text-[13px] w-[240px] outline-none focus:border-[#e5353e] transition-colors"
          placeholder="🔍  Tìm tác giả..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
        <select className={selectCls} value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}>
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
        <select className={selectCls} value={sort} onChange={e => setSort(e.target.value)}>
          <option value="name">Tên A–Z</option>
          <option value="stories">Nhiều truyện nhất</option>
          <option value="views">Lượt đọc cao nhất</option>
        </select>
      </div>

      {loading ? (
        <div className="py-16 text-center text-[13px] text-[#aaa]">Đang tải...</div>
      ) : view === "grid" ? (
        <>
          <AuthorsGrid
            authors={adapted}
            onEdit={id => router.push(`/cms/authors/${id}`)}
            onDelete={a => setConfirm({ open: true, author: authors.find(x => x.id === a.id) })}
            onStories={id => {
              const a = authors.find(x => x.id === id)
              showToast(`Lọc truyện của "${a?.penname}"`, "success")
              router.push("/cms/stories")
            }}
          />
          <div className="mt-3 bg-white rounded-[10px] border border-[#e5e5e5]">
            <Pagination page={page} pageSize={pageSize} total={total} onPage={setPage} onPageSize={s => { setPageSize(s); setPage(1) }} />
          </div>
        </>
      ) : (
        <div className="bg-white rounded-[10px] border border-[#e5e5e5] overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {[["Tác giả","38%"],["Số truyện",""],["Lượt đọc",""],["Tham gia",""],["Trạng thái",""],["Thao tác","110px"]].map(([h,w]) => (
                  <th
                    key={h}
                    className="bg-[#fafafa] text-[11.5px] font-semibold text-[#666] uppercase tracking-[.05em] px-3.5 py-2.5 text-left border-b border-[#e5e5e5] whitespace-nowrap"
                    style={w ? { width: w } : {}}
                  >{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AuthorsTable
                authors={adapted}
                onEdit={id => router.push(`/cms/authors/${id}`)}
                onDelete={a => setConfirm({ open: true, author: authors.find(x => x.id === a.id) })}
              />
            </tbody>
          </table>
          <Pagination page={page} pageSize={pageSize} total={total} onPage={setPage} onPageSize={s => { setPageSize(s); setPage(1) }} />
        </div>
      )}

      <ConfirmModal
        open={confirm.open}
        title={`Xóa tác giả "${confirm.author?.penname}"?`}
        message="Thao tác này không thể hoàn tác và sẽ không xóa các truyện liên quan."
        onConfirm={() => confirm.author && handleDelete(confirm.author)}
        onClose={() => setConfirm({ open: false })}
      />
    </>
  )
}
