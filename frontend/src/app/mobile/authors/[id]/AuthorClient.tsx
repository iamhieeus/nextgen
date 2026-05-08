"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { AuthorDetail } from "@/services/author.service"

type AuthorTab = "works" | "info" | "awards"

const STATUS_LABEL: Record<string, string> = {
  ONGOING:   "Đang ra",
  COMPLETED: "Đã hoàn",
  HIATUS:    "Tạm dừng",
  DROPPED:   "Drop",
}

const AWARDS = [
  { icon: "🏆", name: "Tác giả xuất sắc năm 2023", sub: "Giải nhất hạng mục Tu Tiên" },
  { icon: "🥇", name: "Truyện hot nhất quý 3/2023", sub: "Top 1 lượt đọc" },
  { icon: "⭐", name: "Top 10 tác giả yêu thích", sub: "Bình chọn từ độc giả" },
  { icon: "💎", name: "Tác giả VIP Vàng", sub: "Đạt huy hiệu tháng 6/2022" },
  { icon: "📚", name: "Milestone 10 tác phẩm hoàn", sub: "Tháng 1/2023" },
]

type Props = { author: AuthorDetail }

export default function AuthorClient({ author }: Props) {
  const [tab, setTab] = useState<AuthorTab>("works")
  const [following, setFollowing] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")

  const filtered = filterStatus === "all"
    ? author.stories
    : author.stories.filter(w => w.status === (filterStatus === "on" ? "ONGOING" : "COMPLETED"))

  const featured = author.stories[0]

  return (
    <>
      <div style={{ position: "relative", background: "linear-gradient(135deg, #1a0030 0%, #2d1260 35%, #6b0f1a 70%, #8b1a1a 100%)", paddingTop: 28, overflow: "hidden" }}>
        <div style={{ content: '""', position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(120,40,200,.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(200,40,40,.3) 0%, transparent 50%)", pointerEvents: "none" }} />

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 28, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", fontSize: 12, fontWeight: 600, color: "#fff", zIndex: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>9:41</span>
          <span>📶 📡 🔋</span>
        </div>

        <div style={{ position: "relative", zIndex: 5, display: "flex", alignItems: "center", padding: "0 12px", height: 50, gap: 8 }}>
          <Link href="/mobile" style={{ color: "rgba(255,255,255,.8)", fontSize: 28, cursor: "pointer", padding: 4, lineHeight: 1 }}>‹</Link>
          <Link href="/mobile" style={{ fontSize: 17, fontWeight: 900, color: "rgba(255,255,255,.9)", flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
            <Image src="/logo-v1.svg" alt="" width={26} height={26} style={{ borderRadius: 6 }} />
            Cấm Địa<sub style={{ fontSize: 9, fontWeight: 400, color: "rgba(255,255,255,.5)" }}>novel</sub>
          </Link>
          <span style={{ color: "rgba(255,255,255,.7)", fontSize: 22, padding: 4, cursor: "pointer" }}>↑</span>
        </div>

        <div style={{ position: "relative", zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 16px 22px" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: author.color || "linear-gradient(135deg,#f0e6d3,#c9a97a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, border: "3px solid rgba(255,255,255,.25)", boxShadow: "0 4px 20px rgba(0,0,0,.4)", marginBottom: 12 }}>
            {author.initial}
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 4, letterSpacing: -.3 }}>{author.penname}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginBottom: 6 }}>Tác giả · Cấm Địa</div>
          {author.bio && (
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)", textAlign: "center", lineHeight: 1.6, marginBottom: 14, maxWidth: 300 }}>
              "{author.bio}"
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
            <button onClick={() => setFollowing(v => !v)} style={{ padding: "10px 32px", background: following ? "rgba(255,255,255,.15)" : "var(--ac)", color: "#fff", fontSize: 14, fontWeight: 700, borderRadius: 24, cursor: "pointer", border: following ? "1.5px solid rgba(255,255,255,.3)" : "none", fontFamily: "inherit" }}>
              {following ? "✓ Đang theo dõi" : "+ Theo dõi"}
            </button>
            <button style={{ padding: "10px 20px", background: "rgba(255,255,255,.12)", color: "rgba(255,255,255,.85)", fontSize: 13, fontWeight: 600, borderRadius: 24, cursor: "pointer", border: "1.5px solid rgba(255,255,255,.2)", fontFamily: "inherit" }}>💬 Nhắn tin</button>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 5, display: "flex", background: "rgba(0,0,0,.2)" }}>
          {[[String(author.storyCount),"Tác phẩm"],["—","Theo dõi"],[author.totalWordsFormatted,"Chữ"],[String(author.daysWriting),"Ngày"]].map(([v, l], i) => (
            <div key={i} style={{ flex: 1, padding: "12px 8px", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,.1)" : "none" }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", lineHeight: 1.2 }}>{v}</div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.55)", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="m-scroll">
        <div className="m-tab-bar">
          {(["works","info","awards"] as AuthorTab[]).map(t => (
            <div key={t} className={`m-tab-item${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
              {t === "works" ? "Tác phẩm" : t === "info" ? "Giới thiệu" : "Thành tích"}
            </div>
          ))}
        </div>

        {tab === "works" && (
          <>
            {featured && (
              <div className="m-section">
                <div className="m-sec-hd"><h2 style={{ fontSize: 15, fontWeight: 800, flex: 1 }}>✨ Tác phẩm nổi bật</h2></div>
                <Link href={`/mobile/stories/${featured.slug}`} style={{ margin: "0 14px 12px", borderRadius: 10, overflow: "hidden", position: "relative", cursor: "pointer", display: "block" }}>
                  <div className={featured.cover.bg} style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70, position: "relative" }}>{featured.cover.emoji}</div>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.3) 60%, transparent 100%)" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 12px", zIndex: 2 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 3 }}>
                      <span style={{ fontSize: 10, background: "var(--ac)", color: "#fff", padding: "1px 6px", borderRadius: 2, marginRight: 4, fontWeight: 600 }}>HOT</span>
                      {featured.title}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>{featured.chapterCount} chương · {featured.viewCount} lượt đọc · {STATUS_LABEL[featured.status] ?? featured.status}</div>
                  </div>
                </Link>
              </div>
            )}

            <div className="m-section">
              <div className="m-sec-hd" style={{ justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 15, fontWeight: 800 }}>Tất cả tác phẩm</h2>
                <div style={{ display: "flex", gap: 5 }}>
                  {[["all","Tất cả"],["on","Đang ra"],["full","Đã hoàn"]].map(([v, l]) => (
                    <span key={v} onClick={() => setFilterStatus(v)} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 10, background: filterStatus === v ? "var(--ac)" : "#f5f5f5", color: filterStatus === v ? "#fff" : "var(--text-sub)", fontWeight: filterStatus === v ? 700 : 400, cursor: "pointer" }}>{l}</span>
                  ))}
                </div>
              </div>
              {filtered.map((w) => (
                <Link key={w.slug} href={`/mobile/stories/${w.slug}`} style={{ display: "flex", gap: 12, padding: "12px 14px", borderBottom: "1px solid var(--border)", cursor: "pointer", alignItems: "flex-start", textDecoration: "none", color: "inherit" }}>
                  <div className={w.cover.bg} style={{ width: 60, height: 80, borderRadius: 5, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}>{w.cover.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.title}</div>
                    <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                      <span style={{ fontSize: 10.5, color: "var(--ac)", background: "var(--ac-lt)", padding: "1px 6px", borderRadius: 3 }}>{w.category}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--text-sub)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.55 }}>{w.synopsis}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>👁 {w.viewCount}</span>
                      <span style={{ fontSize: 11, color: "var(--ac)", fontWeight: 500, marginLeft: "auto" }}>{w.chapterCount} chương</span>
                      <span style={{ fontSize: 10, background: w.status === "ONGOING" ? "#e8f5e9" : "#e3f2fd", color: w.status === "ONGOING" ? "#2e7d32" : "#1565c0", padding: "1px 5px", borderRadius: 2, fontWeight: 600 }}>{STATUS_LABEL[w.status] ?? w.status}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {tab === "info" && (
          <div className="m-section">
            {[
              { label: "Bút danh", value: author.penname },
              { label: "Tham gia", value: author.joinedLabel },
              { label: "Tổng tác phẩm", value: `${author.storyCount} truyện` },
              { label: "Tổng chữ", value: author.totalWordsFormatted },
              ...(author.bio ? [{ label: "Giới thiệu", value: author.bio }] : []),
              ...(author.website ? [{ label: "Website", value: author.website }] : []),
            ].map((row, i, arr) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", padding: "11px 14px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", gap: 8 }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)", width: 90, flexShrink: 0, paddingTop: 1 }}>{row.label}</span>
                <span style={{ fontSize: 13.5, color: "var(--text)", flex: 1, lineHeight: 1.6 }}>{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "awards" && (
          <div className="m-section">
            {AWARDS.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderBottom: i < AWARDS.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontSize: 26, flexShrink: 0 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}
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
