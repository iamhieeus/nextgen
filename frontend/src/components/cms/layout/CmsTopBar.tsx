"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// Map pathname patterns to breadcrumb segments
function getBreadcrumbs(pathname: string): string[] {
  if (pathname === "/cms" || pathname === "/cms/dashboard") return ["Dashboard"]
  if (pathname === "/cms/stories")                         return ["Nội dung", "Truyện"]
  if (pathname === "/cms/stories/new")                     return ["Nội dung", "Truyện", "Thêm mới"]
  if (/^\/cms\/stories\/\d+$/.test(pathname))              return ["Nội dung", "Truyện", "Chỉnh sửa"]
  if (/^\/cms\/stories\/\d+\/chapters$/.test(pathname))    return ["Nội dung", "Truyện", "Danh sách chương"]
  if (/\/chapters\/new$/.test(pathname))                   return ["Nội dung", "Truyện", "Thêm chương"]
  if (/\/chapters\/\d+$/.test(pathname))                   return ["Nội dung", "Truyện", "Sửa chương"]
  if (pathname === "/cms/authors")                         return ["Nội dung", "Tác giả"]
  if (pathname === "/cms/authors/new")                     return ["Nội dung", "Tác giả", "Thêm mới"]
  if (/^\/cms\/authors\/\d+$/.test(pathname))              return ["Nội dung", "Tác giả", "Chỉnh sửa"]
  if (pathname === "/cms/categories")                      return ["Nội dung", "Thể loại"]
  if (pathname === "/cms/users")                           return ["Quản trị", "Người dùng"]
  return ["CMS"]
}

export default function CmsTopBar() {
  const pathname = usePathname()
  const crumbs = getBreadcrumbs(pathname)

  return (
    <div className="h-[50px] bg-white border-b border-[#e5e5e5] flex items-center px-6 gap-2 sticky top-0 z-10">
      <div className="flex items-center gap-1.5 text-[13px] text-[#999] flex-1">
        <span>Cấm Địa</span>
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="text-[10px]">›</span>
            {i === crumbs.length - 1
              ? <span className="text-[#1a1a1a] font-semibold">{c}</span>
              : <span>{c}</span>
            }
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-[5px] rounded-[7px] text-[12px] font-medium bg-white text-[#333] border-[1.5px] border-[#e5e5e5] hover:bg-[#f5f5f5] hover:border-[#ccc] transition-all"
        >
          🌐 Xem trang chủ
        </Link>
      </div>
    </div>
  )
}
