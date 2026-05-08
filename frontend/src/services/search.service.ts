import type { Category, Story, StoryTag } from "@/generated/prisma"
import { prisma } from "@/lib/prisma"

export type SearchResultItem = {
  title: string
  author: string
  category: string
  categorySlug: string
  status: string
  wordCount: string
  viewCount: string
  chapterCount: number
  bookmarkCount: string
  synopsis: string
  tags: string[]
  cover: { bg: string; emoji: string }
  href: string
  badge: "hot" | "new" | "full" | undefined
}

export type SearchSidebarData = {
  ranking: { title: string; viewCount: string; href: string }[]
  recommended: { title: string; author: string; category: string; cover: { bg: string; emoji: string }; href: string }[]
  relatedTags: string[]
}

type SearchParams = {
  q?: string
  categorySlug?: string
  status?: string
  sort?: string
  page?: number
  pageSize?: number
}

const STATUS_LABEL: Record<string, string> = {
  ONGOING:   "Đang ra",
  COMPLETED: "Hoàn thành",
  HIATUS:    "Tạm dừng",
  DROPPED:   "Drop",
}

function buildBadge(s: Story): SearchResultItem["badge"] {
  if (s.status === "COMPLETED") return "full"
  if (s.isFeatured) return "hot"
  return undefined
}

export async function searchStories(params: SearchParams) {
  const { q, categorySlug, status, sort = "relevant", page = 1, pageSize = 8 } = params

  // Build AND conditions array so each filter is independent
  const conditions: object[] = []

  if (q) {
    conditions.push({
      OR: [
        { title:    { contains: q, mode: "insensitive" as const } },
        { author:   { contains: q, mode: "insensitive" as const } },
        { synopsis: { contains: q, mode: "insensitive" as const } },
      ],
    })
  }

  if (categorySlug) {
    // Find the category by slug first
    const cat = await prisma.category.findFirst({ where: { slug: categorySlug }, select: { id: true } })
    if (cat) {
      // Also look up story IDs from the junction table (many-to-many)
      const junctionRows = await prisma.$queryRaw<{ story_id: number }[]>`
        SELECT story_id FROM story_category WHERE category_id = ${cat.id}
      `
      const extraIds = junctionRows.map(r => r.story_id)
      conditions.push({
        OR: [
          { categoryId: cat.id },
          ...(extraIds.length ? [{ id: { in: extraIds } }] : []),
        ],
      })
    } else {
      // Unknown slug — no results
      conditions.push({ id: -1 })
    }
  }

  if (status) {
    conditions.push({ status: status as Story["status"] })
  }

  const where = conditions.length ? { AND: conditions } : {}

  const orderBy =
    sort === "new"    ? { id:          "desc" as const } :
    sort === "rating" ? { ratingAvg:   "desc" as const } :
    sort === "votes"  ? { ratingCount: "desc" as const } :
                        { ratingAvg:   "desc" as const }   // default: relevant

  const [stories, total] = await Promise.all([
    prisma.story.findMany({
      where,
      include: { category: true, tags: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.story.count({ where }),
  ])

  const results: SearchResultItem[] = (
    stories as (Story & { category: Category; tags: StoryTag[] })[]
  ).map((s) => ({
    title:        s.title,
    author:       s.author,
    category:     s.category.name,
    categorySlug: s.category.slug,
    status:       STATUS_LABEL[s.status] ?? s.status,
    wordCount:    s.wordCount,
    viewCount:    s.viewCount,
    chapterCount: s.chapterCount,
    bookmarkCount: s.bookmarkCount,
    synopsis:     s.synopsis,
    tags:         s.tags.map((t) => t.label),
    cover:        { bg: s.coverBg, emoji: s.coverEmoji, image: s.coverImage || undefined },
    href:         `/stories/${s.slug}`,
    badge:        buildBadge(s),
  }))

  return { results, total }
}

export async function getSearchSidebar(q?: string): Promise<SearchSidebarData> {
  const [rankingStories, recommended, categories] = await Promise.all([
    // Top 10 by rating for ranking panel
    prisma.story.findMany({
      orderBy: { ratingAvg: "desc" },
      take: 10,
      select: { title: true, slug: true, viewCount: true },
    }),
    // Featured stories for recommendations
    prisma.story.findMany({
      where: { isFeatured: true },
      include: { category: true },
      take: 4,
      orderBy: { ratingAvg: "desc" },
    }),
    // Category names as related tags
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      take: 12,
      select: { name: true },
    }),
  ])

  return {
    ranking: rankingStories.map((s) => ({
      title:     s.title,
      viewCount: s.viewCount,
      href:      `/stories/${s.slug}`,
    })),
    recommended: (
      recommended as (Story & { category: Category })[]
    ).map((s) => ({
      title:    s.title,
      author:   s.author,
      category: s.category.name,
      cover:    { bg: s.coverBg, emoji: s.coverEmoji, image: s.coverImage || undefined },
      href:     `/stories/${s.slug}`,
    })),
    relatedTags: [
      ...(q ? [q] : []),
      ...categories.map((c) => c.name),
    ].filter((tag, i, arr) => arr.indexOf(tag) === i).slice(0, 12),
  }
}

export async function getSearchCategories() {
  const rows = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } })
  return rows.map((r: Category) => ({ name: r.name, slug: r.slug }))
}
