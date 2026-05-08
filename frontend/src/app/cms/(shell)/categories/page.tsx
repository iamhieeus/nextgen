"use client"

import { useState, useEffect, useCallback } from "react"
import ConfirmModal from "@/components/cms/shared/ConfirmModal"
import Pagination   from "@/components/cms/shared/Pagination"
import { useToast } from "@/components/cms/shared/Toast"

type CategoryItem = {
  id: number
  name: string
  slug: string
  icon: string
  count: string
  sortOrder: number
  _count?: { stories: number }
}

const TH = "bg-[#fafafa] text-[11.5px] font-semibold text-[#666] uppercase tracking-[.05em] px-3.5 py-2.5 text-left border-b border-[#e5e5e5] whitespace-nowrap"
const TD = "px-3.5 py-[11px] border-b border-[#f0f0f0] text-[13px] align-middle"

export default function CategoriesPage() {
  const { showToast } = useToast()

  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [allItems,   setAllItems]   = useState<CategoryItem[]>([])
  const [total,      setTotal]      = useState(0)
  const [page,       setPage]       = useState(1)
  const [pageSize,   setPageSize]   = useState(20)
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState("")
  const [confirm,    setConfirm]    = useState<{ open: boolean; item?: CategoryItem }>({ open: false })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch("/api/cms/categories")
      const data: CategoryItem[] = await res.json()
      setAllItems(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // client-side filter + paginate
  useEffect(() => {
    const filtered = search
      ? allItems.filter(c =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.slug.toLowerCase().includes(search.toLowerCase())
        )
      : allItems
    setTotal(filtered.length)
    setCategories(filtered.slice((page - 1) * pageSize, page * pageSize))
  }, [allItems, search, page, pageSize])

  async function handleDelete(item: CategoryItem) {
    showToast(`Đã xóa thể loại "${item.name}"`, "success")
    setAllItems(prev => prev.filter(c => c.id !== item.id))
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">Quản lý Thể loại</h1>
          <p className="text-[12.5px] text-[#888] mt-0.5">
            {loading ? "Đang tải..." : `Tổng cộng ${allItems.length} thể loại`}
          </p>
        </div>
        <button
          onClick={() => showToast("Tính năng đang phát triển", "success")}
          className="inline-flex items-center gap-1.5 px-3.5 py-[7px] bg-[#e5353e] text-white rounded-[7px] text-[13px] font-medium hover:bg-[#b82830] transition-colors"
        >+ Thêm thể loại</button>
      </div>

      <div className="bg-white rounded-[10px] border border-[#e5e5e5] overflow-hidden">
        <div className="px-4 py-3.5 border-b border-[#e5e5e5] flex items-center gap-2.5">
          <input
            className="px-3 py-[7px] border-[1.5px] border-[#e5e5e5] rounded-[7px] text-[13px] w-[220px] outline-none focus:border-[#e5353e] transition-colors"
            placeholder="🔍  Tìm thể loại..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Icon","Tên thể loại","Slug","Số truyện","Thứ tự","Thao tác"].map(h => (
                <th key={h} className={TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-10 text-center text-[13px] text-[#aaa]">Đang tải...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={6} className="py-10 text-center text-[13px] text-[#aaa]">Không tìm thấy thể loại nào</td></tr>
            ) : categories.map(c => (
              <tr key={c.id} className="hover:[&>td]:bg-[#fafbfc]">
                <td className={TD}>{c.icon}</td>
                <td className={TD}><strong>{c.name}</strong></td>
                <td className={TD}>
                  <code className="bg-[#f3f4f6] text-[#374151] px-1.5 py-0.5 rounded text-[12px]">{c.slug}</code>
                </td>
                <td className={TD}>{c.count}</td>
                <td className={TD}>{c.sortOrder}</td>
                <td className={TD}>
                  <div className="flex items-center gap-1">
                    <button
                      title="Sửa"
                      onClick={() => showToast("Tính năng đang phát triển", "success")}
                      className="p-1.5 rounded-[5px] text-[14px] hover:bg-[#f0f0f0] text-[#555] transition-colors"
                    >✏️</button>
                    <button
                      title="Xóa"
                      onClick={() => setConfirm({ open: true, item: c })}
                      className="p-1.5 rounded-[5px] text-[14px] hover:bg-[#fff0f0] text-[#e5353e] border border-[#ffd6d8] hover:border-[#e5353e] transition-colors"
                    >🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
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
        title={`Xóa thể loại "${confirm.item?.name}"?`}
        message="Không thể khôi phục sau khi xóa."
        onConfirm={() => confirm.item && handleDelete(confirm.item)}
        onClose={() => setConfirm({ open: false })}
      />
    </>
  )
}
