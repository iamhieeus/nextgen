import { NextRequest } from "next/server"
import {
  getStoryDetail,
  getStoryVolumes,
  getStoryRatingBars,
  getStoryComments,
  getSimilarStories,
  getStoryRankings,
} from "@/services/story.service"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ storyId: string }> }
) {
  try {
    const { storyId } = await params

    const [detail, volumes, ratingBars, comments, similarStories, storyRankings] =
      await Promise.all([
        getStoryDetail(storyId),
        getStoryVolumes(storyId),
        getStoryRatingBars(storyId),
        getStoryComments(storyId),
        getSimilarStories(storyId),
        getStoryRankings(storyId),
      ])

    return Response.json({ detail, volumes, ratingBars, comments, similarStories, storyRankings })
  } catch {
    return Response.json({ error: "Failed to fetch story" }, { status: 500 })
  }
}
