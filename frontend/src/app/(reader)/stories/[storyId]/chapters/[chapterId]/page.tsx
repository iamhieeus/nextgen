import { notFound } from 'next/navigation'
import { getChapter } from '@/services/chapter.service'
import ChapterView from './ChapterView'

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ storyId: string; chapterId: string }>
}) {
  const { storyId, chapterId } = await params
  const chapterNo = parseInt(chapterId, 10)

  if (isNaN(chapterNo)) notFound()

  const chapter = await getChapter(storyId, chapterNo)
  if (!chapter) notFound()

  return <ChapterView chapter={chapter} storyId={storyId} />
}
