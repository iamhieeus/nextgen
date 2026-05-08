import type {
  Slide, SlideTag,
  FeaturedAuthor, Category, Story, StoryTag,
} from "@/generated/prisma"
import { prisma } from "@/lib/prisma"

export async function getSlides() {
  const slides = await prisma.slide.findMany({
    orderBy: { sortOrder: "asc" },
    include: { tags: true },
  })
  return slides.map((s: Slide & { tags: SlideTag[] }) => ({
    title: s.title,
    desc: s.desc,
    author: s.author,
    chapters: s.chapters,
    views: s.views,
    bg: s.bg,
    emoji: s.emoji,
    tags: s.tags.map((t: SlideTag) => ({
      label: t.label,
      color: (t.color || undefined) as "green" | "blue" | undefined,
    })),
  }))
}

export async function getHotList() {
  const stories = await prisma.story.findMany({
    include: { category: true },
    orderBy: { ratingAvg: "desc" },
    take: 8,
  })
  return (stories as (Story & { category: Category })[]).map((s, i) => ({
    rank:     i + 1,
    title:    s.title,
    genres:   s.category.name,
    chapters: s.chapterCount ? `${s.chapterCount} ch` : "",
    bg:       s.coverBg,
    emoji:    s.coverEmoji,
    image:    s.coverImage || undefined,
    href:     `/stories/${s.slug}`,
  }))
}

export async function getRankings() {
  const [mostRead, topRated, newTrending] = await Promise.all([
    prisma.story.findMany({ include: { category: true }, orderBy: { ratingAvg: "desc" }, take: 6 }),
    prisma.story.findMany({ include: { category: true }, orderBy: { ratingCount: "desc" }, take: 6 }),
    prisma.story.findMany({ include: { category: true }, orderBy: { id: "desc" },          take: 6 }),
  ])
  const map = (s: Story & { category: Category }) => ({
    title: s.title,
    genre: s.category.name,
    href:  `/stories/${s.slug}`,
    bg:    s.coverBg,
    emoji: s.coverEmoji,
    views: s.viewCount,
  })
  return {
    mostRead:    (mostRead    as (Story & { category: Category })[]).map(map),
    topRated:    (topRated    as (Story & { category: Category })[]).map(map),
    newTrending: (newTrending as (Story & { category: Category })[]).map(map),
  }
}

export async function getEditorsPicks() {
  const stories = await prisma.story.findMany({
    where: { isFeatured: true },
    include: { category: true },
    take: 5,
  })
  return stories.map((s: Story & { category: Category }) => ({
    title: s.title,
    meta: `${s.author} · ${s.category.name}${s.chapterCount ? ` · ${s.chapterCount}ch` : ""}`,
    cover: { bg: s.coverBg, emoji: s.coverEmoji, image: s.coverImage || undefined },
    href:  `/stories/${s.slug}`,
    badge: undefined as undefined | { label: string; type: "hot" | "full" | "new" },
  }))
}

export async function getUpdatedList() {
  // Get 10 stories ordered by their most recently published chapter
  type Row = { story_id: number; chapter_no: number; chapter_title: string; published_at: Date }
  const rows = await prisma.$queryRaw<Row[]>`
    SELECT DISTINCT ON (c.story_id)
      c.story_id, c.chapter_no, c.title AS chapter_title, c.published_at
    FROM chapter c
    ORDER BY c.story_id, c.published_at DESC
  `
  rows.sort((a, b) => b.published_at.getTime() - a.published_at.getTime())
  const top = rows.slice(0, 10)

  const storyIds = top.map(r => r.story_id)
  const stories = await prisma.story.findMany({ where: { id: { in: storyIds } } })
  const storyMap = new Map((stories as Story[]).map(s => [s.id, s]))

  return top
    .map(row => {
      const s = storyMap.get(row.story_id)
      if (!s) return null
      const diffMs  = Date.now() - row.published_at.getTime()
      const diffMin = Math.floor(diffMs / 60000)
      const time    = diffMin < 60   ? `${diffMin} phút`
                    : diffMin < 1440 ? `${Math.floor(diffMin / 60)} giờ`
                    : `${Math.floor(diffMin / 1440)} ngày trước`
      return {
        title:         s.title,
        latestChapter: `Ch.${row.chapter_no}`,
        latestTitle:   row.chapter_title,
        time,
        cover: { bg: s.coverBg, emoji: s.coverEmoji, image: s.coverImage || undefined },
        isNew:  diffMin < 1440,
        href:   `/stories/${s.slug}`,
      }
    })
    .filter(Boolean)
}

export async function getCompletedList() {
  const stories = await prisma.story.findMany({
    where:   { status: "COMPLETED" },
    include: { category: true },
    take:    10,
    orderBy: { id: "desc" },
  })
  return (stories as (Story & { category: Category })[]).map(s => ({
    title:     s.title,
    genreInfo: `${s.category.name}${s.chapterCount ? ` · ${s.chapterCount}ch` : ""}`,
    cover: { bg: s.coverBg, emoji: s.coverEmoji, image: s.coverImage || undefined },
    href:  `/stories/${s.slug}`,
  }))
}

export async function getRecommendations() {
  const stories = await prisma.story.findMany({
    include: { tags: true, category: true },
    take: 10,
  })
  return stories.map((s: Story & { tags: StoryTag[]; category: Category }) => ({
    title: s.title,
    tags: s.tags.map((t: StoryTag) => ({ label: t.label, highlight: false })),
    desc: s.synopsis,
    author: s.author,
    authorHref: s.authorId ? `/authors/${s.authorId}` : undefined,
    chapters: s.chapterCount ? `${s.chapterCount} ch.` : "",
    views: s.viewCount ? `${s.viewCount} đọc` : "",
    cover: { bg: s.coverBg, emoji: s.coverEmoji, image: s.coverImage || undefined },
    href: `/stories/${s.slug}`,
  }))
}

export async function getCategories() {
  const rows = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } })
  return rows.map((r: Category) => ({ icon: r.icon, name: r.name, slug: r.slug, count: r.count }))
}

export async function getSidebarTopMonth() {
  const stories = await prisma.story.findMany({
    orderBy: { chapterCount: "desc" },
    take: 5,
  })
  return (stories as Story[]).map((s, i) => ({
    rank:  i + 1,
    title: s.title,
    sub:   s.chapterCount ? `${s.chapterCount} chương` : "",
    cover: { bg: s.coverBg, emoji: s.coverEmoji, image: s.coverImage || undefined },
    href:  `/stories/${s.slug}`,
  }))
}

export async function getFeaturedAuthors() {
  // Join featured_author with author table by penname to get real IDs for linking
  const rows = await prisma.featuredAuthor.findMany({ orderBy: { rank: "asc" } })
  const names = rows.map((r: FeaturedAuthor) => r.name)
  const authors = await prisma.author.findMany({
    where: { penname: { in: names } },
    select: { id: true, penname: true },
  })
  const idByName = new Map(authors.map(a => [a.penname, a.id]))

  return rows.map((r: FeaturedAuthor) => {
    const authorId = idByName.get(r.name)
    return {
      rank: r.rank,
      name: r.name,
      sub: r.sub,
      cover: { bg: r.coverBg },
      href: authorId ? `/authors/${authorId}` : undefined,
    }
  })
}
