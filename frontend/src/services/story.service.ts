import type {
  Story, Category, StoryTag, Volume, Chapter, Comment,
  Rating, StoryRanking,
} from "@/generated/prisma"
import { prisma } from "@/lib/prisma"

export async function getStoryDetail(_storyId: string) {
  const [story, firstChapter, lastChapter, chapterWords] = await Promise.all([
    prisma.story.findUnique({
      where: { slug: _storyId },
      include: {
        category: true,
        tags: true,
        storyRankings: true,
        _count: { select: { chapters: true } },
      },
    }),
    prisma.chapter.findFirst({
      where: { story: { slug: _storyId } },
      orderBy: { chapterNo: "asc" },
      select: { chapterNo: true },
    }),
    prisma.chapter.findFirst({
      where: { story: { slug: _storyId } },
      orderBy: { chapterNo: "desc" },
      select: { chapterNo: true, publishedAt: true },
    }),
    prisma.chapter.findMany({
      where: { story: { slug: _storyId } },
      select: { wordCount: true },
    }),
  ])
  if (!story) return null

  const totalWords = chapterWords.reduce((sum, c) => sum + (parseInt(c.wordCount) || 0), 0)
  const wordCountFormatted = totalWords === 0 ? "" : totalWords >= 1000
    ? `${(totalWords / 1000).toFixed(1).replace(/\.0$/, "")}K`
    : String(totalWords)

  const s = story as Story & {
    category: Category
    tags: StoryTag[]
    storyRankings: StoryRanking[]
    _count: { chapters: number }
  }

  // Fetch all categories from junction table (in addition to primary)
  const junctionCategories = await prisma.$queryRaw<{ name: string; slug: string }[]>`
    SELECT c.name, c.slug
    FROM story_category sc
    JOIN category c ON c.id = sc.category_id
    WHERE sc.story_id = ${s.id}
    ORDER BY c.sort_order ASC
  `
  // Merge primary category + junction categories, deduplicated
  const allGenres = [s.category.name, ...junctionCategories.map(c => c.name)]
    .filter((name, i, arr) => arr.indexOf(name) === i)

  return {
    slug: s.slug,
    title: s.title,
    author: s.author,
    authorId: s.authorId,
    genres: allGenres,
    status: s.status === "COMPLETED" ? ("completed" as const) : ("ongoing" as const),
    rating: s.ratingAvg,
    ratingCount: s.ratingCount,
    views: s.viewCount,
    bookmarks: s.bookmarkCount,
    chapterCount: s._count.chapters,
    wordCount: wordCountFormatted,
    updateSchedule: s.updateSchedule,
    cover: { bg: s.coverBg, emoji: s.coverEmoji, image: s.coverImage || undefined },
    synopsis: s.synopsis,
    introFull: [s.synopsis],
    tags: s.tags.map((t: StoryTag) => t.label),
    firstChapterNo: firstChapter?.chapterNo ?? null,
    lastChapterNo:  lastChapter?.chapterNo  ?? null,
    lastUpdatedAt:  lastChapter?.publishedAt ? formatDateTime(lastChapter.publishedAt) : null,
    breadcrumb: [
      { label: "Trang chủ", href: "/" },
      { label: s.category.name, href: "#" },
    ],
  }
}

export async function getStoryVolumes(_storyId: string, page = 1, pageSize = 0) {
  const story = await prisma.story.findUnique({
    where: { slug: _storyId },
    select: { id: true },
  })
  if (!story) return { volumes: [], totalChapters: 0 }

  type ChapterRow = Pick<Chapter, "chapterNo" | "title" | "isFree" | "publishedAt"> & { volumeId: number | null }

  const chapterQuery: Parameters<typeof prisma.chapter.findMany>[0] = {
    where: { storyId: story.id },
    orderBy: { chapterNo: "asc" },
    select: { chapterNo: true, title: true, isFree: true, publishedAt: true, volumeId: true },
  }
  if (pageSize > 0) {
    chapterQuery.skip = (page - 1) * pageSize
    chapterQuery.take = pageSize
  }

  const [totalChapters, allVolumes, pageChapters] = await Promise.all([
    prisma.chapter.count({ where: { storyId: story.id } }),
    prisma.volume.findMany({
      where: { storyId: story.id },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, range: true, defaultOpen: true },
    }),
    prisma.chapter.findMany(chapterQuery),
  ])

  const mapChapter = (c: ChapterRow) => ({
    no:    `Ch.${c.chapterNo}`,
    title: c.title,
    date:  formatRelativeDate(c.publishedAt),
    free:  c.isFree,
  })

  // Group page's chapters by volume
  const volMap = new Map(allVolumes.map(v => [v.id, { ...v, chapters: [] as ReturnType<typeof mapChapter>[] }]))
  const ungrouped: ReturnType<typeof mapChapter>[] = []

  for (const ch of pageChapters as ChapterRow[]) {
    const item = mapChapter(ch)
    if (ch.volumeId !== null && volMap.has(ch.volumeId)) {
      volMap.get(ch.volumeId)!.chapters.push(item)
    } else {
      ungrouped.push(item)
    }
  }

  const volumes = allVolumes
    .map(v => ({ name: v.name, range: v.range, defaultOpen: v.defaultOpen, chapters: volMap.get(v.id)!.chapters }))
    .filter(v => v.chapters.length > 0)

  if (ungrouped.length > 0) {
    volumes.push({ name: "Danh sách chương", range: "", defaultOpen: true, chapters: ungrouped })
  }

  return { volumes, totalChapters }
}

export async function getStoryRatingBars(_storyId: string) {
  const ratings = await prisma.rating.findMany({
    where: { story: { slug: _storyId } },
    orderBy: { id: "desc" },
  })
  return (ratings as Rating[]).map((r) => ({ star: r.star, pct: r.pct, count: r.count }))
}

export async function getStoryComments(_storyId: string) {
  const comments = await prisma.comment.findMany({
    where: { story: { slug: _storyId }, chapterId: null },
    orderBy: { createdAt: "desc" },
    take: 20,
  })
  return (comments as Comment[]).map((c) => ({
    initial: c.initial,
    avatarBg: c.avatarBg,
    name: c.name,
    badge: c.badge ?? undefined,
    time: formatRelativeDate(c.createdAt),
    text: c.text,
    likes: c.likes,
    replies: c.replies,
    liked: c.liked,
  }))
}

export async function getSimilarStories(_storyId: string) {
  // Load the source story with its category and tags
  const source = await prisma.story.findUnique({
    where: { slug: _storyId },
    select: { id: true, categoryId: true, tags: { select: { label: true } } },
  })
  if (!source) return []

  const sourceLabels = new Set(source.tags.map((t: { label: string }) => t.label))

  // Candidates: same category, exclude self
  const candidates = await prisma.story.findMany({
    where: { categoryId: source.categoryId, id: { not: source.id } },
    include: { category: true, tags: { select: { label: true } } },
  })

  type Candidate = Story & {
    category: Category
    tags: { label: string }[]
  }

  // Score: shared tags count (primary) + ratingAvg (tiebreak)
  const scored = (candidates as Candidate[]).map(s => ({
    story:      s,
    sharedTags: s.tags.filter(t => sourceLabels.has(t.label)).length,
  }))

  scored.sort((a, b) =>
    b.sharedTags  !== a.sharedTags  ? b.sharedTags  - a.sharedTags :
    b.story.ratingAvg - a.story.ratingAvg
  )

  return scored.slice(0, 5).map(({ story: s }) => ({
    title:    s.title,
    genre:    s.category.name,
    chapters: s.chapterCount ? `${s.chapterCount} ch` : "",
    views:    s.viewCount,
    cover:    { bg: s.coverBg, emoji: s.coverEmoji, image: s.coverImage || undefined },
    href:     `/stories/${s.slug}`,
  }))
}

export async function getStoryRankings(_storyId: string) {
  const rows = await prisma.storyRanking.findMany({
    where: { story: { slug: _storyId } },
  })
  return (rows as StoryRanking[]).map((r) => ({
    label: r.label,
    rank: r.rank,
    icon: r.icon,
    rankClass: r.rankClass,
  }))
}

function formatDateTime(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0")
  const m = (date.getMonth() + 1).toString().padStart(2, "0")
  const y = date.getFullYear()
  return `${d}/${m}/${y}`
}

function formatRelativeDate(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 60) return `${diffMin} phút`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH} giờ`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 30) return `${diffD} ngày trước`
  const diffM = Math.floor(diffD / 30)
  if (diffM < 12) return `${diffM} tháng trước`
  return `${Math.floor(diffM / 12)} năm trước`
}
