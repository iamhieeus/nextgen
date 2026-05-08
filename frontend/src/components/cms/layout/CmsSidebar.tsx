"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_SECTIONS = [
  {
    label: "Tổng quan",
    items: [
      { id: "dashboard",  icon: "📊", label: "Dashboard",    href: "/cms/dashboard" },
    ],
  },
  {
    label: "Nội dung",
    items: [
      { id: "stories",    icon: "📚", label: "Truyện",       href: "/cms/stories" },
      { id: "authors",    icon: "✍️", label: "Tác giả",      href: "/cms/authors" },
      { id: "categories", icon: "🏷️", label: "Thể loại",     href: "/cms/categories" },
    ],
  },
  {
    label: "Quản trị",
    items: [
      { id: "users",      icon: "👥", label: "Người dùng",   href: "/cms/users" },
    ],
  },
]

export default function CmsSidebar() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/cms/dashboard") return pathname === "/cms/dashboard" || pathname === "/cms"
    return pathname.startsWith(href)
  }

  return (
    <aside
      className="w-[220px] shrink-0 flex flex-col sticky top-0 h-screen overflow-y-auto relative"
      style={{ backgroundImage: "url('/cms-bg-sidebar.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* dim overlay */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: "rgba(20,19,32,.82)" }} />

      {/* content */}
      <div className="relative z-[1] flex flex-col flex-1">

        {/* Header */}
        <div className="px-[18px] py-[18px] pb-[14px] border-b border-white/[.07] flex items-center gap-2.5">
          <img src="/logo-v1.svg" width={32} height={32} alt="Cấm Địa" className="rounded-[6px] shrink-0" />
          <div className="text-[14px] font-bold text-white leading-tight">
            Cấm Địa
            <span className="block text-[10px] font-normal text-[#7c7a8e]">Admin Panel</span>
          </div>
        </div>

        {/* Nav sections */}
        {NAV_SECTIONS.map(section => (
          <div key={section.label} className="px-2.5 pt-4 pb-1.5">
            <div className="text-[10px] font-semibold text-[#7c7a8e] uppercase tracking-[.08em] px-2 mb-1">
              {section.label}
            </div>
            {section.items.map(item => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13px] mb-px transition-all
                    border-l-[3px]
                    ${active
                      ? "bg-[rgba(229,53,62,.18)] text-[#ff6b72] font-semibold border-l-[#ff6b72]"
                      : "text-[#c8c6d8] border-l-transparent hover:bg-[#2e2d3d] hover:text-white"
                    }`}
                >
                  <span className="text-[15px] w-[18px] text-center opacity-80">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}

        {/* Footer */}
        <div className="mt-auto px-2.5 py-3.5 border-t border-white/[.07]">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px]">
            <div className="w-[30px] h-[30px] rounded-full bg-[#e5353e] grid place-items-center text-[12px] font-bold text-white shrink-0">
              A
            </div>
            <div>
              <div className="text-[12.5px] font-semibold text-white leading-tight">Nguyễn Admin</div>
              <div className="text-[10.5px] text-[#7c7a8e]">ADMIN</div>
            </div>
          </div>
          <Link
            href="/cms/login"
            className="flex items-center gap-1.5 px-2.5 py-[7px] rounded-[7px] text-[12.5px] text-[#7c7a8e] w-full mt-1 hover:bg-[rgba(229,53,62,.15)] hover:text-[#ff6b72] transition-all"
          >
            <span>🚪</span> Đăng xuất
          </Link>
        </div>
      </div>
    </aside>
  )
}
