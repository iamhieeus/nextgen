import { notFound } from "next/navigation"
import { getChapter } from "@/services/chapter.service"
import { getStoryVolumes } from "@/services/story.service"
import ChapterClient from "./ChapterClient"

export default async function ChapterPage({ params }: { params: Promise<{ storyId: string; chapterId: string }> }) {
  const { storyId, chapterId } = await params
  const chNo = parseInt(chapterId, 10)
  if (isNaN(chNo)) notFound()

  const [chapter, { volumes }] = await Promise.all([
    getChapter(storyId, chNo),
    getStoryVolumes(storyId),
  ])

  if (!chapter) notFound()

  const chapterList = volumes.flatMap(v =>
    v.chapters.map(c => ({
      no: parseInt(c.no.replace("Ch.", ""), 10),
      name: c.title,
      locked: !c.free,
    }))
  )

  return <ChapterClient chapter={chapter} storySlug={storyId} chapterList={chapterList} />
}
