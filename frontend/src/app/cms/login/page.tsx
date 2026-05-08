"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const ADMIN = { email: "admin@camdiatruyen.vn", password: "admin123" }

export default function CmsLoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState("admin@camdiatruyen.vn")
  const [password, setPassword] = useState("admin123")
  const [showPwd,  setShowPwd]  = useState(false)
  const [error,    setError]    = useState("")

  function handleLogin() {
    if (email === ADMIN.email && password === ADMIN.password) {
      router.push("/cms/dashboard")
    } else {
      setError("Email hoặc mật khẩu không đúng. Thử: admin@camdiatruyen.vn / admin123")
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundImage: "url('/cms-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
      onKeyDown={e => e.key === "Enter" && handleLogin()}
    >
      <div className="absolute inset-0 bg-black/45 pointer-events-none" />

      <div className="bg-white rounded-xl w-[360px] px-9 py-10 shadow-[0_20px_60px_rgba(0,0,0,.5)] relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-7">
          <img src="/logo-v1.svg" width={38} height={38} alt="Cấm Địa" className="rounded-[8px] shrink-0" />
          <div className="text-[17px] font-bold text-[#1a1a1a] leading-tight">
            Cấm Địa
            <span className="block text-[11px] font-normal text-[#888]">Hệ thống quản trị nội dung</span>
          </div>
        </div>

        <div className="text-[20px] font-bold text-[#1a1a1a] mb-0.5">Đăng nhập</div>
        <div className="text-[13px] text-[#666] mb-6">Nhập thông tin tài khoản để tiếp tục.</div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-[12px] font-semibold text-[#444] uppercase tracking-[.04em] mb-1.5">Email</label>
          <input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="w-full px-3 py-[9px] border-[1.5px] border-[#e5e5e5] rounded-[7px] text-[14px] outline-none focus:border-[#e5353e] transition-colors"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-[12px] font-semibold text-[#444] uppercase tracking-[.04em] mb-1.5">Mật khẩu</label>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              autoComplete="current-password"
              className="w-full px-3 py-[9px] pr-10 border-[1.5px] border-[#e5e5e5] rounded-[7px] text-[14px] outline-none focus:border-[#e5353e] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPwd(v => !v)}
              className="absolute right-0.5 top-1/2 -translate-y-1/2 px-2 py-[5px] text-[14px] text-[#aaa] rounded-[5px] hover:text-[#444] hover:bg-[#f0f0f0] transition-colors"
            >
              {showPwd ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* Hint */}
        <div className="text-[11.5px] text-[#999] bg-[#f8f8f8] rounded-[6px] px-3 py-2 mb-4">
          <strong className="text-[#444]">Demo:</strong> admin@camdiatruyen.vn / admin123
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-2.5 bg-[#e5353e] text-white rounded-[7px] text-[14px] font-semibold hover:bg-[#b82830] transition-colors"
        >
          Đăng nhập
        </button>

        {error && (
          <div className="text-[#e5353e] text-[12.5px] mt-2.5 text-center min-h-[18px]">{error}</div>
        )}
      </div>
    </div>
  )
}
