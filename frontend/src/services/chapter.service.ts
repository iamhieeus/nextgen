import type { Chapter, ChapterParagraph } from "@/generated/prisma"
import { prisma } from "@/lib/prisma"

export type ChapterData = {
  storyTitle: string
  author: string
  chapterNo: number
  chapterTitle: string
  wordCount: string
  date: string
  cover: { bg: string; emoji: string; image?: string }
  publishedDate: string
  genres: string[]
  readerCount: string
  prevChapter: { no: number; title: string } | null
  nextChapter: { no: number; title: string } | null
  paragraphs: { type: string; text: string; comments?: number }[]
}

export async function getChapter(_storyId: string, chapterNo: number): Promise<ChapterData | null> {
  const chapter = await prisma.chapter.findFirst({
    where: { story: { slug: _storyId }, chapterNo },
    include: {
      story: { include: { category: true } },
      paragraphs: { orderBy: { sortOrder: "asc" } },
    },
  })
  if (!chapter) return null

  type ChapterWithRelations = Chapter & {
    story: { id: number; title: string; author: string; coverBg: string; coverEmoji: string; coverImage: string; category: { name: string } }
    paragraphs: ChapterParagraph[]
  }
  const c = chapter as ChapterWithRelations

  const [prev, next, junctionCategories] = await Promise.all([
    prisma.chapter.findFirst({
      where: { storyId: c.storyId, chapterNo: chapterNo - 1 },
      select: { chapterNo: true, title: true },
    }),
    prisma.chapter.findFirst({
      where: { storyId: c.storyId, chapterNo: chapterNo + 1 },
      select: { chapterNo: true, title: true },
    }),
    prisma.$queryRaw<{ name: string }[]>`
      SELECT cat.name FROM story_category sc
      JOIN category cat ON cat.id = sc.category_id
      WHERE sc.story_id = ${c.storyId}
      ORDER BY cat.sort_order ASC
    `,
  ])

  const allGenres = [c.story.category.name, ...junctionCategories.map(r => r.name)]
    .filter((name, i, arr) => arr.indexOf(name) === i)

  return {
    storyTitle: c.story.title,
    author: c.story.author,
    chapterNo: c.chapterNo,
    chapterTitle: c.title,
    wordCount: c.wordCount,
    date: c.publishedAt.toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }),
    cover: { bg: c.story.coverBg, emoji: c.story.coverEmoji, image: c.story.coverImage || undefined },
    publishedDate: c.publishedAt.toLocaleDateString("vi-VN"),
    genres: allGenres,
    readerCount: c.viewCount,
    prevChapter: prev ? { no: prev.chapterNo, title: prev.title } : null,
    nextChapter: next ? { no: next.chapterNo, title: next.title } : null,
    paragraphs: c.paragraphs.map((p: ChapterParagraph) => ({
      type: p.type,
      text: p.text,
      comments: p.commentCount || undefined,
    })),
  }
}
