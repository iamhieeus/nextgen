import type { Author, Story, Category, StoryTag } from "@/generated/prisma"
import { prisma } from "@/lib/prisma"

export type AuthorStory = {
  id: number
  title: string
  slug: string
  category: string
  status: "ONGOING" | "COMPLETED" | "HIATUS" | "DROPPED"
  wordCount: string
  chapterCount: number
  ratingAvg: number
  ratingCount: number
  viewCount: string
  synopsis: string
  tags: string[]
  cover: { bg: string; emoji: string }
  href: string
}

export type AuthorDetail = {
  id: number
  penname: string
  bio: string
  initial: string
  color: string
  joinedLabel: string
  daysWriting: number
  facebook: string
  twitter: string
  website: string
  totalWordsFormatted: string
  storyCount: number
  stories: AuthorStory[]
}

const STATUS_LABEL: Record<string, string> = {
  ONGOING:   "Đang ra",
  COMPLETED: "Hoàn thành",
  HIATUS:    "Tạm dừng",
  DROPPED:   "Đã drop",
}

export async function getAuthorDetail(id: number): Promise<AuthorDetail | null> {
  const author = await prisma.author.findUnique({
    where: { id },
    include: {
      stories: {
        include: { category: true, tags: true },
        orderBy: { id: "desc" },
      },
    },
  })
  if (!author) return null

  const a = author as Author & {
    stories: (Story & { category: Category; tags: StoryTag[] })[]
  }

  // Total words: sum chapter word_count for all stories by this author
  const storyIds = a.stories.map(s => s.id)
  const wordRows = storyIds.length > 0
    ? await prisma.$queryRaw<{ total: string | null }[]>`
        SELECT SUM(
          CAST(NULLIF(regexp_replace(c.word_count, '[^0-9]', '', 'g'), '') AS BIGINT)
        ) AS total
        FROM chapter c
        WHERE c.story_id = ANY(${storyIds}::int[])
      `
    : [{ total: null }]
  const totalWords = Number(wordRows[0]?.total ?? 0)
  const totalWordsFormatted =
    totalWords === 0 ? "—" :
    totalWords >= 10_000_000 ? `${(totalWords / 10_000).toFixed(0)}万` :
    totalWords >= 1_000_000  ? `${(totalWords / 1_000_000).toFixed(1)}M` :
    totalWords >= 1_000      ? `${(totalWords / 1_000).toFixed(1)}K` :
    String(totalWords)

  const daysWriting = Math.floor((Date.now() - a.joinedAt.getTime()) / 86_400_000)

  return {
    id: a.id,
    penname: a.penname,
    bio: a.bio,
    initial: a.initial || a.penname.charAt(0).toUpperCase(),
    color: a.color,
    joinedLabel: a.joinedAt.toLocaleDateString("vi-VN", { month: "long", year: "numeric" }),
    daysWriting,
    facebook: a.facebook,
    twitter: a.twitter,
    website: a.website,
    totalWordsFormatted,
    storyCount: a.stories.length,
    stories: a.stories.map(s => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      category: s.category.name,
      status: s.status as AuthorStory["status"],
      wordCount: s.wordCount,
      chapterCount: s.chapterCount,
      ratingAvg: s.ratingAvg,
      ratingCount: s.ratingCount,
      viewCount: s.viewCount,
      synopsis: s.synopsis,
      tags: s.tags.map(t => t.label),
      cover: { bg: s.coverBg, emoji: s.coverEmoji, image: s.coverImage || undefined },
      href: `/stories/${s.slug}`,
    })),
  }
}
