import Link from "next/link"
import { Suspense } from "react"
import SearchBox from "./SearchBox"

export default function SiteHeader() {
  return (
    <header className="bg-white border-b-2 border-ac h-[64px] shadow-[0_1px_4px_rgba(0,0,0,.08)]">
      <div className="max-w-[1200px] w-full mx-auto h-full flex items-center gap-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-[10px] flex-shrink-0">
          <img src="/logo.svg" width={40} height={40} alt="" aria-hidden="true" />
          <span className="text-[23px] font-black text-ac tracking-[-0.5px] leading-[1.15]">
            Cấm Địa
            <sub className="text-[10px] font-normal text-[#aaa] block mt-[2px] tracking-[.3px] not-italic">
              Vạn thế giới trong một trang sách
            </sub>
          </span>
        </Link>

        {/* Search — Suspense required because SearchBox uses useSearchParams */}
        <Suspense fallback={<SearchBoxSkeleton />}>
          <SearchBox />
        </Suspense>

        {/* Actions */}
        <div className="flex items-center gap-[10px] ml-auto flex-shrink-0">
          <a href="#" className="text-[13px] text-[#666] hover:text-ac border border-[#ddd] px-[18px] py-[8px] rounded-[3px] transition-colors">
            Đăng nhập
          </a>
          <a href="#" className="text-[13px] bg-ac hover:bg-ac-dk text-white px-[18px] py-[8px] rounded-[3px] font-semibold transition-colors">
            Đăng ký
          </a>
          <a href="#" className="text-[11px] text-[#666] hover:text-ac transition-colors">📱 App</a>
        </div>
      </div>
    </header>
  )
}

function SearchBoxSkeleton() {
  return (
    <div className="flex-1 max-w-[500px]">
      <div className="flex border-2 border-ac overflow-hidden rounded-[3px] h-[40px]">
        <div className="flex-1 bg-white" />
        <div className="bg-ac px-[22px] flex items-center text-white text-sm font-semibold whitespace-nowrap">
          🔍 Tìm kiếm
        </div>
      </div>
    </div>
  )
}
