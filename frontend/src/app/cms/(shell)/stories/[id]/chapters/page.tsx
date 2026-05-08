"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import ChaptersTable from "@/components/cms/chapters/ChaptersTable"
import ConfirmModal  from "@/components/cms/shared/ConfirmModal"
import Pagination    from "@/components/cms/shared/Pagination"
import { useToast }  from "@/components/cms/shared/Toast"

type ChapterItem = {
  id: number
  chapterNo: number
  title: string
  wordCount: string
  isFree: boolean
  isPublished: boolean
  viewCount: string
  publishedAt: string
  volumeId: number | null
  volume: { id: number; name: string } | null
  _count: { paragraphs: number; comments: number }
}

export default function ChaptersPage() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()

  const storyId = Number(params.id)

  const [chapters,   setChapters]   = useState<ChapterItem[]>([])
  const [storyTitle, setStoryTitle] = useState("")
  const [total,      setTotal]      = useState(0)
  const [page,       setPage]       = useState(1)
  const [pageSize,   setPageSize]   = useState(20)
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState("")
  const [confirm,    setConfirm]    = useState<{ open: boolean; chapter?: ChapterItem }>({ open: false })

  // fetch story title
  useEffect(() => {
    fetch(`/api/cms/stories/${storyId}`)
      .then(r => r.json())
      .then(d => setStoryTitle(d.title ?? ""))
      .catch(() => {})
  }, [storyId])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch(`/api/cms/stories/${storyId}/chapters`)
      const data: ChapterItem[] = await res.json()
      const filtered = search
        ? data.filter(c =>
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            String(c.chapterNo).includes(search)
          )
        : data
      setTotal(filtered.length)
      setChapters(filtered.slice((page - 1) * pageSize, page * pageSize))
    } finally {
      setLoading(false)
    }
  }, [storyId, search, page, pageSize])

  useEffect(() => { load() }, [load])

  async function handleDelete(chapter: ChapterItem) {
    try {
      await fetch(`/api/cms/chapters/${chapter.id}`, { method: "DELETE" })
      showToast(`Đã xóa chương ${chapter.chapterNo}`, "success")
      load()
    } catch {
      showToast("Xóa thất bại", "error")
    }
  }

  // adapt to ChaptersTable shape
  const adapted = chapters.map(c => ({
    no:          c.chapterNo,
    id:          c.id,
    title:       c.title,
    wordCount:   c.wordCount,
    isFree:      c.isFree,
    isPublished: c.isPublished,
    viewCount:   c.viewCount,
    publishedAt: new Date(c.publishedAt).toLocaleDateString("vi-VN"),
    volume:      c.volume?.name ?? "",
  }))

  return (
    <>
      <Link href="/cms/stories" className="inline-flex items-center gap-1.5 text-[13px] text-[#888] mb-4 hover:text-[#e5353e] transition-colors">
        ← Quay lại danh sách truyện
      </Link>

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">
            {storyTitle || "Truyện"} – Danh sách chương
          </h1>
          <p className="text-[12.5px] text-[#888] mt-0.5">
            {loading ? "Đang tải..." : `Tổng cộng ${total} chương`}
          </p>
        </div>
        <Link
          href={`/cms/stories/${storyId}/chapters/new`}
          className="inline-flex items-center gap-1.5 px-3.5 py-[7px] bg-[#e5353e] text-white rounded-[7px] text-[13px] font-medium hover:bg-[#b82830] transition-colors"
        >+ Thêm chương mới</Link>
      </div>

      <div className="bg-white rounded-[10px] border border-[#e5e5e5] overflow-hidden">
        <div className="px-4 py-3.5 border-b border-[#e5e5e5] flex items-center gap-2.5">
          <input
            className="px-3 py-[7px] border-[1.5px] border-[#e5e5e5] rounded-[7px] text-[13px] w-[200px] outline-none focus:border-[#e5353e] transition-colors"
            placeholder="🔍  Tìm chương..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        {loading ? (
          <div className="py-10 text-center text-[13px] text-[#aaa]">Đang tải...</div>
        ) : (
          <ChaptersTable
            chapters={adapted}
            onEdit={id => router.push(`/cms/stories/${storyId}/chapters/${id}`)}
            onDelete={c => {
              const full = chapters.find(x => x.chapterNo === c.no)
              if (full) setConfirm({ open: true, chapter: full })
            }}
          />
        )}

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
        title={`Xóa chương ${confirm.chapter?.chapterNo}?`}
        message="Thao tác này không thể hoàn tác."
        onConfirm={() => confirm.chapter && handleDelete(confirm.chapter)}
        onClose={() => setConfirm({ open: false })}
      />
    </>
  )
}
