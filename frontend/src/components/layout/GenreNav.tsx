"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

type CategoryItem = { icon: string; name: string; slug: string; count: string }

// How many categories to show directly in the nav bar (rest go in the dropdown)
const NAV_VISIBLE = 10

export default function GenreNav({ categories }: { categories: CategoryItem[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category")

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const navCats = categories.slice(0, NAV_VISIBLE)
  const isHome = pathname === "/" && !activeCategory

  return (
    <nav className="bg-nav sticky top-0 z-[100]">
      <div className="max-w-[1200px] w-full mx-auto flex items-center">

        {/* Trang chủ */}
        <Link
          href="/"
          className={`text-[13px] px-[13px] h-[38px] flex items-center whitespace-nowrap border-r border-white/[.08] transition-all
            ${isHome ? "bg-ac text-white font-semibold" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
        >
          Trang chủ
        </Link>

        {/* Category nav items */}
        {navCats.map((cat) => {
          const href = `/search?category=${cat.slug}`
          const isActive = activeCategory === cat.slug
          return (
            <Link
              key={cat.slug}
              href={href}
              className={`text-[13px] px-[13px] h-[38px] flex items-center whitespace-nowrap border-r border-white/[.08] transition-all
                ${isActive ? "bg-ac text-white font-semibold" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
            >
              {cat.name}
            </Link>
          )
        })}

        {/* Dropdown: all categories */}
        <div ref={ref} className="relative ml-auto">
          <button
            onClick={() => setOpen((v) => !v)}
            className={`border-l border-white/[.12] text-[13px] px-[13px] h-[38px] flex items-center whitespace-nowrap text-[#ffaaaa] transition-all
              ${open ? "bg-ac text-white" : "hover:bg-ac hover:text-white"}`}
          >
            ≡ Tất cả thể loại
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-0 w-[480px] bg-nav border border-white/[.12] shadow-xl z-[200]">
              <div className="grid grid-cols-4 gap-0">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/search?category=${cat.slug}`}
                    onClick={() => setOpen(false)}
                    title={`${cat.name} · ${cat.count}`}
                    className={`flex items-center gap-2 px-3 py-2 text-[13px] transition-all border-b border-white/[.06]
                      ${activeCategory === cat.slug
                        ? "bg-white/15 text-white font-semibold"
                        : "text-white/80 hover:bg-white/10 hover:text-white"}`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}
