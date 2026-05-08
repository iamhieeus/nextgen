import { prisma as db } from "@/lib/prisma"
import type { Prisma, StoryStatus } from "@/generated/prisma"

export interface StoryFilter {
  search?: string
  status?: StoryStatus
  categoryId?: number
  authorId?: number
  page?: number
  pageSize?: number
}

export async function listStoriesCms(filter: StoryFilter = {}) {
  const { search, status, categoryId, authorId, page = 1, pageSize = 20 } = filter

  // Build WHERE clause fragments for raw SQL
  const conditions: string[] = []
  const params: (string | number)[] = []
  let p = 1
  if (search) {
    conditions.push(`(s.title ILIKE $${p} OR s.author ILIKE $${p})`)
    params.push(`%${search}%`); p++
  }
  if (status)     { conditions.push(`s.status = $${p}`);      params.push(status);     p++ }
  if (categoryId) { conditions.push(`s.category_id = $${p}`); params.push(categoryId); p++ }
  if (authorId)   { conditions.push(`s.author_id = $${p}`);   params.push(authorId);   p++ }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""

  // Get total count
  const countRows = await db.$queryRawUnsafe<{ count: bigint }[]>(
    `SELECT COUNT(*) AS count FROM story s ${where}`,
    ...params
  )
  const total = Number(countRows[0]?.count ?? 0)

  // Get story IDs ordered by latest chapter's published_at DESC (stories without chapters go last)
  const offset = (page - 1) * pageSize
  const idRows = await db.$queryRawUnsafe<{ id: number }[]>(
    `SELECT s.id
     FROM story s
     LEFT JOIN (
       SELECT story_id, MAX(published_at) AS last_published
       FROM chapter GROUP BY story_id
     ) lc ON lc.story_id = s.id
     ${where}
     ORDER BY lc.last_published DESC NULLS LAST, s.id DESC
     LIMIT $${p} OFFSET $${p + 1}`,
    ...params, pageSize, offset
  )
  const ids = idRows.map(r => r.id)

  const items = ids.length === 0 ? [] : await db.story.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      title: true,
      slug: true,
      author: true,
      status: true,
      isFeatured: true,
      viewCount: true,
      chapterCount: true,
      wordCount: true,
      ratingAvg: true,
      ratingCount: true,
      coverBg: true,
      coverEmoji: true,
      coverImage: true,
      category: { select: { id: true, name: true, slug: true } },
      authorRel: { select: { id: true, penname: true, initial: true, color: true } },
      _count: { select: { chapters: true, comments: true } },
    },
  }).then(rows => ids.map(id => rows.find(r => r.id === id)!).filter(Boolean))

  return { items, total, page, pageSize }
}

export async function getStoryCms(id: number) {
  return db.story.findUnique({
    where: { id },
    include: {
      category: true,
      authorRel: true,
      tags: true,
      volumes: { orderBy: { sortOrder: "asc" } },
      storyRankings: true,
    },
  })
}

export type StoryInput = {
  title: string
  slug: string
  author: string
  authorId?: number | null
  synopsis: string
  coverBg?: string
  coverEmoji?: string
  coverImage?: string
  status?: StoryStatus
  isFeatured?: boolean
  updateSchedule?: string
  categoryId: number
  categoryIds?: number[]   // all selected categories (first = primary)
  wordCount?: string
  tags?: string[]
}

/** Sync the story_category junction rows for a story. */
async function syncStoryCategories(storyId: number, categoryIds: number[]) {
  // Remove all existing rows for this story then insert the new set
  await db.$executeRaw`DELETE FROM story_category WHERE story_id = ${storyId}`
  if (categoryIds.length > 0) {
    // Build multi-row INSERT … ON CONFLICT DO NOTHING
    for (const catId of categoryIds) {
      await db.$executeRaw`
        INSERT INTO story_category (story_id, category_id)
        VALUES (${storyId}, ${catId})
        ON CONFLICT DO NOTHING
      `
    }
  }
}

/** Fetch the extra category IDs attached to a story via the junction table. */
async function fetchStoryCategoryIds(storyId: number): Promise<number[]> {
  const rows = await db.$queryRaw<{ category_id: number }[]>`
    SELECT category_id FROM story_category WHERE story_id = ${storyId}
  `
  return rows.map(r => r.category_id)
}

export async function createStoryCms({ tags, categoryIds, ...data }: StoryInput) {
  const story = await db.story.create({
    data: {
      ...data,
      tags: tags?.length ? { create: tags.map(label => ({ label })) } : undefined,
    },
  })
  // Sync junction table (use all provided ids, or fall back to primary categoryId)
  const ids = categoryIds?.length ? categoryIds : [data.categoryId]
  await syncStoryCategories(story.id, ids)
  return story
}

export async function updateStoryCms(id: number, { tags, categoryIds, ...data }: Partial<StoryInput>) {
  if (tags !== undefined) {
    await db.storyTag.deleteMany({ where: { storyId: id } })
    if (tags.length) {
      await db.storyTag.createMany({ data: tags.map(label => ({ storyId: id, label })) })
    }
  }
  // Sync junction table when categoryIds provided
  if (categoryIds !== undefined && categoryIds.length > 0) {
    await syncStoryCategories(id, categoryIds)
    // Keep categoryId in sync with the first (primary) selection
    data.categoryId = categoryIds[0]
  }
  return db.story.update({ where: { id }, data })
}

/** Extend getStoryCms to also return the extra category IDs. */
export async function getStoryCmsWithCategories(id: number) {
  const [story, categoryIds] = await Promise.all([
    getStoryCms(id),
    fetchStoryCategoryIds(id),
  ])
  return story ? { ...story, categoryIds } : null
}

export async function deleteStoryCms(id: number) {
  return db.story.delete({ where: { id } })
}

export async function getCmsStats() {
  const [storyCount, authorCount, categoryCount, chapterCount, commentCount] = await Promise.all([
    db.story.count(),
    db.author.count(),
    db.category.count(),
    db.chapter.count(),
    db.comment.count(),
  ])

  const recentStories = await db.story.findMany({
    take: 5,
    orderBy: { id: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      author: true,
      status: true,
      chapterCount: true,
      coverBg: true,
      coverEmoji: true,
      category: { select: { name: true } },
    },
  })

  return { storyCount, authorCount, categoryCount, chapterCount, commentCount, recentStories }
}
