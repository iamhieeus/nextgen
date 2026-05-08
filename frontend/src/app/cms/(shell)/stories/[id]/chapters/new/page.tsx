import Link from "next/link"
import ChapterForm from "@/components/cms/chapters/ChapterForm"
import { getStoryCms } from "@/services/cms/story.service"

interface Props {
  params: Promise<{ id: string }>
}

export default async function NewChapterPage({ params }: Props) {
  const { id } = await params
  const storyId = Number(id)
  const story   = await getStoryCms(storyId)

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
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">Thêm chương mới</h1>
          <p className="text-[12.5px] text-[#888] mt-0.5">{story?.title ?? "Truyện"}</p>
        </div>
      </div>

      <ChapterForm
        storyId={storyId}
        storyTitle={story?.title ?? ""}
        volumes={story?.volumes ?? []}
      />
    </>
  )
}
