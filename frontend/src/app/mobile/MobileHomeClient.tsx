"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"

type Tab = "home" | "rank" | "shelf" | "profile"

type SlideItem = {
  title: string; desc: string; bg: string; emoji: string
  tags: { label: string; color?: "green" | "blue" }[]
  href: string
}
type HotBook = {
  rank: number; title: string; genres: string; chapters: string
  bg: string; emoji: string; href: string
}
type UpdateItem = {
  title: string; latestChapter: string; latestTitle: string
  time: string; cover: { bg: string; emoji: string }; isNew: boolean; href: string
}
type RecommendItem = {
  title: string; tags: { label: string; highlight: boolean }[]
  desc: string; author: string; authorHref?: string
  chapters: string; views: string
  cover: { bg: string; emoji: string }; href: string
}
type CategoryItem = { icon: string; name: string; slug: string }
type RankItem = {
  title: string; genre: string; bg: string; emoji: string; views: string; href: string
}

type Props = {
  slides: SlideItem[]
  hotBooks: HotBook[]
  updates: UpdateItem[]
  recommendations: RecommendItem[]
  categories: CategoryItem[]
  rankings: { mostRead: RankItem[]; topRated: RankItem[]; newTrending: RankItem[] }
}

const QA_ITEMS = [
  { icon: "📚", label: "Tủ sách", bg: "#fff0f0" }, { icon: "🔥", label: "Hot nhất", bg: "#fff3e0" },
  { icon: "✅", label: "Đã hoàn", bg: "#e8f5e9" }, { icon: "🆕", label: "Mới nhất", bg: "#e3f2fd" },
  { icon: "🏅", label: "Xếp hạng", bg: "#f3e5f5" }, { icon: "🎯", label: "Đề xuất", bg: "#e0f7fa" },
  { icon: "💬", label: "Bình luận", bg: "#fce4ec" }, { icon: "🌟", label: "VIP", bg: "#f9fbe7" },
  { icon: "🎁", label: "Điểm thưởng", bg: "#ede7f6" }, { icon: "⚙️", label: "Cài đặt", bg: "#e8eaf6" },
]

const RANK_TAB_KEYS = ["mostRead", "topRated", "newTrending"] as const
const RANK_TAB_LABELS = ["Đọc nhiều", "Đánh giá", "Mới nhất"]
const HOT_SEARCHES = ["Vô Địch NPC","Chiến Thần","Tu Tiên","Hệ thống","Ngôn Tình","Xuyên Không","Hào Môn","Huyền Huyễn","Hoàn thành","Đô Thị"]

function BannerSlider({ slides }: { slides: SlideItem[] }) {
  const [idx, setIdx] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const total = slides.length

  useEffect(() => {
    if (total === 0) return
    timerRef.current = setInterval(() => setIdx(v => (v + 1) % total), 3200)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [total])

  if (total === 0) return null

  const go = (i: number) => setIdx((i + total) % total)

  return (
    <div className="m-banner-wrap">
      <div className="m-banner-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
        {slides.map((s, i) => (
          <Link key={i} href={s.href} className="m-banner-slide">
            <div className={`m-b-bg ${s.bg}`}>{s.emoji}</div>
            <div className="m-b-overlay" />
            <div className="m-b-body">
              <div className="m-b-tags">
                {s.tags.map((t, j) => {
                  const cls = t.color === "blue" ? "bl" : t.color === "green" ? "gn" : ""
                  return <span key={j} className={`m-b-tag ${cls}`}>{t.label}</span>
                })}
              </div>
              <div className="m-b-title">{s.title}</div>
              <div className="m-b-desc">{s.desc}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="m-b-dots">
        {slides.map((_, i) => (
          <span key={i} className={`m-bdot${i === idx ? " active" : ""}`} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  )
}

export default function MobileHomeClient({ slides, hotBooks, updates, recommendations, categories, rankings }: Props) {
  const [tab, setTab] = useState<Tab>("home")
  const [activeGenre, setActiveGenre] = useState(0)
  const [hotSub, setHotSub] = useState(0)
  const [rankSub, setRankSub] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const currentRankings = rankings[RANK_TAB_KEYS[rankSub]] ?? []
  const genreList = [{ icon: "⚡", name: "Tất cả" }, ...categories.map(c => ({ icon: c.icon, name: c.name }))]

  return (
    <>
      <div className="m-status-bar">
        <span style={{ fontSize: 13, fontWeight: 700 }}>9:41</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><rect x="0" y="4" width="3" height="8" rx="1"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="1"/><rect x="9" y="0" width="3" height="12" rx="1"/><rect x="13.5" y=".5" width="2" height="11" rx="1" opacity=".3"/></svg>
          🔋
        </span>
      </div>

      <nav className="m-top-nav">
        <span className="m-icon-btn" style={{ fontSize: 20, color: "#444" }} onClick={() => setDrawerOpen(true)}>☰</span>
        <span className="m-logo" onClick={() => setTab("home")}>
          <Image src="/logo-v1.svg" alt="logo" width={26} height={26} />
          Cấm Địa
        </span>
        <div className="m-search-btn" onClick={() => setSearchOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          Tìm kiếm...
        </div>
        {/* <span className="m-icon-btn" onClick={() => setSearchOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </span> */}
        {/* <span className="m-icon-btn" style={{ color: "var(--ac)" }}>
          🔔<span className="badge-dot" />
        </span> */}
      </nav>

      <div className="m-scroll">

        {tab === "home" && (
          <>
            <BannerSlider slides={slides} />

            <div className="m-announce">
              <span className="m-announce-tag">TB</span>
              <span className="m-announce-text">Chương mới cập nhật mỗi ngày — Tải app nhận ngay 10 chương miễn phí!</span>
              <span className="m-chevron" />
            </div>

            <div className="m-quick-actions">
              <div className="m-qa-grid">
                {QA_ITEMS.map((q, i) => (
                  <div key={i} className="m-qa-item">
                    <div className="m-qa-icon" style={{ background: q.bg }}>{q.icon}</div>
                    <span className="m-qa-label">{q.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="m-genre-tabs">
              <div className="m-genre-tabs-inner">
                {genreList.map((g, i) => (
                  <div key={i} className={`m-gtab${activeGenre === i ? " active" : ""}`} onClick={() => setActiveGenre(i)}>
                    <span className="m-gtab-icon">{g.icon}</span>
                    {g.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="m-section" style={{ marginTop: 8 }}>
              <div className="m-sec-hd">
                <h2>🔥 <span className="accent">Đang Hot</span></h2>
                <div className="m-sec-tabs">
                  {["Nam","Nữ"].map((l, i) => (
                    <span key={i} className={`m-stab${hotSub === i ? " active" : ""}`} onClick={() => setHotSub(i)}>{l}</span>
                  ))}
                </div>
                <Link href="/mobile/genres/hot" className="m-more">Tất cả <span className="m-chevron" /></Link>
              </div>
              <div className="m-hscroll">
                <div className="m-hscroll-inner">
                  {hotBooks.map((b) => (
                    <Link key={b.href} href={b.href} className="m-bv">
                      <div className={`m-bv-cov ${b.bg}`}>{b.emoji}</div>
                      <div className="m-bv-title">{b.title}</div>
                      <div className="m-bv-meta">{b.genres}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="m-promo">
              <span className="m-promo-icon">🎉</span>
              <div className="m-promo-body">
                <h3>7 Ngày Đọc Miễn Phí VIP</h3>
                <p>Mở khóa toàn bộ chương VIP — Đăng ký ngay!</p>
              </div>
              <span style={{ color: "rgba(255,255,255,.6)", fontSize: 20 }}>›</span>
            </div>

            <div className="m-section">
              <div className="m-sec-hd">
                <h2>✨ <span className="accent">Gợi Ý Cho Bạn</span></h2>
                <Link href="/mobile/search" className="m-more">Xem thêm <span className="m-chevron" /></Link>
              </div>
              <div className="m-book-list">
                {recommendations.map((b) => (
                  <Link key={b.href} href={b.href} className="m-bl-item">
                    <div className={`m-bl-cov ${b.cover.bg}`}>{b.cover.emoji}</div>
                    <div className="m-bl-body">
                      <div className="m-bl-title">{b.title}</div>
                      <div className="m-bl-author">Tác giả: {b.author}</div>
                      <div className="m-bl-tags">
                        {b.tags.slice(0, 3).map((t, i) => (
                          <span key={i} className={`m-bl-tag${i === 0 ? " ac" : ""}`}>{t.label}</span>
                        ))}
                      </div>
                      <div className="m-bl-desc">{b.desc}</div>
                      <div className="m-bl-foot">
                        <span className="m-bl-ch">{b.chapters}</span>
                        <span className="m-bl-reads">{b.views}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="m-load-more">
                <div className="m-lm-line" /><span>Tải thêm gợi ý</span><div className="m-lm-line" />
              </div>
            </div>

            <div className="m-section">
              <div className="m-sec-hd">
                <h2>🕐 <span className="accent">Cập Nhật Mới</span></h2>
                <Link href="/mobile/search" className="m-more">Xem thêm <span className="m-chevron" /></Link>
              </div>
              <div className="m-upd-list">
                {updates.map((u) => (
                  <Link key={u.href} href={u.href} className="m-upd-item">
                    <div className={`m-upd-cov ${u.cover.bg}`}>{u.cover.emoji}</div>
                    <div className="m-upd-body">
                      <div className="m-upd-title">{u.title}{u.isNew && <span className="m-new-tag">MỚI</span>}</div>
                      <div className="m-upd-ch"><em>{u.latestChapter}:</em> {u.latestTitle}</div>
                    </div>
                    <div className="m-upd-time">{u.time}</div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "rank" && (
          <div className="m-section" style={{ marginTop: 0 }}>
            <div className="m-sec-hd">
              <h2>🏆 <span className="accent">Bảng Xếp Hạng</span></h2>
            </div>
            <div className="m-rank-tabs-wrap">
              <div className="m-rank-tabs">
                {RANK_TAB_LABELS.map((t, i) => (
                  <div key={i} className={`m-rtab${rankSub === i ? " active" : ""}`} onClick={() => setRankSub(i)}>{t}</div>
                ))}
              </div>
            </div>
            <div className="m-rank-list">
              {currentRankings.map((r, i) => (
                <Link key={r.href} href={r.href} className="m-ri">
                  <span className={`m-ri-no${i < 3 ? ` n${i + 1}` : ""}`}>{i + 1}</span>
                  <div className={`m-ri-cov ${r.bg}`}>{r.emoji}</div>
                  <div className="m-ri-body">
                    <div className="m-ri-title">{r.title}</div>
                    <div className="m-ri-meta">{r.genre} · <span>{r.views}</span></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {tab === "shelf" && (
          <div className="m-section" style={{ marginTop: 0 }}>
            <div className="m-sec-hd">
              <h2>📚 <span className="accent">Tủ Sách Của Tôi</span></h2>
              <div className="m-sec-tabs">
                <span className="m-stab active">Đang đọc</span>
                <span className="m-stab">Đã xong</span>
              </div>
            </div>
            <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
              Đăng nhập để xem tủ sách của bạn
            </div>
          </div>
        )}

        {tab === "profile" && (
          <>
            <div style={{ background: "linear-gradient(135deg, var(--ac) 0%, var(--ac-dk) 100%)", padding: "32px 20px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, border: "2.5px solid rgba(255,255,255,.5)" }}>👤</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Đăng nhập / Đăng ký</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.75)" }}>Đọc không giới hạn, lưu tiến trình</div>
                  <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                    <span style={{ background: "#fff", color: "var(--ac)", fontSize: 13, fontWeight: 700, padding: "6px 16px", borderRadius: 20, cursor: "pointer" }}>Đăng nhập</span>
                    <span style={{ background: "rgba(255,255,255,.2)", color: "#fff", fontSize: 13, fontWeight: 600, padding: "6px 16px", borderRadius: 20, cursor: "pointer" }}>Đăng ký</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", background: "rgba(0,0,0,.12)", borderRadius: 10, overflow: "hidden" }}>
                {[["0","Đang đọc"],["0","Đã hoàn"],["0","Điểm"],["0","Bình luận"]].map(([n, l], i) => (
                  <div key={i} style={{ flex: 1, padding: "12px 8px", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,.2)" : "none", cursor: "pointer" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{n}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.75)" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="m-section" style={{ marginTop: 8 }}>
              {[["📖","Lịch sử đọc"],["🔖","Đánh dấu"],["💬","Bình luận của tôi"],["🎁","Điểm thưởng"],["⚙️","Cài đặt"],["❓","Trợ giúp & Phản hồi"],["📱","Tải App"]].map(([icon, label], i) => (
                <div key={i}>
                  {(i === 1 || i === 4) && <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", cursor: "pointer" }}>
                    <span style={{ fontSize: 20, width: 24, textAlign: "center" }}>{icon}</span>
                    <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 500, flex: 1 }}>{label}</span>
                    {label === "Tải App" && <span style={{ fontSize: 11, background: "var(--ac)", color: "#fff", padding: "1px 6px", borderRadius: 10, fontWeight: 600 }}>Mới</span>}
                    <span className="m-chevron" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      <nav className="m-bottom-nav">
        {([["home","🏠","Trang chủ"],["rank","🏆","Xếp hạng"],["shelf","📚","Tủ sách"],["profile","👤","Tôi"]] as [Tab,string,string][]).map(([t, icon, label]) => (
          <div key={t} className={`m-bn-item${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
            <span className="m-bn-icon">{icon}</span>
            <span className="m-bn-label">{label}</span>
          </div>
        ))}
      </nav>

      {searchOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "flex-start" }} onClick={() => setSearchOpen(false)}>
          <div style={{ width: "100%", maxWidth: 430, margin: "0 auto", background: "#fff", padding: "12px 14px", borderBottom: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="m-search-field-active">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" placeholder="Tên truyện, tác giả..." autoFocus />
              </div>
              <span style={{ fontSize: 14, color: "var(--ac)", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }} onClick={() => setSearchOpen(false)}>Huỷ</span>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>🔥 Tìm kiếm phổ biến</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {HOT_SEARCHES.map((s, i) => (
                  <Link key={i} href={`/mobile/search?q=${encodeURIComponent(s)}`} style={{ fontSize: 12.5, background: "#f5f5f5", color: "var(--text-sub)", padding: "5px 12px", borderRadius: 14 }} onClick={() => setSearchOpen(false)}>{s}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {drawerOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,.5)" }} onClick={() => setDrawerOpen(false)} />
          <div style={{ position: "fixed", top: 0, left: "calc(50% - 215px)", width: "76%", maxWidth: 300, height: "100%", background: "#fff", zIndex: 301, display: "flex", flexDirection: "column", overflowY: "auto" }}>
            <div style={{ background: "linear-gradient(135deg, var(--ac) 0%, var(--ac-dk) 100%)", padding: "40px 20px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 4 }}>👤</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Đăng nhập ngay</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.75)" }}>Thành viên thông thường</div>
            </div>
            {[["📚","Tủ sách"],["📖","Lịch sử đọc"],["sep",""],["🔥","Đang hot"],["🏆","Xếp hạng"],["🆕","Mới cập nhật"],["✅","Truyện đã hoàn"],["sep",""],["🎁","Điểm & Thưởng","Mới"],["💎","Nâng cấp VIP"],["sep",""],["⚙️","Cài đặt"],["❓","Trợ giúp"]].map(([icon, label, badge], i) =>
              icon === "sep" ? <div key={i} style={{ height: 1, background: "var(--border)", margin: "4px 0" }} /> :
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", cursor: "pointer" }}>
                <span style={{ fontSize: 20, width: 24, textAlign: "center" }}>{icon}</span>
                <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 500, flex: 1 }}>{label}</span>
                {badge && <span style={{ fontSize: 11, background: "var(--ac)", color: "#fff", padding: "1px 6px", borderRadius: 10, fontWeight: 600 }}>{badge}</span>}
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
