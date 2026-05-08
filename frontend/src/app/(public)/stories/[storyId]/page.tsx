import { notFound } from "next/navigation"
import Breadcrumb from "@/components/story/Breadcrumb"
import BookHeader from "@/components/story/BookHeader"
import StoryTabsPanel from "@/components/story/StoryTabsPanel"
import StorySidebar from "@/components/story/StorySidebar"
import {
  getStoryDetail,
  getStoryVolumes,
  getStoryRatingBars,
  getStoryComments,
  getSimilarStories,
  getStoryRankings,
} from "@/services/story.service"

const CHAPTER_PAGE_SIZE = 100

export default async function StoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ storyId: string }>
  searchParams: Promise<{ chapterPage?: string }>
}) {
  const { storyId } = await params
  const sp = await searchParams
  const chapterPage = Math.max(1, parseInt(sp.chapterPage ?? "1") || 1)

  const [detail, volumesData, ratingBars, comments, similarStories, storyRankings] =
    await Promise.all([
      getStoryDetail(storyId),
      getStoryVolumes(storyId, chapterPage, CHAPTER_PAGE_SIZE),
      getStoryRatingBars(storyId),
      getStoryComments(storyId),
      getSimilarStories(storyId),
      getStoryRankings(storyId),
    ])

  if (!detail) notFound()

  return (
    <>
      <Breadcrumb items={detail.breadcrumb} current={detail.title} />

      <div className="max-w-[1200px] w-full mx-auto grid grid-cols-[1fr_252px] gap-[14px] items-start pt-[14px]">
        {/* Main content */}
        <div className="min-w-0 flex flex-col gap-3">
          <div className="bg-white border border-[#e5e5e5]">
            <BookHeader s={detail} />
            <StoryTabsPanel
              storySlug={detail.slug}
              chapterCount={detail.chapterCount}
              lastUpdatedAt={detail.lastUpdatedAt}
              introFull={detail.introFull}
              rating={detail.rating}
              ratingCount={detail.ratingCount}
              volumes={volumesData.volumes}
              ratingBars={ratingBars}
              comments={comments}
              chapterPage={chapterPage}
              chapterPageSize={CHAPTER_PAGE_SIZE}
            />
          </div>
        </div>

        {/* Sidebar */}
        <StorySidebar
          author={detail.author}
          authorId={detail.authorId}
          tags={detail.tags}
          similarStories={similarStories}
          storyRankings={storyRankings}
        />
      </div>
    </>
  )
}
