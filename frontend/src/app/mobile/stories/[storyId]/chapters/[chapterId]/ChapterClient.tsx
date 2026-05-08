"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import type { ChapterData } from "@/services/chapter.service"

type Theme = "paper" | "white" | "green" | "dark"
type Font = "sans" | "serif"

const THEME_VARS: Record<Theme, React.CSSProperties> = {
  paper: { "--bg": "#f5f1e8", "--panel": "#fdf9f0", "--text": "#2a2015", "--text-sub": "#6b5c48", "--text-muted": "#a09080", "--ui-bg": "rgba(253,249,240,.96)", "--ui-border": "#e0d5c5" } as React.CSSProperties,
  white: { "--bg": "#ffffff", "--panel": "#ffffff", "--text": "#222", "--text-sub": "#555", "--text-muted": "#999", "--ui-bg": "rgba(255,255,255,.97)", "--ui-border": "#e5e5e5" } as React.CSSProperties,
  dark:  { "--bg": "#1c1b18", "--panel": "#252420", "--text": "#c5b89a", "--text-sub": "#9a8a70", "--text-muted": "#605850", "--ui-bg": "rgba(28,27,24,.97)", "--ui-border": "#3a3830" } as React.CSSProperties,
  green: { "--bg": "#e8f0e0", "--panel": "#eff5e8", "--text": "#1a2e10", "--text-sub": "#3d5028", "--text-muted": "#8a9e78", "--ui-bg": "rgba(239,245,232,.97)", "--ui-border": "#c8d8b8" } as React.CSSProperties,
}

type ChListItem = { no: number; name: string; locked: boolean }

type Props = {
  chapter: ChapterData
  storySlug: string
  chapterList: ChListItem[]
}

export default function ChapterClient({ chapter, storySlug, chapterList }: Props) {
  const [theme, setTheme] = useState<Theme>("paper")
  const [font, setFont] = useState<Font>("sans")
  const [fontSize, setFontSize] = useState(18)
  const [lineHeight, setLineHeight] = useState(1.9)
  const [uiVisible, setUiVisible] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [chListOpen, setChListOpen] = useState(false)
  const [cmtOpen, setCmtOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const parent = el.parentElement!
    const onScroll = () => {
      const pct = Math.min(100, Math.round((parent.scrollTop / (parent.scrollHeight - parent.clientHeight)) * 100))
      setProgress(pct || 0)
    }
    parent.addEventListener("scroll", onScroll, { passive: true })
    return () => parent.removeEventListener("scroll", onScroll)
  }, [])

  const chNo = chapter.chapterNo
  const prevCh = chapter.prevChapter?.no ?? null
  const nextCh = chapter.nextChapter?.no ?? null

  const vars = THEME_VARS[theme]

  return (
    <div style={{ ...vars, background: "var(--bg)" as string, color: "var(--text)" as string, minHeight: "100vh", position: "relative", fontFamily: font === "serif" ? "'Lora', Georgia, serif" : "inherit" }}>

      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, height: 3, background: "rgba(0,0,0,.08)", zIndex: 500 }}>
        <div style={{ height: "100%", background: "var(--ac)", width: `${progress}%`, transition: "width .1s", borderRadius: "0 2px 2px 0" }} />
      </div>

      <div style={{ position: "fixed", top: 0, left: "50%", transform: uiVisible ? "translateX(-50%)" : "translateX(-50%) translateY(-100%)", width: "100%", maxWidth: 430, zIndex: 400, background: "var(--ui-bg)" as string, borderBottom: "1px solid var(--ui-border)" as string, display: "flex", alignItems: "center", padding: "6px 12px", gap: 8, backdropFilter: "blur(10px)", opacity: uiVisible ? 1 : 0, pointerEvents: uiVisible ? "auto" : "none", transition: "opacity .2s, transform .2s" }}>
        <Link href={`/mobile/stories/${storySlug}`} style={{ fontSize: 28, color: "var(--text-sub)" as string, cursor: "pointer", padding: "6px 4px", lineHeight: 1, flexShrink: 0 }}>‹</Link>
        <Link href="/mobile" style={{ fontSize: 15, fontWeight: 900, color: "var(--ac)", letterSpacing: -.5, cursor: "pointer", flexShrink: 0, lineHeight: 1, display: "flex", alignItems: "center", gap: 5 }}>
          <Image src="/logo-v1.svg" alt="" width={22} height={22} style={{ borderRadius: 5 }} />
          Cấm Địa<sub style={{ fontSize: 8, fontWeight: 400, color: "var(--text-muted)" as string }}>novel</sub>
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)" as string, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chapter.storyTitle}</div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text)" as string, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Chương {chNo}: {chapter.chapterTitle}</div>
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <div onClick={() => setChListOpen(true)} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "var(--text-sub)" as string, cursor: "pointer", borderRadius: 6 }}>☰</div>
          <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "var(--text-sub)" as string, cursor: "pointer", borderRadius: 6 }}>⋯</div>
        </div>
      </div>

      <div ref={contentRef} style={{ padding: "74px 20px 180px", minHeight: "100vh", cursor: "default" }} onClick={() => !settingsOpen && !chListOpen && !cmtOpen && setUiVisible(v => !v)}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" as string, marginBottom: 24, lineHeight: 1.4, textAlign: "center" }}>
          <small style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)" as string, marginBottom: 4 }}>Chương {chNo}</small>
          {chapter.chapterTitle}
        </div>
        <div style={{ fontSize, lineHeight, color: "var(--text)" as string }}>
          {chapter.paragraphs.map((para, i) => (
            <p key={i} style={{ marginBottom: "1em", textIndent: para.text.startsWith("·") ? 0 : "2em", textAlign: para.text.startsWith("·") ? "center" : undefined, color: para.text.startsWith("·") ? "var(--text-muted)" as string : undefined, letterSpacing: para.text.startsWith("·") ? 8 : undefined }}>
              {para.text}
            </p>
          ))}
        </div>
        <div style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)" as string, marginTop: 32, paddingTop: 16, borderTop: "1px dashed var(--ui-border)" as string }}>
          ✦ Hết chương {chNo} ✦<br />
          <span style={{ fontSize: 12 }}>Tác giả: {chapter.author}</span>
        </div>

        <div style={{ margin: "20px 0", background: "linear-gradient(110deg, #fff8e1, #ffe082)", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", border: "1px solid #ffd54f" }} onClick={e => e.stopPropagation()}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>🎁</span>
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: 13.5, fontWeight: 700, color: "#e65100" }}>Tặng quà cho tác giả</strong>
            <p style={{ fontSize: 12, color: "#bf360c" }}>Ủng hộ {chapter.author} tiếp tục ra chương</p>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, background: "#ff6f00", color: "#fff", padding: "6px 14px", borderRadius: 14, whiteSpace: "nowrap" }}>Tặng</div>
        </div>

        <div style={{ display: "flex", gap: 10, padding: "0 0 20px" }}>
          {prevCh ? (
            <Link href={`/mobile/stories/${storySlug}/chapters/${prevCh}`} style={{ flex: 1, padding: 13, textAlign: "center", background: "var(--panel)" as string, border: "1px solid var(--ui-border)" as string, borderRadius: 8, fontSize: 14, fontWeight: 700, color: "var(--text-sub)" as string, cursor: "pointer" }} onClick={e => e.stopPropagation()}>‹ Chương trước</Link>
          ) : (
            <div style={{ flex: 1, padding: 13, textAlign: "center", background: "var(--panel)" as string, border: "1px solid var(--ui-border)" as string, borderRadius: 8, fontSize: 14, fontWeight: 700, color: "var(--text-muted)" as string }}>‹ Đầu truyện</div>
          )}
          {nextCh ? (
            <Link href={`/mobile/stories/${storySlug}/chapters/${nextCh}`} style={{ flex: 1, padding: 13, textAlign: "center", background: "var(--ac)", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }} onClick={e => e.stopPropagation()}>Chương sau ›</Link>
          ) : (
            <div style={{ flex: 1, padding: 13, textAlign: "center", background: "var(--ac)", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, color: "#fff", opacity: 0.5 }}>Hết truyện</div>
          )}
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: uiVisible ? "translateX(-50%)" : "translateX(-50%) translateY(100%)", width: "100%", maxWidth: 430, zIndex: 400, background: "var(--ui-bg)" as string, borderTop: "1px solid var(--ui-border)" as string, backdropFilter: "blur(10px)", transition: "opacity .2s, transform .2s", opacity: uiVisible ? 1 : 0, pointerEvents: uiVisible ? "auto" : "none", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px 6px" }}>
          <span style={{ fontSize: 11.5, color: "var(--text-muted)" as string, whiteSpace: "nowrap" }}>Ch.{chNo}</span>
          <div style={{ flex: 1, height: 4, background: "var(--ui-border)" as string, borderRadius: 2, position: "relative" }}>
            <div style={{ height: "100%", background: "var(--ac)", borderRadius: 2, width: `${progress}%`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "50%", left: `${progress}%`, transform: "translate(-50%,-50%)", width: 14, height: 14, background: "var(--ac)", borderRadius: "50%", boxShadow: "0 1px 4px rgba(0,0,0,.2)", pointerEvents: "none" }} />
          </div>
          <span style={{ fontSize: 11.5, color: "var(--text-muted)" as string, whiteSpace: "nowrap" }}>{progress}%</span>
        </div>
        <div style={{ display: "flex" }}>
          {prevCh ? (
            <Link href={`/mobile/stories/${storySlug}/chapters/${prevCh}`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, padding: "10px 4px", cursor: "pointer", color: "var(--text-muted)" as string }}>
              <span style={{ fontSize: 22 }}>‹</span>
              <span style={{ fontSize: 10.5, fontWeight: 500 }}>Trước</span>
            </Link>
          ) : <div style={{ flex: 1 }} />}
          <div onClick={() => setCmtOpen(true)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, padding: "10px 4px", cursor: "pointer", color: "var(--text-muted)" as string }}>
            <span style={{ fontSize: 22 }}>💬</span>
            <span style={{ fontSize: 10.5, fontWeight: 500 }}>Bình luận</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, padding: "10px 4px", cursor: "pointer", color: "var(--text-muted)" as string }}>
            <span style={{ fontSize: 22 }}>🔖</span>
            <span style={{ fontSize: 10.5, fontWeight: 500 }}>Đánh dấu</span>
          </div>
          <div onClick={() => { setSettingsOpen(v => !v); setChListOpen(false); setCmtOpen(false) }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, padding: "10px 4px", cursor: "pointer", color: settingsOpen ? "var(--ac)" : "var(--text-muted)" as string }}>
            <span style={{ fontSize: 22 }}>⚙️</span>
            <span style={{ fontSize: 10.5, fontWeight: 500 }}>Cài đặt</span>
          </div>
          {nextCh ? (
            <Link href={`/mobile/stories/${storySlug}/chapters/${nextCh}`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, padding: "10px 4px", cursor: "pointer", color: "var(--text-muted)" as string }}>
              <span style={{ fontSize: 22 }}>›</span>
              <span style={{ fontSize: 10.5, fontWeight: 500 }}>Sau</span>
            </Link>
          ) : <div style={{ flex: 1 }} />}
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", width: "100%", maxWidth: 430, zIndex: 500, background: "var(--ui-bg)" as string, borderTop: "2px solid var(--ui-border)" as string, borderRadius: "16px 16px 0 0", padding: "16px 16px 28px", boxShadow: "0 -4px 20px rgba(0,0,0,.15)", transition: "transform .3s ease", transform: settingsOpen ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(100%)" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, background: "var(--ui-border)" as string, borderRadius: 2, margin: "0 auto 16px" }} />
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)" as string, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", marginBottom: 10 }}>Giao diện</div>
          <div style={{ display: "flex", gap: 10 }}>
            {(["paper","white","green","dark"] as Theme[]).map(t => (
              <div key={t} onClick={() => setTheme(t)} style={{ width: 34, height: 34, borderRadius: "50%", cursor: "pointer", border: theme === t ? "3px solid var(--ac)" : "3px solid transparent", transform: theme === t ? "scale(1.1)" : "scale(1)", transition: "all .15s", background: t === "paper" ? "#f5f1e8" : t === "white" ? "#ffffff" : t === "green" ? "#e8f0e0" : "#1c1b18", boxShadow: `inset 0 0 0 1px ${t === "dark" ? "#555" : "#ddd"}` }} />
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)" as string, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", marginBottom: 10 }}>Phông chữ</div>
          <div style={{ display: "flex", gap: 8 }}>
            {(["sans","serif"] as Font[]).map(f => (
              <button key={f} onClick={() => setFont(f)} style={{ flex: 1, padding: "8px 4px", textAlign: "center", fontSize: 13, background: "var(--panel)" as string, border: `1.5px solid ${font === f ? "var(--ac)" : "var(--ui-border)"}`, borderRadius: 6, cursor: "pointer", color: font === f ? "var(--ac)" : "var(--text-sub)" as string, fontWeight: font === f ? 700 : 500, fontFamily: f === "serif" ? "Georgia, serif" : "inherit" }}>
                {f === "sans" ? "Sans" : "Serif"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)" as string, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", marginBottom: 10 }}>Cỡ chữ</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setFontSize(s => Math.max(14, s - 1))} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, background: "var(--panel)" as string, border: "1.5px solid var(--ui-border)" as string, borderRadius: 8, cursor: "pointer", color: "var(--text-sub)" as string, fontWeight: 700 }}>−</button>
            <span style={{ flex: 1, textAlign: "center", fontSize: 14, fontWeight: 700, color: "var(--text)" as string }}>{fontSize}px</span>
            <button onClick={() => setFontSize(s => Math.min(26, s + 1))} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, background: "var(--panel)" as string, border: "1.5px solid var(--ui-border)" as string, borderRadius: 8, cursor: "pointer", color: "var(--text-sub)" as string, fontWeight: 700 }}>+</button>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" as string, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", marginBottom: 10 }}>Giãn dòng</div>
          <input type="range" min={1.5} max={2.5} step={0.1} value={lineHeight} onChange={e => setLineHeight(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--ac)" }} />
          <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)" as string, marginTop: 4 }}>{lineHeight.toFixed(1)}</div>
        </div>
      </div>

      {chListOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 490, background: "rgba(0,0,0,.45)" }} onClick={() => setChListOpen(false)} />
          <div style={{ position: "fixed", top: 0, bottom: 0, right: "calc(50% - 215px)", width: "80%", maxWidth: 320, background: "var(--panel)" as string, zIndex: 491, display: "flex", flexDirection: "column", boxShadow: "-4px 0 20px rgba(0,0,0,.15)" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--ui-border)" as string, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 800, color: "var(--text)" as string }}>Danh Sách Chương</span>
              <span style={{ fontSize: 20, color: "var(--text-muted)" as string, cursor: "pointer", padding: 4 }} onClick={() => setChListOpen(false)}>✕</span>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {chapterList.map((ch) => (
                <Link key={ch.no} href={`/mobile/stories/${storySlug}/chapters/${ch.no}`} onClick={() => setChListOpen(false)} style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--ui-border)" as string, cursor: "pointer", gap: 10, textDecoration: "none", background: ch.no === chNo ? "var(--ac-lt)" as string : undefined }}>
                  <span style={{ fontSize: 11.5, color: ch.no === chNo ? "var(--ac)" : "var(--text-muted)" as string, width: 36, flexShrink: 0 }}>Ch.{ch.no}</span>
                  <span style={{ fontSize: 13.5, fontWeight: ch.no === chNo ? 700 : 500, color: ch.no === chNo ? "var(--ac)" : "var(--text)" as string, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ch.name}</span>
                  {ch.locked && <span style={{ fontSize: 13 }}>🔒</span>}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {cmtOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 490, background: "rgba(0,0,0,.45)" }} onClick={() => setCmtOpen(false)} />
          <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, height: "75vh", background: "var(--panel)" as string, zIndex: 491, borderRadius: "16px 16px 0 0", display: "flex", flexDirection: "column", boxShadow: "0 -4px 20px rgba(0,0,0,.15)" }}>
            <div style={{ width: 36, height: 4, background: "var(--ui-border)" as string, borderRadius: 2, margin: "8px auto 0" }} />
            <div style={{ padding: "10px 16px 12px", borderBottom: "1px solid var(--ui-border)" as string, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 800, color: "var(--text)" as string }}>Bình Luận Chương {chNo}</span>
              <span style={{ fontSize: 22, color: "var(--text-muted)" as string, cursor: "pointer" }} onClick={() => setCmtOpen(false)}>✕</span>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              <div style={{ padding: "24px 16px", textAlign: "center", color: "var(--text-muted)" as string, fontSize: 13 }}>
                Đăng nhập để xem và viết bình luận
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, padding: "10px 14px 28px", borderTop: "1px solid var(--ui-border)" as string, alignItems: "center" }}>
              <input style={{ flex: 1, height: 38, background: "rgba(0,0,0,.05)", border: "1px solid var(--ui-border)" as string, borderRadius: 20, padding: "0 14px", fontSize: 13.5, color: "var(--text)" as string, fontFamily: "inherit", outline: "none" }} placeholder="Viết bình luận..." />
              <button style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: "var(--ac)", padding: "8px 16px", borderRadius: 18, cursor: "pointer", border: "none", fontFamily: "inherit" }}>Gửi</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
