"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import FormCard from "@/components/cms/shared/FormCard"
import ToggleSwitch from "@/components/cms/shared/ToggleSwitch"
import { useToast } from "@/components/cms/shared/Toast"

export type StoryFormData = {
  id?: number
  title?: string
  slug?: string
  author?: string
  authorId?: number | null
  synopsis?: string
  coverBg?: string
  coverEmoji?: string
  coverImage?: string
  status?: string
  isFeatured?: boolean
  updateSchedule?: string
  categoryId?: number
  categoryIds?: number[]
  category?: { id: number; name: string }
  tags?: { id: number; label: string }[]
}

interface StoryFormProps {
  story?: StoryFormData
}

type AuthorOption = { id: number; penname: string }
type CategoryOption = { id: number; name: string }

function slugify(s: string) {
  return s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d").replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-")
}

const fieldCls = "w-full px-3 py-2 border-[1.5px] border-[#e5e5e5] rounded-[7px] text-[13.5px] outline-none focus:border-[#e5353e] transition-colors"
const labelCls = "block text-[12px] font-semibold text-[#444] uppercase tracking-[.04em] mb-1.5"

export default function StoryForm({ story }: StoryFormProps) {
  const router = useRouter()
  const { showToast } = useToast()

  const [title,       setTitle]       = useState(story?.title      ?? "")
  const [slug,        setSlug]        = useState(story?.slug       ?? "")
  const [authorId,    setAuthorId]    = useState(story?.authorId ? String(story.authorId) : "")
  const [synopsis,    setSynopsis]    = useState(story?.synopsis   ?? "")
  const [categoryIds, setCategoryIds] = useState<number[]>(
    story?.categoryIds?.length    ? story.categoryIds :
    story?.categoryId             ? [story.categoryId] : []
  )
  const [status,      setStatus]      = useState(story?.status     ?? "ONGOING")
  const [schedule,   setSchedule]   = useState(story?.updateSchedule ?? "")
  const [coverBg,    setCoverBg]    = useState(story?.coverBg    ?? "#fde68a")
  const [coverEmoji, setCoverEmoji] = useState(story?.coverEmoji ?? "⚔️")
  const [coverImage, setCoverImage] = useState(story?.coverImage ?? "")
  const [uploading,  setUploading]  = useState(false)
  const [featured,   setFeatured]   = useState(story?.isFeatured ?? false)
  const [tags,       setTags]       = useState<string[]>(story?.tags?.map(t => t.label) ?? [])
  const [tagInput,   setTagInput]   = useState("")
  const [saving,     setSaving]     = useState(false)

  const [authors,    setAuthors]    = useState<AuthorOption[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])

  useEffect(() => {
    fetch("/api/cms/authors?pageSize=200")
      .then(r => r.json())
      .then(d => setAuthors(d.items ?? []))
      .catch(() => {})

    fetch("/api/cms/categories")
      .then(r => r.json())
      .then(d => setCategories(Array.isArray(d) ? d : []))
      .catch(() => {})
  }, [])

  function addTag(raw: string) {
    const label = raw.trim()
    if (label && !tags.includes(label)) setTags(prev => [...prev, label])
    setTagInput("")
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput) }
    if (e.key === "Backspace" && !tagInput) setTags(prev => prev.slice(0, -1))
  }

  function handleTitleChange(v: string) {
    setTitle(v)
    if (!story) setSlug(slugify(v))
  }

  function toggleCategory(id: number) {
    setCategoryIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      if (story?.id) fd.append("storyId", String(story.id))
      const res = await fetch("/api/cms/upload", { method: "POST", body: fd })
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Upload thất bại" }))
        showToast(error ?? "Upload thất bại", "error")
        return
      }
      const { url } = await res.json()
      setCoverImage(url)
    } catch {
      showToast("Upload ảnh thất bại.", "error")
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!title.trim())        { showToast("Vui lòng nhập tên truyện!", "error"); return }
    if (!categoryIds.length)  { showToast("Vui lòng chọn ít nhất một thể loại!", "error"); return }

    setSaving(true)
    try {
      const body = {
        title, slug, synopsis,
        author: authors.find(a => String(a.id) === authorId)?.penname ?? "",
        authorId: authorId ? Number(authorId) : null,
        categoryId: categoryIds[0],   // primary = first selected
        categoryIds,
        status, updateSchedule: schedule,
        coverBg, coverEmoji, coverImage, isFeatured: featured,
        tags,
      }

      const url = story?.id ? `/api/cms/stories/${story.id}` : "/api/cms/stories"
      const method = story?.id ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error(await res.text())

      showToast(`Đã lưu truyện "${title}" thành công!`, "success")
      router.push("/cms/stories")
    } catch (e) {
      console.error(e)
      showToast("Lưu thất bại, vui lòng thử lại.", "error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-[1fr_320px] gap-[18px] items-start">

      {/* Left column */}
      <div className="flex flex-col gap-4">
        <FormCard header="📝 Thông tin cơ bản">
          <div className="mb-4">
            <label className={labelCls}>Tên truyện <span className="text-[#e5353e]">*</span></label>
            <input className={fieldCls} placeholder="Nhập tên truyện..." value={title} onChange={e => handleTitleChange(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className={labelCls}>Slug (URL)</label>
            <input className={fieldCls} placeholder="ten-truyen-duoc-tao-tu-dong" value={slug} onChange={e => setSlug(e.target.value)} />
            <div className="text-[11.5px] text-[#999] mt-1">Tự động tạo từ tên truyện, dùng để tạo URL</div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Tác giả <span className="text-[#e5353e]">*</span></label>
            <select className={fieldCls} value={authorId} onChange={e => setAuthorId(e.target.value)}>
              <option value="">Chọn tác giả...</option>
              {authors.map(a => <option key={a.id} value={String(a.id)}>{a.penname}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Tóm tắt nội dung <span className="text-[#e5353e]">*</span></label>
            <textarea
              className={fieldCls}
              rows={5}
              placeholder="Viết tóm tắt nội dung truyện..."
              value={synopsis}
              onChange={e => setSynopsis(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>
        </FormCard>

        <FormCard header="🏷️ Phân loại">
          {/* Category multi-select */}
          <div className="mb-4">
            <label className={labelCls}>
              Thể loại <span className="text-[#e5353e]">*</span>
              {categoryIds.length > 0 && (
                <span className="ml-2 font-normal text-[#999] normal-case tracking-normal">
                  ({categoryIds.length} đã chọn)
                </span>
              )}
            </label>
            {categories.length === 0 ? (
              <div className="text-[12px] text-[#999] py-2">Đang tải thể loại…</div>
            ) : (
              <div className="flex flex-wrap gap-2 p-3 border-[1.5px] border-[#e5e5e5] rounded-[7px] max-h-[160px] overflow-y-auto">
                {categories.map(c => {
                  const checked = categoryIds.includes(c.id)
                  const isPrimary = categoryIds[0] === c.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCategory(c.id)}
                      className={[
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] text-[12.5px] font-medium border transition-all cursor-pointer select-none",
                        checked
                          ? "bg-[#fff0f0] text-[#e5353e] border-[#e5353e]"
                          : "bg-white text-[#555] border-[#e5e5e5] hover:border-[#e5353e] hover:text-[#e5353e]",
                      ].join(" ")}
                    >
                      <span className={[
                        "w-[14px] h-[14px] rounded-[3px] border flex items-center justify-center text-[10px] shrink-0",
                        checked ? "bg-[#e5353e] border-[#e5353e] text-white" : "border-[#ccc]",
                      ].join(" ")}>
                        {checked && "✓"}
                      </span>
                      {c.name}
                      {isPrimary && (
                        <span className="text-[10px] bg-[#e5353e] text-white px-1 rounded-[3px] leading-[1.4]">
                          chính
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
            <div className="text-[11.5px] text-[#999] mt-1">
              Thể loại đầu tiên được chọn sẽ là thể loại chính. Có thể chọn nhiều thể loại.
            </div>
          </div>

          {/* Status + Schedule side by side */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className={labelCls}>Trạng thái</label>
              <select className={fieldCls} value={status} onChange={e => setStatus(e.target.value)}>
                <option value="ONGOING">Đang ra</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="HIATUS">Tạm dừng</option>
                <option value="DROPPED">Đã drop</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Lịch cập nhật</label>
              <input className={fieldCls} placeholder="VD: Thứ 2, Thứ 4, Thứ 6" value={schedule} onChange={e => setSchedule(e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Tags</label>
            <div className="flex flex-wrap gap-1.5 p-2 border-[1.5px] border-[#e5e5e5] rounded-[7px] focus-within:border-[#e5353e] transition-colors min-h-[40px]">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#fff0f0] text-[#e5353e] border border-[#ffd6d8] rounded-[4px] text-[12px]">
                  {tag}
                  <button type="button" onClick={() => setTags(prev => prev.filter(t => t !== tag))} className="hover:text-[#b82830] leading-none">×</button>
                </span>
              ))}
              <input
                className="flex-1 min-w-[120px] text-[13.5px] outline-none bg-transparent"
                placeholder={tags.length ? "" : "Nhập tag, Enter để thêm..."}
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => tagInput.trim() && addTag(tagInput)}
              />
            </div>
            <div className="text-[11.5px] text-[#999] mt-1">Nhấn Enter hoặc dấu phẩy để thêm tag</div>
          </div>
        </FormCard>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-4">
        <FormCard header="🎨 Bìa truyện">
          <div className="flex gap-3.5 items-start">
            {/* Cover preview */}
            <div className="shrink-0">
              {coverImage ? (
                <img src={coverImage} alt="cover" className="w-20 h-20 rounded-[10px] object-cover border border-[#e5e5e5]" />
              ) : (
                <div
                  className="w-20 h-20 rounded-[10px] grid place-items-center text-[36px] border-2 border-dashed border-[#e5e5e5]"
                  style={{ background: coverBg }}
                >
                  {coverEmoji}
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-2.5">
              {/* Upload area */}
              <div>
                <label className={labelCls}>Ảnh bìa</label>
                <label className="flex items-center justify-center gap-2 w-full px-3 py-2 border-[1.5px] border-dashed border-[#e5e5e5] rounded-[7px] text-[12.5px] text-[#777] cursor-pointer hover:border-[#e5353e] hover:text-[#e5353e] transition-colors">
                  {uploading ? "Đang tải..." : coverImage ? "Thay ảnh khác" : "📤 Tải ảnh (jpg/png/webp, ≤5MB)"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
                {coverImage && (
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="mt-1 text-[11.5px] text-[#999] hover:text-[#e5353e] transition-colors"
                  >
                    × Xóa ảnh (dùng màu+emoji)
                  </button>
                )}
                <div className="text-[11.5px] text-[#999] mt-1">Ảnh ưu tiên hiển thị. Nếu không có ảnh, dùng màu+emoji.</div>
              </div>
              <div>
                <label className={labelCls}>Màu nền</label>
                <input className={fieldCls} value={coverBg} placeholder="#rrggbb" onChange={e => setCoverBg(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Emoji bìa</label>
                <input className={fieldCls} value={coverEmoji} placeholder="⚔️" onChange={e => setCoverEmoji(e.target.value)} />
              </div>
            </div>
          </div>
        </FormCard>

        <FormCard header="⚙️ Tùy chọn">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-[13px]">Truyện nổi bật</div>
              <div className="text-[11.5px] text-[#999]">Hiển thị ở slider trang chủ</div>
            </div>
            <ToggleSwitch checked={featured} onChange={setFeatured} title="Truyện nổi bật" />
          </div>
        </FormCard>

        <FormCard header="✅ Xuất bản" headerClass="bg-[#f0fdf4]" className="border-[#d1fae5]">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex justify-center items-center gap-2 px-3.5 py-2.5 bg-[#e5353e] text-white rounded-[7px] text-[13px] font-semibold hover:bg-[#b82830] transition-colors mb-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Đang lưu..." : "💾 Lưu truyện"}
          </button>
          <button
            onClick={() => router.push("/cms/stories")}
            className="w-full flex justify-center items-center gap-2 px-3.5 py-[9px] bg-white text-[#333] rounded-[7px] text-[13px] font-medium border-[1.5px] border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors"
          >
            Hủy bỏ
          </button>
        </FormCard>
      </div>
    </div>
  )
}
