"use client"
import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

type StoryTab = "info" | "chapters" | "comments"

type Volume = {
  name: string; range: string; defaultOpen: boolean
  chapters: { no: string; title: string; date: string; free: boolean }[]
}

type Comment = {
  initial: string; avatarBg: string; name: string; badge?: string
  time: string; text: string; likes: number; liked: boolean
}

type Similar = {
  title: string; genre: string; chapters: string; cover: { bg: string; emoji: string }; href: string
}

type StoryDetail = {
  slug: string; title: string; author: string; authorId: number | null
  genres: string[]; status: "ongoing" | "completed"
  rating: number; ratingCount: number
  views: number | string; bookmarks: number | string
  chapterCount: number; wordCount: string
  cover: { bg: string; emoji: string }
  synopsis: string; tags: string[]
  firstChapterNo: number | null; lastChapterNo: number | null
}

type Chapter = Volume["chapters"][number]

type Props = {
  story: StoryDetail
  volumes: Volume[]
  totalChapters: number
  comments: Comment[]
  similar: Similar[]
}

export default function StoryClient({ story, volumes, totalChapters, comments: initComments, similar }: Props) {
  const [activeTab, setActiveTab] = useState<StoryTab>("info")
  const [synExpanded, setSynExpanded] = useState(false)
  const [shelved, setShelved] = useState(false)
  const [following, setFollowing] = useState(false)
  const [chSort, setChSort] = useState<"asc" | "desc">("asc")
  const [comments, setComments] = useState(initComments)
  const [chapters, setChapters] = useState<Chapter[]>(() => volumes.flatMap(v => v.chapters))
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const hasMore = chapters.length < totalChapters

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    const nextPage = page + 1
    const res = await fetch(`/api/stories/${story.slug}/chapters?page=${nextPage}`)
    const data = await res.json()
    setChapters(prev => [...prev, ...data.chapters])
    setPage(nextPage)
    setLoadingMore(false)
  }, [loadingMore, hasMore, page, story.slug])

  const sortedChapters = chSort === "asc" ? chapters : [...chapters].reverse()

  const parseChNo = (no: string) => parseInt(no.replace("Ch.", ""), 10)
  const statusLabel = story.status === "completed" ? "Đã hoàn" : "Đang ra"
  const ratingStars = Math.round(story.rating / 2)

  const formatNum = (n: number | string) => {
    const v = typeof n === "string" ? n : String(n)
    return v
  }

  return (
    <>
      <div style={{ position: "relative", height: 280, overflow: "hidden" }}>
        <div className={`m-b-bg ${story.cover.bg}`} style={{ position: "absolute", inset: 0, fontSize: 120, filter: "blur(20px)", transform: "scale(1.2)" }} />
        <div className={story.cover.bg} style={{ position: "absolute", inset: 0, opacity: 0.8 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,.5) 0%, rgba(0,0,0,.3) 40%, rgba(20,0,60,.9) 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 28, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.85)", zIndex: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>9:41</span>
          <span>📶 📡 🔋</span>
        </div>
        <div style={{ position: "absolute", top: 28, left: 0, right: 0, height: 50, display: "flex", alignItems: "center", padding: "0 12px", gap: 8, zIndex: 5 }}>
          <Link href="/mobile" style={{ color: "#fff", fontSize: 28, lineHeight: 1, cursor: "pointer", padding: 4 }}>‹</Link>
          <Link href="/mobile" style={{ fontSize: 16, fontWeight: 900, color: "rgba(255,255,255,.9)", letterSpacing: -.5, cursor: "pointer", flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
            <Image src="/logo-v1.svg" alt="" width={24} height={24} style={{ borderRadius: 5 }} />
            Cấm Địa<sub style={{ fontSize: 9, fontWeight: 400, color: "rgba(255,255,255,.5)" }}>novel</sub>
          </Link>
          <span style={{ color: "#fff", fontSize: 22, padding: 4, cursor: "pointer" }}>⋯</span>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 16px 16px", zIndex: 5, display: "flex", gap: 14, alignItems: "flex-end" }}>
          <div className={story.cover.bg} style={{ width: 88, height: 117, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, boxShadow: "0 4px 16px rgba(0,0,0,.5)", position: "relative" }}>
            {story.cover.emoji}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.55)", color: "#fff", fontSize: 10, fontWeight: 700, textAlign: "center", padding: "3px 0", borderRadius: "0 0 6px 6px" }}>{statusLabel}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingBottom: 2 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", lineHeight: 1.25, marginBottom: 5 }}>{story.title}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", marginBottom: 7 }}>
              Tác giả:{" "}
              {story.authorId ? (
                <Link href={`/mobile/authors/${story.authorId}`} style={{ color: "#ffcc80", fontWeight: 600 }}>{story.author}</Link>
              ) : (
                <span style={{ color: "#ffcc80", fontWeight: 600 }}>{story.author}</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {story.genres.map((t, i) => (
                <Link key={i} href={`/mobile/genres/${encodeURIComponent(t)}`} style={{ fontSize: 10.5, padding: "2px 8px", borderRadius: 3, border: "1px solid rgba(255,255,255,.3)", color: "rgba(255,255,255,.85)", fontWeight: 500, background: i === 0 ? "var(--ac)" : "transparent", borderColor: i === 0 ? "var(--ac)" : undefined }}>{t}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", display: "flex", borderBottom: "1px solid var(--border)" }}>
        {[[String(story.chapterCount),"Chương"],[formatNum(story.views),"Lượt đọc"],[formatNum(story.bookmarks),"Yêu thích"],[story.rating.toFixed(1),"Điểm"]].map(([v, l], i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 8px", gap: 2, borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: i === 2 ? "var(--ac)" : "var(--text)" }}>{v}</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{l}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#fff", padding: 9, borderBottom: "1px solid var(--border)" }}>
        <span style={{ color: "#f59e0b", fontSize: 15, letterSpacing: 1 }}>{"★".repeat(ratingStars)}{"☆".repeat(5 - ratingStars)}</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: "#f59e0b" }}>{story.rating.toFixed(1)}</span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>/ 10 · {story.ratingCount.toLocaleString()} đánh giá</span>
      </div>

      <div style={{ background: "#fff", display: "flex", gap: 8, padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
        {story.firstChapterNo !== null ? (
          <Link href={`/mobile/stories/${story.slug}/chapters/${story.firstChapterNo}`} style={{ flex: 2, padding: 12, background: "var(--ac)", color: "#fff", fontSize: 15, fontWeight: 800, border: "none", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>▶ Đọc từ đầu</Link>
        ) : (
          <div style={{ flex: 2, padding: 12, background: "#ccc", color: "#fff", fontSize: 15, fontWeight: 800, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>Chưa có chương</div>
        )}
        <button onClick={() => setShelved(v => !v)} style={{ flex: 1, padding: 12, background: shelved ? "var(--ac)" : "var(--ac-lt)", color: shelved ? "#fff" : "var(--ac)", fontSize: 13, fontWeight: 700, border: `1.5px solid var(--ac)`, borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>
          {shelved ? "✓ Đã lưu" : "+ Lưu"}
        </button>
        <div style={{ width: 46, padding: 12, background: "#f5f5f5", color: "var(--text-sub)", fontSize: 20, border: "1.5px solid var(--border)", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>↑</div>
      </div>

      <div className="m-scroll">
        <div className="m-tab-bar">
          {(["info","chapters","comments"] as StoryTab[]).map(t => (
            <div key={t} className={`m-tab-item${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)}>
              {t === "info" ? "Thông tin" : t === "chapters" ? "Chương" : "Bình luận"}
            </div>
          ))}
        </div>

        {activeTab === "info" && (
          <>
            <div className="m-section">
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 13.5, color: "var(--text-sub)", lineHeight: 1.75, maxHeight: synExpanded ? 1000 : 88, overflow: "hidden", transition: "max-height .3s ease" }}>
                  {story.synopsis.split("\n").map((p, i) => <p key={i} style={{ marginBottom: "0.75em" }}>{p}</p>)}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 8, fontSize: 13, color: "var(--ac)", cursor: "pointer", fontWeight: 600 }} onClick={() => setSynExpanded(v => !v)}>
                  {synExpanded ? "Thu gọn" : "Xem thêm"} <span style={{ fontSize: 10, display: "inline-block", transform: synExpanded ? "rotate(180deg)" : "none" }}>▾</span>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 14px 14px" }}>
                {story.tags.map((t, i) => (
                  <Link key={i} href={`/mobile/genres/${encodeURIComponent(t)}`} style={{ fontSize: 12, background: "#f5f5f5", color: "#555", padding: "4px 12px", borderRadius: 14, border: "1px solid var(--border)" }}>{t}</Link>
                ))}
              </div>
            </div>

            <div className="m-section">
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#7f0000,#c62828)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>✍️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{story.author}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Tác giả · Cấm Địa</div>
                </div>
                <button onClick={() => setFollowing(v => !v)} style={{ fontSize: 12.5, fontWeight: 700, color: following ? "var(--text-sub)" : "#fff", background: following ? "#f5f5f5" : "var(--ac)", padding: "6px 16px", borderRadius: 16, cursor: "pointer", border: "none", fontFamily: "inherit" }}>
                  {following ? "Đã theo dõi" : "+ Theo dõi"}
                </button>
              </div>
            </div>

            {similar.length > 0 && (
              <div className="m-section">
                <div className="m-sec-hd"><h2>📖 <span className="accent">Truyện Liên Quan</span></h2></div>
                <div style={{ overflowX: "auto", scrollbarWidth: "none", padding: "0 14px 14px" }}>
                  <div style={{ display: "flex", gap: 10, minWidth: "max-content" }}>
                    {similar.map((r) => (
                      <Link key={r.href} href={`/mobile${r.href}`} style={{ width: 76, cursor: "pointer", flexShrink: 0 }}>
                        <div className={r.cover.bg} style={{ width: 76, height: 101, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "0 2px 8px rgba(0,0,0,.15)", marginBottom: 5 }}>{r.cover.emoji}</div>
                        <div style={{ fontSize: 11.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "chapters" && (
          <div className="m-section">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 8px" }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Tổng <strong style={{ color: "var(--text)", fontSize: 14 }}>{story.chapterCount}</strong> chương</span>
              <div style={{ display: "flex", gap: 4 }}>
                {(["asc","desc"] as const).map(s => (
                  <button key={s} onClick={() => setChSort(s)} style={{ fontSize: 12, padding: "4px 12px", border: "1px solid var(--border)", background: chSort === s ? "var(--ac)" : "#fff", color: chSort === s ? "#fff" : "var(--text-sub)", cursor: "pointer", borderRadius: 12, fontWeight: 500, fontFamily: "inherit", borderColor: chSort === s ? "var(--ac)" : undefined }}>
                    {s === "asc" ? "↑ Tăng" : "↓ Giảm"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              {sortedChapters.map((ch) => {
                const no = parseChNo(ch.no)
                return (
                  <Link key={ch.no} href={`/mobile/stories/${story.slug}/chapters/${no}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", borderBottom: "1px solid var(--border)", cursor: "pointer", textDecoration: "none", color: "inherit" }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0, width: 40 }}>{ch.no}</span>
                    <span style={{ fontSize: 13.5, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{ch.title}</span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>{ch.date}</span>
                    {ch.free && <span style={{ fontSize: 10, background: "#e8f5e9", color: "#2e7d32", padding: "1px 6px", borderRadius: 2, flexShrink: 0, fontWeight: 600 }}>Miễn phí</span>}
                  </Link>
                )
              })}
              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  style={{ width: "100%", padding: "14px", fontSize: 13, color: loadingMore ? "var(--text-muted)" : "var(--ac)", fontWeight: 600, background: "#fafafa", border: "none", borderTop: "1px solid var(--border)", cursor: loadingMore ? "default" : "pointer", fontFamily: "inherit" }}
                >
                  {loadingMore ? "Đang tải..." : `Tải thêm (${totalChapters - chapters.length} chương còn lại)`}
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "comments" && (
          <div className="m-section">
            <div style={{ display: "flex", gap: 10, padding: 14, borderBottom: "1px solid var(--border)" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#e5353e,#b82830)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>T</div>
              <div style={{ flex: 1, background: "#f5f5f5", border: "1px solid var(--border)", borderRadius: 20, padding: "9px 14px", fontSize: 13.5, color: "var(--text-muted)", cursor: "pointer" }}>Viết bình luận...</div>
            </div>
            {comments.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "13px 14px", borderBottom: "1px solid var(--border)" }}>
                <div className={c.avatarBg} style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>{c.initial}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</span>
                    {c.badge && <span style={{ fontSize: 10, background: "var(--ac-lt)", color: "var(--ac)", border: "1px solid #ffc5c7", padding: "1px 5px", borderRadius: 2, fontWeight: 600 }}>{c.badge}</span>}
                    <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.6, marginBottom: 6 }}>{c.text}</div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <span onClick={() => setComments(prev => prev.map((x, j) => j === i ? { ...x, liked: !x.liked, likes: x.liked ? x.likes - 1 : x.likes + 1 } : x))} style={{ fontSize: 12, color: c.liked ? "var(--ac)" : "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                      {c.liked ? "❤️" : "🤍"} {c.likes}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", cursor: "pointer" }}>💬 Trả lời</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ position: "fixed", bottom: "calc(var(--bot-h) + var(--safe-bot) + 12px)", right: 16, width: 40, height: 40, borderRadius: "50%", background: "var(--ac)", color: "#fff", fontSize: 18, border: "none", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,.25)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150 }}
        >↑</button>
      )}

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
