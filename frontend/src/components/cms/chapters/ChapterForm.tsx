"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import FormCard from "@/components/cms/shared/FormCard"
import ToggleSwitch from "@/components/cms/shared/ToggleSwitch"
import ContentEditor from "@/components/cms/chapters/ContentEditor"
import { useToast } from "@/components/cms/shared/Toast"

export interface ChapterData {
  id:          number
  chapterNo:   number
  title:       string
  volumeId:    number | null
  isFree:      boolean
  isPublished: boolean
  publishedAt: string | null
  paragraphs:  Array<{ sortOrder: number; type: string; text: string }>
}

interface Volume {
  id:   number
  name: string
}

interface ChapterFormProps {
  storyId:     number
  storyTitle:  string
  chapter?:    ChapterData
  volumes?:    Volume[]
}

const fieldCls = "w-full px-3 py-2 border-[1.5px] border-[#e5e5e5] rounded-[7px] text-[13.5px] outline-none focus:border-[#e5353e] transition-colors"
const labelCls = "block text-[12px] font-semibold text-[#444] uppercase tracking-[.04em] mb-1.5"

function paragraphsToText(paragraphs: Array<{ sortOrder: number; type: string; text: string }>): string {
  return [...paragraphs]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(p => p.type === "divider" ? "---" : p.text)
    .join("\n")
}

function textToParagraphs(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim()
    let type = "normal"
    if (trimmed === "---")           type = "divider"
    else if (/^\[ps\]/i.test(trimmed)) type = "ps"
    else if (/^\[kw\]/i.test(trimmed)) type = "kw"
    return { sortOrder: i, type, text: line }
  })
}

export default function ChapterForm({ storyId, storyTitle, chapter, volumes = [] }: ChapterFormProps) {
  const router = useRouter()
  const { showToast } = useToast()

  const [no,          setNo]          = useState(chapter?.chapterNo ?? 1)
  const [title,       setTitle]       = useState(chapter?.title ?? "")
  const [volumeId,    setVolumeId]    = useState<string>(chapter?.volumeId ? String(chapter.volumeId) : "")
  const [free,        setFree]        = useState(chapter?.isFree ?? true)
  const [isDraft,     setIsDraft]     = useState(chapter ? !chapter.isPublished : false)
  const [publishedAt, setPublishedAt] = useState(chapter?.publishedAt ?? "")
  const [charCount,   setCharCount]   = useState(0)
  const [wordCount,   setWordCount]   = useState(0)
  const [contentText, setContentText] = useState("")
  const [isSaving,    setIsSaving]    = useState(false)

  const handleWordCount = useCallback((chars: number, words: number) => {
    setCharCount(chars)
    setWordCount(words)
  }, [])

  async function handleSave() {
    if (!title.trim()) { showToast("Vui lòng nhập tiêu đề chương!", "error"); return }

    setIsSaving(true)
    try {
      const paragraphs = textToParagraphs(contentText)
      const body = {
        chapterNo:   no,
        title:       title.trim(),
        volumeId:    volumeId ? Number(volumeId) : null,
        isFree:      free,
        isPublished: !isDraft,
        wordCount:   String(wordCount),
        paragraphs,
      }

      let res: Response
      if (chapter) {
        res = await fetch(`/api/cms/chapters/${chapter.id}`, {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(body),
        })
      } else {
        res = await fetch(`/api/cms/stories/${storyId}/chapters`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(body),
        })
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }

      const label = isDraft ? "Đã lưu nháp" : "Đã đăng"
      showToast(`${label} Chương ${no}: ${title}`, "success")
      router.push(`/cms/stories/${storyId}/chapters`)
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Lưu thất bại", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const initialText = chapter ? paragraphsToText(chapter.paragraphs) : ""

  return (
    <div className="flex gap-[18px] items-start">

      {/* LEFT: editor */}
      <div className="flex-1 min-w-0">
        <FormCard header="📝 Nội dung chương">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className={labelCls}>Số chương <span className="text-[#e5353e]">*</span></label>
              <input type="number" className={fieldCls} min={1} value={no} onChange={e => setNo(Number(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Tiêu đề chương <span className="text-[#e5353e]">*</span></label>
              <input className={fieldCls} placeholder="Tiêu đề chương..." value={title} onChange={e => setTitle(e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Nội dung chương <span className="text-[#e5353e]">*</span></label>
            <ContentEditor initialText={initialText} onWordCount={handleWordCount} onContentChange={setContentText} />
          </div>
        </FormCard>
      </div>

      {/* RIGHT: metadata */}
      <div className="w-[280px] shrink-0 flex flex-col gap-3.5">

        {volumes.length > 0 && (
          <FormCard header="📁 Phân quyển">
            <div>
              <label className={labelCls}>Quyển</label>
              <select className={fieldCls} value={volumeId} onChange={e => setVolumeId(e.target.value)}>
                <option value="">Không thuộc quyển nào</option>
                {volumes.map(v => <option key={v.id} value={String(v.id)}>{v.name}</option>)}
              </select>
            </div>
          </FormCard>
        )}

        <FormCard header="⚙️ Cài đặt">
          <div className="flex justify-between items-center mb-3.5">
            <div>
              <div className="font-semibold text-[13px]">Chương miễn phí</div>
              <div className="text-[11.5px] text-[#999]">Tất cả có thể đọc</div>
            </div>
            <ToggleSwitch checked={free} onChange={setFree} title="Chương miễn phí" />
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isDraft}
              onChange={e => setIsDraft(e.target.checked)}
              className="w-4 h-4 cursor-pointer shrink-0"
              style={{ accentColor: "#e5353e" }}
            />
            <span>
              <span className="font-semibold text-[13px]">Lưu nháp</span>
              <span className="block text-[11.5px] text-[#999]">Bỏ tích để đăng công khai</span>
            </span>
          </label>
          {!isDraft && (
            <div className="mt-3">
              <label className={labelCls}>Ngày đăng</label>
              <input className={fieldCls} placeholder="dd/mm/yyyy hh:mm:ss" value={publishedAt} onChange={e => setPublishedAt(e.target.value)} />
              <div className="text-[11.5px] text-[#999] mt-1">Để trống = thời gian lưu</div>
            </div>
          )}
        </FormCard>

        <FormCard header="📊 Thống kê">
          <div className="flex justify-between text-[13px] mb-2">
            <span className="text-[#888]">Số ký tự</span>
            <strong>{charCount.toLocaleString("vi")}</strong>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-[#888]">Ước tính số từ</span>
            <strong>~{wordCount.toLocaleString("vi")} từ</strong>
          </div>
        </FormCard>

        <FormCard header="✅ Lưu chương" headerClass="bg-[#f0fdf4]" className="border-[#d1fae5]">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex justify-center items-center gap-2 px-3.5 py-2.5 bg-[#e5353e] text-white rounded-[7px] text-[13px] font-semibold hover:bg-[#b82830] transition-colors mb-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "Đang lưu..." : "💾 Lưu chương"}
          </button>
          <button
            onClick={() => router.push(`/cms/stories/${storyId}/chapters`)}
            disabled={isSaving}
            className="w-full flex justify-center items-center gap-2 px-3.5 py-[9px] bg-white text-[#333] rounded-[7px] text-[13px] font-medium border-[1.5px] border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors disabled:opacity-60"
          >
            Hủy bỏ
          </button>
        </FormCard>

      </div>
    </div>
  )
}
