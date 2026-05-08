"use server"

import { prisma } from "@/lib/prisma"

export async function findChapter(
  storySlug: string,
  chapterNo: number,
): Promise<{ path: string } | null> {
  const chapter = await prisma.chapter.findFirst({
    where: { story: { slug: storySlug }, chapterNo },
    select: { chapterNo: true },
  })
  if (!chapter) return null
  return { path: `/stories/${storySlug}/chapters/${chapterNo}` }
}
