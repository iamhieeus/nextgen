import { notFound } from "next/navigation"
import Link from "next/link"
import ChapterForm, { type ChapterData } from "@/components/cms/chapters/ChapterForm"
import { getChapter } from "@/services/cms/chapter.service"
import { getStoryCms } from "@/services/cms/story.service"

interface Props {
  params: Promise<{ id: string; chapterId: string }>
}

export default async function EditChapterPage({ params }: Props) {
  const { id, chapterId } = await params
  const storyId = Number(id)

  const [raw, story] = await Promise.all([
    getChapter(Number(chapterId)),
    getStoryCms(storyId),
  ])

  if (!raw) notFound()

  const chapter: ChapterData = {
    id:          raw.id,
    chapterNo:   raw.chapterNo,
    title:       raw.title,
    volumeId:    raw.volumeId,
    isFree:      raw.isFree,
    isPublished: raw.isPublished,
    publishedAt: raw.publishedAt?.toISOString() ?? null,
    paragraphs:  raw.paragraphs.map(p => ({
      sortOrder: p.sortOrder,
      type:      p.type,
      text:      p.text,
    })),
  }

  return (
    <>
      <Link
        href={`/cms/stories/${storyId}/chapters`}
        className="inline-flex items-center gap-1.5 text-[13px] text-[#888] mb-4 hover:text-[#e5353e] transition-colors"
      >
        ← Quay lại danh sách chương
      </Link>

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">
            Chỉnh sửa Chương {raw.chapterNo}
          </h1>
          <p className="text-[12.5px] text-[#888] mt-0.5">{story?.title ?? "Truyện"}</p>
        </div>
      </div>

      <ChapterForm
        storyId={storyId}
        storyTitle={story?.title ?? ""}
        chapter={chapter}
        volumes={story?.volumes ?? []}
      />
    </>
  )
}
