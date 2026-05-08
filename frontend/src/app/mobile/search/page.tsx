"use client"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"

type ResultItem = {
  title: string; author: string; category: string; categorySlug: string
  status: string; viewCount: string; chapterCount: number
  synopsis: string; tags: string[]
  cover: { bg: string; emoji: string }
  href: string
  badge?: "hot" | "new" | "full"
}

type CategoryItem = { name: string; slug: string }

const HISTORY = ["Thiên Đạo Bất Công","Chiến Thần Trở Về","Hôn Nhân Bất Ngờ"]
const FILTER_GROUPS = [
  { label: "THỂ LOẠI", tags: ["Tu Tiên","Đô Thị","Ngôn Tình","Huyền Huyễn","Game","Võ Hiệp","Khoa Huyễn","Kinh Dị","Lịch Sử"] },
  { label: "TRẠNG THÁI", tags: ["Đang ra","Đã hoàn"] },
  { label: "ĐỘ DÀI", tags: ["< 500 chương","500–1000 chương","> 1000 chương"] },
  { label: "SẮP XẾP", tags: ["Đọc nhiều","Mới nhất","Yêu thích","Đánh giá cao"] },
]

const BADGE_CLASS: Record<string, string> = {
  hot: "m-badge-red", new: "m-badge-red", full: "m-badge-green"
}
const BADGE_LABEL: Record<string, string> = {
  hot: "HOT", new: "MỚI", full: "HOÀN"
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get("q") ?? "")
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>(["Tất cả"])
  const [activeSort, setActiveSort] = useState("Liên quan")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [results, setResults] = useState<ResultItem[]>([])
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(false)

  const hasQuery = query.trim().length > 0

  useEffect(() => {
    if (!hasQuery) return
    setLoading(true)
    const url = `/api/search?q=${encodeURIComponent(query.trim())}`
    fetch(url)
      .then(r => r.json())
      .then(data => {
        setResults(data.results ?? [])
        setTotal(data.total ?? 0)
        setCategories(data.categories ?? [])
      })
      .finally(() => setLoading(false))
  }, [query, hasQuery])

  const toggleFilter = (tag: string) => {
    setSelectedFilters(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const hotSearches = categories.map(c => c.name).slice(0, 8)

  return (
    <>
      <div className="m-status-bar">
        <span style={{ fontSize: 13, fontWeight: 700 }}>9:41</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>🔋</span>
      </div>

      <div className="m-top-nav" style={{ height: 54 }}>
        <Link href="/mobile" className="m-back" style={{ fontSize: 22, lineHeight: 1 }}>‹</Link>
        <div className="m-search-field-active">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Tên truyện, tác giả..." value={query} onChange={e => setQuery(e.target.value)} autoFocus onKeyDown={e => e.key === "Enter" && router.push(`/mobile/search?q=${encodeURIComponent(query)}`)} />
          {query && <span style={{ cursor: "pointer", color: "#aaa", fontSize: 16 }} onClick={() => setQuery("")}>✕</span>}
        </div>
        <span style={{ fontSize: 14, color: "var(--ac)", fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer" }} onClick={() => router.push("/mobile")}>Huỷ</span>
      </div>

      <div className="m-scroll">
        {hasQuery ? (
          <>
            <div className="m-filter-strip">
              <div className="m-filter-inner">
                {["Tất cả","Tu Tiên","Đô Thị","Ngôn Tình","Đã hoàn","Đang ra"].map((f, i) => (
                  <span key={i} className={`m-ftag${activeFilters.includes(f) ? " active" : ""}`} onClick={() => setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])}>{f}</span>
                ))}
                <span className="m-ftag" onClick={() => setFilterOpen(true)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
                  Lọc
                </span>
              </div>
            </div>

            <div className="m-result-bar">
              <span style={{ fontSize: 13, color: "var(--text-sub)" }}>
                {loading ? "Đang tìm..." : <>Kết quả cho <strong style={{ color: "var(--ac)" }}>"{query}"</strong> · {total} truyện</>}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "var(--text-muted)", cursor: "pointer" }} onClick={() => setActiveSort(s => s === "Liên quan" ? "Mới nhất" : "Liên quan")}>
                ↕ {activeSort}
              </span>
            </div>

            <div style={{ background: "var(--panel)" }}>
              {results.map((r) => {
                const slug = r.href.split("/").pop() ?? ""
                return (
                  <Link key={slug} href={`/mobile/stories/${slug}`} className="m-result-item">
                    <div className={`m-ri-cov ${r.cover.bg}`}>{r.cover.emoji}</div>
                    <div className="m-ri-body">
                      <div className="m-ri-title-row">
                        <span className="m-ri-title">{r.title}</span>
                      </div>
                      <div className="m-ri-badges">
                        {r.badge && <span className={`m-badge ${BADGE_CLASS[r.badge] ?? "m-badge-blue"}`}>{BADGE_LABEL[r.badge] ?? r.badge}</span>}
                        <span className="m-badge m-badge-blue">{r.category}</span>
                        <span className={`m-badge ${r.status === "Hoàn thành" ? "m-badge-green" : "m-badge-gray"}`}>{r.status}</span>
                      </div>
                      <div className="m-ri-author">Tác giả: <span>{r.author}</span></div>
                      <div className="m-ri-desc">{r.synopsis}</div>
                      <div className="m-ri-foot">
                        <span className="m-ri-stat">👁 {r.viewCount}</span>
                        <span className="m-ri-stat" style={{ color: "#ddd" }}>·</span>
                        <span className="m-ri-ch">{r.chapterCount} chương</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
              {!loading && results.length === 0 && (
                <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
                  Không tìm thấy kết quả cho "{query}"
                </div>
              )}
            </div>

            {results.length > 0 && (
              <div className="m-load-more">
                <div className="m-lm-line" />
                <span>Tải thêm kết quả</span>
                <div className="m-lm-line" />
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ background: "var(--panel)", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 8px" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: .5 }}>Tìm kiếm gần đây</span>
                <span style={{ fontSize: 12, color: "var(--ac)", cursor: "pointer" }}>Xóa tất cả</span>
              </div>
              {HISTORY.map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", borderBottom: "1px solid var(--border)", cursor: "pointer" }} onClick={() => setQuery(h)}>
                  <span style={{ fontSize: 13.5, color: "var(--text)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--text-muted)" }}>🕐</span> {h}
                  </span>
                  <span style={{ fontSize: 18, color: "#ccc", padding: 4 }}>✕</span>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--panel)", padding: 14, marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>🔥 Tìm kiếm phổ biến</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {hotSearches.map((s, i) => (
                  <span key={i} style={{ fontSize: 13, background: "#f5f5f5", color: "var(--text-sub)", padding: "6px 14px", borderRadius: 16, cursor: "pointer" }} onClick={() => setQuery(s)}>
                    <span style={{ color: "var(--ac)", fontWeight: 700, marginRight: 3, fontSize: 11 }}>#{i + 1}</span>{s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ background: "var(--panel)", padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>Thể loại</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {[["🧙","Tu Tiên"],["🏙️","Đô Thị"],["💘","Ngôn Tình"],["🔮","Huyền Huyễn"],["🎮","Game"],["⚔️","Võ Hiệp"],["🚀","Khoa Huyễn"],["👻","Kinh Dị"]].map(([icon, name], i) => (
                  <Link key={i} href={`/mobile/genres/${encodeURIComponent(name)}`} style={{ fontSize: 13, background: "#f5f5f5", color: "var(--text-sub)", padding: "6px 14px", borderRadius: 16 }}>{icon} {name}</Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <nav className="m-bottom-nav">
        {[["🏠","Trang chủ","/mobile"],["🔍","Tìm kiếm","/mobile/search"],["📚","Tủ sách","/mobile"],["👤","Tôi","/mobile"]].map(([icon, label, href], i) => (
          <Link key={i} href={href} className={`m-bn-item${i === 1 ? " active" : ""}`}>
            <span className="m-bn-icon">{icon}</span>
            <span className="m-bn-label">{label}</span>
          </Link>
        ))}
      </nav>

      <div className={`m-sheet-overlay${filterOpen ? " open" : ""}`} onClick={() => setFilterOpen(false)} />
      <div className={`m-sheet${filterOpen ? " open" : ""}`} onClick={e => e.stopPropagation()}>
        <div className="m-sheet-handle" />
        <div style={{ fontSize: 16, fontWeight: 800, padding: "0 16px 14px", borderBottom: "1px solid var(--border)" }}>Bộ lọc tìm kiếm</div>
        {FILTER_GROUPS.map((g, gi) => (
          <div key={gi} style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text-muted)", letterSpacing: .5, textTransform: "uppercase", marginBottom: 10 }}>{g.label}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {g.tags.map((t, i) => (
                <span key={i} onClick={() => toggleFilter(t)} style={{ fontSize: 13, padding: "6px 14px", borderRadius: 16, border: `1.5px solid ${selectedFilters.includes(t) ? "var(--ac)" : "var(--border)"}`, color: selectedFilters.includes(t) ? "var(--ac)" : "var(--text-sub)", cursor: "pointer", fontWeight: selectedFilters.includes(t) ? 700 : 500, background: selectedFilters.includes(t) ? "var(--ac-lt)" : "#fff" }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, padding: "14px 16px" }}>
          <button onClick={() => setSelectedFilters([])} style={{ flex: 1, padding: 12, border: "1.5px solid var(--border)", borderRadius: 8, fontSize: 14, fontWeight: 600, color: "var(--text-sub)", background: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Đặt lại</button>
          <button onClick={() => setFilterOpen(false)} style={{ flex: 2, padding: 12, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, color: "#fff", background: "var(--ac)", cursor: "pointer", fontFamily: "inherit" }}>Áp dụng ({selectedFilters.length})</button>
        </div>
      </div>
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  )
}
