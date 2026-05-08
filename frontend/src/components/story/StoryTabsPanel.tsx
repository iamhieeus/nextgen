"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { findChapter } from "@/actions/chapter"

type ChapterItem = { no: string; title: string; date: string; free: boolean }
type Volume = { name: string; range: string; defaultOpen: boolean; chapters: ChapterItem[] }
type RatingBar = { star: string; pct: number; count: number }
type Comment = { initial: string; avatarBg: string; name: string; badge?: string; time: string; text: string; likes: number; replies: number; liked?: boolean }

type Props = {
  storySlug: string
  chapterCount: number
  lastUpdatedAt: string | null
  introFull: string[]
  rating: number
  ratingCount: number
  volumes: Volume[]
  ratingBars: RatingBar[]
  comments: Comment[]
  chapterPage: number
  chapterPageSize: number
}

type Tab = "chapters" | "intro" | "comments"

// ─── Chapter Pagination ───────────────────────────────────────────────────────
function ChapterPagination({ page, totalPages }: { page: number; totalPages: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [inputVal, setInputVal] = useState(String(page))

  useEffect(() => { setInputVal(String(page)) }, [page])

  const goTo = useCallback(
    (p: number) => {
      const clamped = Math.min(Math.max(1, p), totalPages)
      const params = new URLSearchParams(searchParams.toString())
      params.set("chapterPage", String(clamped))
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams, totalPages]
  )

  const commitInput = () => {
    const n = parseInt(inputVal)
    if (isNaN(n)) { setInputVal(String(page)); return }
    goTo(n)
    setInputVal(String(Math.min(Math.max(1, n), totalPages)))
  }

  if (totalPages <= 1) return null

  const navBtn = (label: string, onClick: (() => void) | null, disabled: boolean) => (
    <button
      onClick={onClick ?? undefined}
      disabled={disabled}
      className={`w-8 h-8 flex items-center justify-center rounded-full text-[16px] transition-colors ${
        disabled ? "text-[#ccc] cursor-not-allowed" : "text-[#555] hover:text-ac cursor-pointer"
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="flex justify-center mt-3 pb-1">
      <div className="inline-flex items-center gap-2 bg-white rounded-full shadow-sm border border-[#ebebeb] px-3 py-1">
        {navBtn("«", page > 1 ? () => goTo(1) : null, page <= 1)}
        {navBtn("‹", page > 1 ? () => goTo(page - 1) : null, page <= 1)}
        <span className="text-[13px] text-[#555] font-medium select-none">Trang</span>
        <input
          type="text"
          inputMode="numeric"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onBlur={commitInput}
          onKeyDown={e => e.key === "Enter" && commitInput()}
          className="w-[36px] h-[30px] border border-[#ddd] rounded-[6px] text-center text-[13px] font-semibold text-[#333] outline-none focus:border-ac transition-colors"
        />
        <span className="text-[13px] text-[#555] select-none">/ {totalPages}</span>
        {navBtn("›", page < totalPages ? () => goTo(page + 1) : null, page >= totalPages)}
        {navBtn("»", page < totalPages ? () => goTo(totalPages) : null, page >= totalPages)}
      </div>
    </div>
  )
}

// ─── Chapter List ─────────────────────────────────────────────────────────────
function ChapterList({ storySlug, chapterCount, lastUpdatedAt, volumes, chapterPage, chapterPageSize }: {
  storySlug: string
  chapterCount: number
  lastUpdatedAt: string | null
  volumes: Volume[]
  chapterPage: number
  chapterPageSize: number
}) {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()

  const [openVols, setOpenVols] = useState<Record<number, boolean>>(
    Object.fromEntries(volumes.map((v, i) => [i, v.defaultOpen]))
  )
  const [sortNew, setSortNew] = useState(false)
  const [jumpVal, setJumpVal] = useState("")
  const [jumpError, setJumpError] = useState("")
  const [jumping, setJumping] = useState(false)

  const toggle = (i: number) => setOpenVols((prev) => ({ ...prev, [i]: !prev[i] }))

  const totalPages = Math.ceil(chapterCount / chapterPageSize)
  const pageStart  = (chapterPage - 1) * chapterPageSize + 1
  const pageEnd    = Math.min(chapterPage * chapterPageSize, chapterCount)

  const jumpToChapter = async () => {
    const no = parseInt(jumpVal)
    if (isNaN(no) || no < 1) return
    setJumping(true)
    setJumpError("")
    const result = await findChapter(storySlug, no)
    setJumping(false)
    if (!result) {
      setJumpError(`Không tìm thấy chương ${no}`)
      return
    }
    setJumpVal("")
    router.push(result.path)
  }

  return (
    <div className="p-4 px-5">
      {/* Controls */}
      <div className="flex items-center justify-between mb-[14px]">
        <div className="text-[13px] text-[#999]">
          Tổng cộng <strong className="text-[#333]">{chapterCount.toLocaleString()} chương</strong>
          {lastUpdatedAt && <>{" · "}Cập nhật: <strong className="text-[#333]">{lastUpdatedAt}</strong></>}
        </div>
        <div className="flex items-center gap-2">
          {/* Jump to chapter */}
          <div className="flex flex-col items-end gap-[3px]">
            <div className={`flex items-center border rounded-[2px] overflow-hidden transition-colors ${jumpError ? "border-red-400" : "border-[#e5e5e5]"}`}>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Đến chương..."
                value={jumpVal}
                onChange={e => { setJumpVal(e.target.value); setJumpError("") }}
                onKeyDown={e => e.key === "Enter" && jumpToChapter()}
                className="w-[110px] px-2 py-1 text-[12px] text-[#333] placeholder-[#bbb] outline-none"
              />
              <button
                onClick={jumpToChapter}
                disabled={jumping}
                className="px-4 py-1 bg-[#f5f5f5] border-l border-[#e5e5e5] text-[12px] text-[#666] hover:bg-ac hover:text-white hover:border-ac disabled:opacity-50 transition-colors cursor-pointer"
              >
                {jumping ? "..." : "Đi"}
              </button>
            </div>
            {jumpError && <span className="text-[11px] text-red-500">{jumpError}</span>}
          </div>

          {/* Sort */}
          <div className="flex gap-[2px]">
            {(["Cũ → Mới", "Mới → Cũ"] as const).map((label, i) => (
              <button
                key={label}
                onClick={() => setSortNew(i === 1)}
                className={`text-[12px] px-3 py-1 border rounded-[2px] cursor-pointer transition-all ${
                  sortNew === (i === 1)
                    ? "bg-ac text-white border-ac"
                    : "bg-white text-[#666] border-[#e5e5e5] hover:border-ac hover:text-ac"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Volumes */}
      {volumes.map((vol, vi) => {
        const chs = sortNew ? [...vol.chapters].reverse() : vol.chapters
        return (
          <div key={vi}>
            <div
              onClick={() => toggle(vi)}
              className={`flex items-center gap-2 px-3 py-2 bg-[#f9f9f9] border border-[#e5e5e5] rounded-[2px] cursor-pointer mb-2 ${vi > 0 ? "mt-4" : ""}`}
            >
              <span className="text-[13px] text-ac font-bold">{openVols[vi] ? "▼" : "▶"}</span>
              <span className="text-[13px] font-bold flex-1">{vol.name}</span>
              <span className="text-[12px] text-[#999]">{vol.range}</span>
            </div>

            {openVols[vi] && (
              <div className="grid grid-cols-2 mb-1">
                {chs.map((ch, ci) => (
                  <Link
                    key={ci}
                    href={`/stories/${storySlug}/chapters/${ch.no.replace("Ch.", "")}`}
                    className="flex items-center gap-2 px-[10px] py-[7px] border-b border-[#f5f5f5] cursor-pointer hover:bg-[#fafafa] overflow-hidden group"
                  >
                    <span className="text-[11px] text-[#999] flex-shrink-0 w-[38px]">{ch.no}</span>
                    <span className="text-[13px] flex-1 overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-ac transition-colors">{ch.title}</span>
                    <span className="text-[11px] text-[#999] flex-shrink-0 whitespace-nowrap">{ch.date}</span>
                    {ch.free
                      ? <span className="text-[10px] bg-[#e8f5e9] text-[#2e7d32] px-[5px] py-[1px] rounded-[1px] flex-shrink-0 font-semibold">Miễn phí</span>
                      : <span className="text-[10px] bg-[#fff3e0] text-[#e65100] px-[5px] py-[1px] rounded-[1px] flex-shrink-0">🔒 VIP</span>
                    }
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-3 pt-2 border-t border-[#f5f5f5]">
          <div className="text-center text-[12px] text-[#999] mb-2">
            Chương {pageStart.toLocaleString()}–{pageEnd.toLocaleString()} / {chapterCount.toLocaleString()}
          </div>
          <ChapterPagination page={chapterPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}

// ─── Intro Tab ────────────────────────────────────────────────────────────────
function IntroTab({ introFull }: { introFull: string[] }) {
  return (
    <div className="p-6">
      <h3 className="text-[15px] font-bold border-l-[3px] border-ac pl-2 mb-4">Giới thiệu</h3>
      <div className="text-[14px] text-[#666] leading-[1.9] space-y-3">
        {introFull.map((para, i) => (
          <p key={i} className={`whitespace-pre-line${i === introFull.length - 1 ? " italic" : ""}`}>{para}</p>
        ))}
      </div>
    </div>
  )
}

// ─── Comments Tab ─────────────────────────────────────────────────────────────
function CommentsTab({ rating, ratingCount, ratingBars, comments }: { rating: number; ratingCount: number; ratingBars: RatingBar[]; comments: Comment[] }) {
  return (
    <div>
      {/* Rating summary */}
      <div className="p-5">
        <h3 className="text-[15px] font-bold border-l-[3px] border-ac pl-2 mb-4">Đánh giá</h3>
        <div className="flex gap-8 items-center mb-5 pb-5 border-b border-[#e5e5e5]">
          <div className="text-center">
            <div className="text-[48px] font-black text-amber-400 leading-none">{rating.toFixed(1)}</div>
            <div className="text-[18px] text-amber-400 my-1">★★★★★</div>
            <div className="text-[12px] text-[#999]">{ratingCount.toLocaleString()} đánh giá</div>
          </div>
          <div className="flex-1 flex flex-col gap-[5px]">
            {ratingBars.map((bar) => (
              <div key={bar.star} className="flex items-center gap-2">
                <span className="text-[12px] text-[#999] w-[30px] text-right flex-shrink-0">{bar.star}</span>
                <div className="flex-1 h-[6px] bg-[#eee] rounded-[3px] overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-[3px]" style={{ width: `${bar.pct}%` }} />
                </div>
                <span className="text-[11px] text-[#999] w-8 flex-shrink-0">{bar.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="px-5 pb-5 border-t border-[#e5e5e5]">
        <h3 className="text-[15px] font-bold border-l-[3px] border-ac pl-2 mt-5 mb-4">
          Bình luận
        </h3>

        {/* Input */}
        <div className="flex gap-[10px] mb-5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ac to-ac-dk flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0">K</div>
          <div className="flex-1">
            <textarea
              rows={3}
              placeholder="Chia sẻ cảm nhận của bạn về truyện này..."
              className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-[10px] text-[13px] resize-none outline-none text-[#333] focus:border-ac transition-colors"
            />
            <div className="flex justify-end mt-[6px]">
              <button className="bg-ac hover:bg-ac-dk text-white px-5 py-[7px] text-[13px] font-semibold rounded-[3px] cursor-pointer transition-colors">
                Gửi bình luận
              </button>
            </div>
          </div>
        </div>

        {/* Comment list */}
        {comments.map((cmt, i) => (
          <div key={i} className="flex gap-[10px] py-[14px] border-b border-[#f5f5f5] last:border-none">
            <div
              className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[14px] font-bold text-white"
              style={{ background: cmt.avatarBg }}
            >
              {cmt.initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[13px] font-bold">{cmt.name}</span>
                {cmt.badge && (
                  <span className="text-[10px] bg-ac-lt text-ac border border-[#ffc5c7] px-[6px] py-[1px] rounded-[1px] font-semibold">{cmt.badge}</span>
                )}
                <span className="text-[11px] text-[#999] ml-auto">{cmt.time}</span>
              </div>
              <p className="text-[13px] text-[#666] leading-[1.6]">{cmt.text}</p>
              <div className="flex gap-[14px] mt-[6px]">
                <span className={`text-[12px] cursor-pointer hover:text-ac transition-colors ${cmt.liked ? "text-ac" : "text-[#999]"}`}>
                  👍 {cmt.likes}
                </span>
                {cmt.replies > 0
                  ? <span className="text-[12px] text-[#999] cursor-pointer hover:text-ac transition-colors">💬 Trả lời ({cmt.replies})</span>
                  : <span className="text-[12px] text-[#999] cursor-pointer hover:text-ac transition-colors">💬 Trả lời</span>
                }
                <span className="text-[12px] text-[#999] cursor-pointer hover:text-ac transition-colors">⚑ Báo cáo</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function StoryTabsPanel({ storySlug, chapterCount, lastUpdatedAt, introFull, rating, ratingCount, volumes, ratingBars, comments, chapterPage, chapterPageSize }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("chapters")

  const tabs: { key: Tab; label: string; count?: string }[] = [
    { key: "chapters", label: "Danh sách chương", count: `(${chapterCount.toLocaleString()})` },
    { key: "intro", label: "Giới thiệu" },
    { key: "comments", label: "Bình luận" },
  ]

  return (
    <>
      {/* Tab bar */}
      <div className="flex border-b-2 border-[#e5e5e5] px-5 bg-white">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-[14px] font-semibold px-5 py-[13px] cursor-pointer border-b-2 -mb-[2px] transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? "text-ac border-ac"
                : "text-[#999] border-transparent hover:text-[#333]"
            }`}
          >
            {tab.label}
            {tab.count && <span className="text-[12px] font-normal text-[#999] ml-1">{tab.count}</span>}
          </div>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "chapters" && <ChapterList storySlug={storySlug} chapterCount={chapterCount} lastUpdatedAt={lastUpdatedAt} volumes={volumes} chapterPage={chapterPage} chapterPageSize={chapterPageSize} />}
      {activeTab === "intro"    && <IntroTab introFull={introFull} />}
      {activeTab === "comments" && <CommentsTab rating={rating} ratingCount={ratingCount} ratingBars={ratingBars} comments={comments} />}
    </>
  )
}
