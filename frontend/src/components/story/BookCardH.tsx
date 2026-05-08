"use client"

import Link from "next/link"
import { showToast } from "@/lib/toast"
import CoverBox from "@/components/story/CoverBox"

type BookCardHData = {
  title: string
  tags: { label: string; highlight?: boolean }[]
  desc: string
  author: string
  authorHref?: string
  chapters: string
  views: string
  cover: { bg: string; emoji: string; image?: string }
  href?: string
}

function Inner({ title, tags, desc, author, authorHref, chapters, views, cover }: Omit<BookCardHData, "href">) {
  return (
    <>
      <CoverBox
        cover={cover}
        className="w-[64px] h-[96px] rounded-[3px] flex-shrink-0 shadow-[1px_2px_6px_rgba(0,0,0,.15)]"
        emojiSize="text-[26px]"
      />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold mb-[3px] overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-ac transition-colors">
          {title}
        </div>
        <div className="flex gap-[3px] flex-wrap mb-[4px]">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`text-[11px] px-[5px] py-[1px] rounded-[1px] ${
                tag.highlight ? "text-ac bg-ac-lt" : "text-[#888] bg-[#f2f2f2]"
              }`}
            >
              {tag.label}
            </span>
          ))}
        </div>
        <div className="text-[12px] text-[#666] line-clamp-2 leading-[1.6]">{desc}</div>
        <div className="flex gap-[6px] mt-[4px] text-[11px] text-[#999]">
          {authorHref
            ? <Link href={authorHref} className="relative z-10 hover:text-ac transition-colors">{author}</Link>
            : <span>{author}</span>
          }
          <span>·</span>
          <span className="text-ac">{chapters}</span>
          <span>·</span>
          <span>{views}</span>
        </div>
      </div>
    </>
  )
}

export default function BookCardH({ href, ...rest }: BookCardHData) {
  if (href) {
    // Stretched-link pattern: absolute overlay for the story href,
    // author link sits above it via relative z-10 — no nested <a>.
    return (
      <div className="flex gap-[10px] cursor-pointer group relative">
        <Link href={href} className="absolute inset-0 z-0" aria-label={rest.title} />
        <Inner {...rest} />
      </div>
    )
  }

  return (
    <div className="flex gap-[10px] cursor-pointer group" onClick={() => showToast("Truyện đang được cập nhật")}>
      <Inner {...rest} />
    </div>
  )
}
