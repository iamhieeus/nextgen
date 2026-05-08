"use client"
import { useState } from "react"
import Link from "next/link"
import type { SearchResultItem } from "@/services/search.service"

const GENRE_META: Record<string, { icon: string; color: string }> = {
  "Tu Tiên":     { icon: "🧙", color: "#7e57c2" },
  "Đô Thị":     { icon: "🏙️", color: "#1565c0" },
  "Ngôn Tình":  { icon: "💘", color: "#ad1457" },
  "Huyền Huyễn":{ icon: "🔮", color: "#512da8" },
  "Game":        { icon: "🎮", color: "#2e7d32" },
  "Võ Hiệp":    { icon: "⚔️", color: "#b71c1c" },
  "Khoa Huyễn": { icon: "🚀", color: "#0277bd" },
  "Kinh Dị":    { icon: "👻", color: "#4a148c" },
  "Lịch Sử":   { icon: "📜", color: "#4e342e" },
  default:       { icon: "📚", color: "#e5353e" },
}

type Category = { icon: string; name: string; slug: string }

type Props = {
  genreName: string
  categories: Category[]
  books: SearchResultItem[]
  total: number
  featured: SearchResultItem | null
}

export default function GenreClient({ genreName, categories, books, total, featured }: Props) {
  const [activeSub, setActiveSub] = useState(0)
  const [activeSort, setActiveSort] = useState("Đọc nhiều")
  const meta = GENRE_META[genreName] ?? GENRE_META.default

  const SUB_GENRES = ["Tất cả","Trọng Sinh","Xuyên Không","Hệ Thống","Kiếm Tu","Luyện Đan","Vô Địch","Phế Vật"]
  const genreList = [{ icon: "⚡", name: "Tất cả", slug: "all" }, ...categories]
  const currentGenreIdx = genreList.findIndex(g => g.name === genreName)

  const BADGE_CLASS: Record<string, string> = {
    hot: "m-badge-red", new: "m-badge-red", full: "m-badge-green"
  }
  const BADGE_LABEL: Record<string, string> = {
    hot: "HOT", new: "MỚI", full: "HOÀN"
  }

  return (
    <>
      <div className="m-status-bar">
        <span style={{ fontSize: 13, fontWeight: 700 }}>9:41</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>🔋</span>
      </div>

      <div className="m-top-nav">
        <Link href="/mobile" style={{ fontSize: 28, color: "#444", padding: 4, flexShrink: 0, cursor: "pointer", lineHeight: 1 }}>‹</Link>
        <span style={{ flex: 1, fontSize: 17, fontWeight: 800, color: "var(--text)" }}>{meta.icon} {genreName}</span>
        <Link href="/mobile/search" style={{ fontSize: 22, color: "#555", padding: 4, flexShrink: 0, cursor: "pointer" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </Link>
      </div>

      <div className="m-genre-tabs">
        <div className="m-genre-tabs-inner" style={{ padding: "0 4px" }}>
          {genreList.map((g, i) => (
            <Link key={i} href={g.slug === "all" ? "/mobile" : `/mobile/genres/${encodeURIComponent(g.name)}`} style={{ padding: "10px 14px", fontSize: 13, fontWeight: currentGenreIdx === i ? 700 : 500, color: currentGenreIdx === i ? "var(--ac)" : "var(--text-sub)", cursor: "pointer", whiteSpace: "nowrap", borderBottom: `2.5px solid ${currentGenreIdx === i ? "var(--ac)" : "transparent"}`, display: "inline-block", textDecoration: "none" }}>
              {g.icon} {g.name}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ background: "#fafafa", borderBottom: "1px solid var(--border)", overflowX: "auto", scrollbarWidth: "none" }}>
        <div style={{ display: "flex", gap: 6, padding: "8px 12px", minWidth: "max-content" }}>
          {SUB_GENRES.map((s, i) => (
            <span key={i} onClick={() => setActiveSub(i)} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 14, border: `1px solid ${activeSub === i ? "var(--ac)" : "#ddd"}`, color: activeSub === i ? "var(--ac)" : "var(--text-sub)", background: activeSub === i ? "var(--ac-lt)" : "#fff", cursor: "pointer", whiteSpace: "nowrap", fontWeight: activeSub === i ? 700 : 500 }}>{s}</span>
          ))}
        </div>
      </div>

      <div className="m-scroll">
        {featured && (
          <Link href={`/mobile/stories/${featured.href.split("/").pop()}`} style={{ background: `linear-gradient(135deg, #1a0040 0%, #3d1a70 40%, ${meta.color} 100%)`, padding: "16px 14px", display: "flex", alignItems: "center", gap: 14, marginBottom: 8, cursor: "pointer", textDecoration: "none" }}>
            <div className={featured.cover.bg} style={{ width: 70, height: 93, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, boxShadow: "0 4px 14px rgba(0,0,0,.35)" }}>{featured.cover.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.6)", letterSpacing: .5, textTransform: "uppercase", marginBottom: 4 }}>⭐ Nổi bật</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", lineHeight: 1.25, marginBottom: 6 }}>{featured.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{featured.synopsis}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 6 }}>
                {genreName} · {featured.chapterCount} chương · {featured.viewCount} lượt đọc
              </div>
            </div>
          </Link>
        )}

        <div style={{ background: "#fff", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Tất cả <strong style={{ color: "var(--text)" }}>{total}+</strong> truyện</span>
            <div style={{ display: "flex", gap: 6 }}>
              {["Đọc nhiều","Mới nhất","Yêu thích"].map(s => (
                <span key={s} onClick={() => setActiveSort(s)} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 10, background: activeSort === s ? "var(--ac)" : "#f5f5f5", color: activeSort === s ? "#fff" : "var(--text-sub)", fontWeight: activeSort === s ? 700 : 400, cursor: "pointer" }}>{s}</span>
              ))}
            </div>
          </div>
          {books.map((r) => {
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
        </div>

        <div className="m-load-more" style={{ background: "var(--panel)", marginBottom: 8 }}>
          <div className="m-lm-line" />
          <span>Tải thêm truyện</span>
          <div className="m-lm-line" />
        </div>
      </div>

      <nav className="m-bottom-nav">
        {[["🏠","Trang chủ","/mobile"],["🔍","Tìm kiếm","/mobile/search"],["📚","Tủ sách","/mobile"],["👤","Tôi","/mobile"]].map(([icon, label, href], i) => (
          <Link key={i} href={href} className="m-bn-item">
            <span className="m-bn-icon">{icon}</span>
            <span className="m-bn-label">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}
