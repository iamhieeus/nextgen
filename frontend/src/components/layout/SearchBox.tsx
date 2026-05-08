"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function SearchBox() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get("q") ?? "")

  function submit() {
    const q = value.trim()
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search")
  }

  return (
    <div className="flex-1 max-w-[500px]">
      <div className="flex border-2 border-ac overflow-hidden rounded-[3px] h-[40px]">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Nhập tên truyện, tác giả, thể loại..."
          className="flex-1 border-none outline-none px-[14px] text-sm bg-white text-[#333] placeholder:text-[#bbb]"
        />
        <button
          onClick={submit}
          className="bg-ac hover:bg-ac-dk text-white px-[22px] font-semibold text-sm whitespace-nowrap transition-colors cursor-pointer"
        >
          🔍 Tìm kiếm
        </button>
      </div>
    </div>
  )
}
