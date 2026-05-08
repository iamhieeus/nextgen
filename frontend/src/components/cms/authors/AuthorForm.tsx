"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import FormCard from "@/components/cms/shared/FormCard"
import ToggleSwitch from "@/components/cms/shared/ToggleSwitch"
import { useToast } from "@/components/cms/shared/Toast"
import { AVATAR_COLORS } from "@/data/cms-mock"

export type AuthorFormData = {
  id?: number
  penname?: string
  realname?: string
  email?: string
  bio?: string
  initial?: string
  color?: string
  facebook?: string
  twitter?: string
  website?: string
  role?: string
  isActive?: boolean
}

interface AuthorFormProps {
  author?: AuthorFormData
}

const fieldCls = "w-full px-3 py-2 border-[1.5px] border-[#e5e5e5] rounded-[7px] text-[13.5px] outline-none focus:border-[#e5353e] transition-colors"
const labelCls = "block text-[12px] font-semibold text-[#444] uppercase tracking-[.04em] mb-1.5"

export default function AuthorForm({ author }: AuthorFormProps) {
  const router   = useRouter()
  const { showToast } = useToast()

  const [penname,  setPenname]  = useState(author?.penname  ?? "")
  const [realname, setRealname] = useState(author?.realname ?? "")
  const [email,    setEmail]    = useState(author?.email    ?? "")
  const [bio,      setBio]      = useState(author?.bio      ?? "")
  const [initial,  setInitial]  = useState(author?.initial  ?? "")
  const [color,    setColor]    = useState(author?.color    ?? "#e5353e")
  const [facebook, setFacebook] = useState(author?.facebook ?? "")
  const [twitter,  setTwitter]  = useState(author?.twitter  ?? "")
  const [website,  setWebsite]  = useState(author?.website  ?? "")
  const [role,     setRole]     = useState<"AUTHOR"|"ADMIN">((author?.role as "AUTHOR"|"ADMIN") ?? "AUTHOR")
  const [active,   setActive]   = useState(author?.isActive ?? true)
  const [saving,   setSaving]   = useState(false)

  const displayInitial = initial || (penname ? penname[0].toUpperCase() : "T")

  async function handleSave() {
    if (!penname.trim()) { showToast("Vui lòng nhập bút danh!", "error"); return }

    setSaving(true)
    try {
      const body = { penname, realname, email, bio, initial, color, facebook, twitter, website, role, isActive: active }

      const url = author?.id ? `/api/cms/authors/${author.id}` : "/api/cms/authors"
      const method = author?.id ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error(await res.text())

      const action = author?.id ? `Đã cập nhật tác giả "${penname}"` : `Đã thêm tác giả "${penname}"`
      showToast(action, "success")
      router.push("/cms/authors")
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
        <FormCard header="👤 Thông tin cơ bản">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className={labelCls}>Bút danh <span className="text-[#e5353e]">*</span></label>
              <input className={fieldCls} placeholder="VD: Thiên Tằm Thổ Đậu" value={penname} onChange={e => setPenname(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Tên thật</label>
              <input className={fieldCls} placeholder="(Tùy chọn)" value={realname} onChange={e => setRealname(e.target.value)} />
            </div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Email liên hệ</label>
            <input className={fieldCls} placeholder="tacgia@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Tiểu sử</label>
            <textarea
              className={fieldCls} rows={4}
              placeholder="Giới thiệu về tác giả..."
              value={bio}
              onChange={e => setBio(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>
        </FormCard>

        <FormCard header="🔗 Mạng xã hội">
          {[
            { icon:"📘", placeholder:"Facebook URL hoặc username", value: facebook, onChange: setFacebook },
            { icon:"🐦", placeholder:"Twitter / X username",       value: twitter,  onChange: setTwitter  },
            { icon:"🌐", placeholder:"Website cá nhân",            value: website,  onChange: setWebsite  },
          ].map(row => (
            <div key={row.icon} className="flex gap-2 items-center mb-2 last:mb-0">
              <div className="w-7 h-7 rounded-[6px] bg-[#f0f0f0] grid place-items-center text-[13px] shrink-0">{row.icon}</div>
              <input className={fieldCls} placeholder={row.placeholder} value={row.value} onChange={e => row.onChange(e.target.value)} />
            </div>
          ))}
        </FormCard>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-3.5">
        <FormCard header="🎨 Avatar">
          <div className="flex items-center gap-4 mb-3.5">
            <div
              className="w-14 h-14 rounded-full grid place-items-center text-[22px] font-bold text-white shrink-0 transition-colors"
              style={{ background: color }}
            >
              {displayInitial}
            </div>
            <div className="flex-1">
              <label className={labelCls}>Chữ cái đại diện</label>
              <input
                className={fieldCls}
                maxLength={2}
                placeholder="A"
                value={initial}
                onChange={e => setInitial(e.target.value.toUpperCase())}
                style={{ textTransform: "uppercase" }}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Màu nền</label>
            <div className="flex gap-2 flex-wrap mt-2">
              {AVATAR_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                  style={{
                    background: c,
                    border: c === color ? "2px solid #1a1a1a" : "2px solid transparent",
                  }}
                />
              ))}
            </div>
          </div>
        </FormCard>

        <FormCard header="⚙️ Trạng thái">
          <div className="mb-4">
            <label className={labelCls}>Vai trò hệ thống</label>
            <select className={fieldCls} value={role} onChange={e => setRole(e.target.value as "AUTHOR"|"ADMIN")}>
              <option value="AUTHOR">AUTHOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-[13px]">Đang hoạt động</div>
              <div className="text-[11.5px] text-[#999]">Hiển thị trên trang chủ</div>
            </div>
            <ToggleSwitch checked={active} onChange={setActive} title="Đang hoạt động" />
          </div>
        </FormCard>

        <FormCard header="✅ Lưu" headerClass="bg-[#f0fdf4]" className="border-[#d1fae5]">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex justify-center items-center gap-2 px-3.5 py-2.5 bg-[#e5353e] text-white rounded-[7px] text-[13px] font-semibold hover:bg-[#b82830] transition-colors mb-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Đang lưu..." : "💾 Lưu tác giả"}
          </button>
          <button
            onClick={() => router.push("/cms/authors")}
            className="w-full flex justify-center items-center gap-2 px-3.5 py-[9px] bg-white text-[#333] rounded-[7px] text-[13px] font-medium border-[1.5px] border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors"
          >
            Hủy bỏ
          </button>
        </FormCard>
      </div>
    </div>
  )
}
