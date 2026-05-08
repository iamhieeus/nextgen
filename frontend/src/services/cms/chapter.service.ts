import { prisma as db } from "@/lib/prisma"

export async function listChapters(storyId: number) {
  return db.chapter.findMany({
    where: { storyId },
    select: {
      id: true,
      chapterNo: true,
      title: true,
      wordCount: true,
      isFree: true,
      isPublished: true,
      viewCount: true,
      publishedAt: true,
      volumeId: true,
      volume: { select: { id: true, name: true } },
      _count: { select: { paragraphs: true, comments: true } },
    },
    orderBy: { chapterNo: "asc" },
  })
}

export async function getChapter(id: number) {
  return db.chapter.findUnique({
    where: { id },
    include: {
      paragraphs: { orderBy: { sortOrder: "asc" } },
    },
  })
}

export type ChapterInput = {
  storyId: number
  volumeId?: number | null
  chapterNo: number
  title: string
  wordCount?: string
  isFree?: boolean
  isPublished?: boolean
}

export type ParagraphInput = {
  sortOrder: number
  type?: string
  text: string
}

export async function createChapter(data: ChapterInput, paragraphs: ParagraphInput[] = []) {
  const [chapter] = await db.$transaction([
    db.chapter.create({
      data: {
        ...data,
        paragraphs: paragraphs.length
          ? { create: paragraphs }
          : undefined,
      },
      include: { paragraphs: { orderBy: { sortOrder: "asc" } } },
    }),
    db.story.update({
      where: { id: data.storyId },
      data:  { chapterCount: { increment: 1 } },
    }),
  ])
  return chapter
}

export async function updateChapter(
  id: number,
  data: Partial<Omit<ChapterInput, "storyId">>,
  paragraphs?: ParagraphInput[],
) {
  if (paragraphs !== undefined) {
    // Replace all paragraphs atomically
    await db.chapterParagraph.deleteMany({ where: { chapterId: id } })
    await db.chapterParagraph.createMany({
      data: paragraphs.map(p => ({ ...p, chapterId: id })),
    })
  }
  return db.chapter.update({
    where: { id },
    data,
    include: { paragraphs: { orderBy: { sortOrder: "asc" } } },
  })
}

export async function deleteChapter(id: number) {
  const chapter = await db.chapter.findUnique({ where: { id }, select: { storyId: true } })
  await db.$transaction([
    db.chapter.delete({ where: { id } }),
    ...(chapter
      ? [db.story.update({
          where: { id: chapter.storyId },
          data:  { chapterCount: { decrement: 1 } },
        })]
      : []),
  ])
}
