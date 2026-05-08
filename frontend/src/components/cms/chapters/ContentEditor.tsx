"use client"

import { useEffect, useRef, useCallback } from "react"

interface ContentEditorProps {
  initialText?:    string
  onWordCount:     (chars: number, words: number) => void
  onContentChange?: (text: string) => void
}

function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function textToHtml(text: string): string {
  return (text || "").split("\n").map(line => {
    if (line.trim() === "---")
      return '<div class="ed-divider" contenteditable="false">✦ &nbsp;&nbsp; ✦ &nbsp;&nbsp; ✦</div>'
    if (/^\[ps\]/i.test(line.trim()))
      return `<div class="ed-ps">${escHtml(line)}</div>`
    if (/^\[kw\]/i.test(line.trim()))
      return `<div class="ed-kw">${escHtml(line)}</div>`
    if (line.trim() === "")
      return "<div><br></div>"
    return `<div>${escHtml(line)}</div>`
  }).join("")
}

const btnCls = "h-7 px-2 rounded-[5px] text-[13px] text-[#444] border border-transparent hover:bg-[#eee] hover:text-[#111] transition-colors inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"

export default function ContentEditor({ initialText, onWordCount, onContentChange }: ContentEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  const updateMeta = useCallback(() => {
    const el = editorRef.current
    if (!el) return
    const val = el.innerText || ""
    const chars = val.replace(/\n/g, "").length
    const words = Math.round(val.replace(/\s+/g, " ").split(" ").filter(Boolean).length * 0.85)
    onWordCount(chars, words)
    onContentChange?.(val)
  }, [onWordCount])

  useEffect(() => {
    if (editorRef.current && initialText !== undefined) {
      editorRef.current.innerHTML = textToHtml(initialText)
      updateMeta()
    }
  }, [initialText, updateMeta])

  function execCmd(cmd: string) {
    editorRef.current?.focus()
    document.execCommand(cmd, false, undefined)
    updateMeta()
  }

  function insertBlock(type: "divider" | "ps" | "kw") {
    editorRef.current?.focus()
    const map = {
      divider: '<div class="ed-divider" contenteditable="false">✦ &nbsp;&nbsp; ✦ &nbsp;&nbsp; ✦</div><div><br></div>',
      ps:  '<div class="ed-ps" contenteditable="true">[ps] </div><div><br></div>',
      kw:  '<div class="ed-kw" contenteditable="true">[kw] </div><div><br></div>',
    }
    document.execCommand("insertHTML", false, map[type])
    updateMeta()
  }

  return (
    <>
      {/* Toolbar */}
      <style>{`
        .ed-editor-wrap { border: 1.5px solid #e5e5e5; border-radius: 8px; overflow: hidden; transition: border-color .15s; }
        .ed-editor-wrap:focus-within { border-color: #e5353e; }
        .ed-body { min-height: 460px; padding: 14px 18px; font-size: 14px; line-height: 1.85; outline: none; overflow-y: auto; word-break: break-word; }
        .ed-body:empty::before { content: 'Nhập nội dung chương...'; color: #bbb; pointer-events: none; }
        .ed-body p { margin: 0 0 .4em; }
        .ed-body div:empty { min-height: 1.4em; }
        .ed-divider { text-align: center; color: #bbb; letter-spacing: 10px; padding: 10px 0; font-size: 13px; display: block; cursor: default; }
        .ed-ps { display: block; margin: 6px 0; background: #eff6ff; border-left: 3px solid #60a5fa; padding: 8px 12px; border-radius: 0 6px 6px 0; font-size: 13.5px; color: #1e3a5f; }
        .ed-kw { display: block; margin: 6px 0; background: #fefce8; border-left: 3px solid #fbbf24; padding: 8px 12px; border-radius: 0 6px 6px 0; font-size: 13px; color: #713f12; }
      `}</style>

      <div className="ed-editor-wrap">
        <div className="flex items-center gap-0.5 px-2 py-[5px] bg-[#fafafa] border-b border-[#e5e5e5] flex-wrap">
          <button className={btnCls} title="Hoàn tác (Ctrl+Z)"   onClick={() => execCmd("undo")}>↩</button>
          <button className={btnCls} title="Làm lại (Ctrl+Y)"    onClick={() => execCmd("redo")}>↪</button>
          <span className="w-px h-[18px] bg-[#ddd] mx-1 shrink-0" />
          <button className={`${btnCls} font-bold`}              title="Đậm (Ctrl+B)"      onClick={() => execCmd("bold")}><b>B</b></button>
          <button className={`${btnCls} italic`}                 title="Nghiêng (Ctrl+I)"  onClick={() => execCmd("italic")}><i>I</i></button>
          <button className={`${btnCls} underline`}              title="Gạch chân (Ctrl+U)" onClick={() => execCmd("underline")}><u>U</u></button>
          <span className="w-px h-[18px] bg-[#ddd] mx-1 shrink-0" />
          <button className={btnCls} title="Căn trái"  onClick={() => execCmd("justifyLeft")}>⬤◁</button>
          <button className={btnCls} title="Căn giữa"  onClick={() => execCmd("justifyCenter")}>≡</button>
          <span className="w-px h-[18px] bg-[#ddd] mx-1 shrink-0" />
          <button className={btnCls} title="Chèn phân cách ✦✦✦" onClick={() => insertBlock("divider")}>✦ Phân cách</button>
          <button className={btnCls} title="Chèn ghi chú P.S."   onClick={() => insertBlock("ps")}>📌 P.S.</button>
          <button className={btnCls} title="Chèn từ khóa"        onClick={() => insertBlock("kw")}>🏷️ Từ khóa</button>
        </div>
        <div
          ref={editorRef}
          className="ed-body"
          contentEditable
          suppressContentEditableWarning
          onInput={updateMeta}
        />
      </div>
    </>
  )
}
