import { notFound } from "next/navigation"
import { getStoryDetail, getStoryVolumes, getStoryComments, getSimilarStories } from "@/services/story.service"
import StoryClient from "./StoryClient"

export default async function StoryPage({ params }: { params: Promise<{ storyId: string }> }) {
  const { storyId } = await params

  const [story, { volumes, totalChapters }, comments, similar] = await Promise.all([
    getStoryDetail(storyId),
    getStoryVolumes(storyId, 1, 100),
    getStoryComments(storyId),
    getSimilarStories(storyId),
  ])

  if (!story) notFound()

  return (
    <StoryClient
      story={story}
      volumes={volumes}
      totalChapters={totalChapters}
      comments={comments}
      similar={similar}
    />
  )
}
