import {
  getSlides,
  getHotList,
  getRankings,
  getEditorsPicks,
  getUpdatedList,
  getCompletedList,
  getRecommendations,
  getCategories,
  getSidebarTopMonth,
  getFeaturedAuthors,
} from "@/services/home.service"

export async function GET() {
  try {
    const [
      slides,
      hotList,
      rankings,
      editorsPicks,
      updatedList,
      completedList,
      recommendations,
      categories,
      sidebarTopMonth,
      featuredAuthors,
    ] = await Promise.all([
      getSlides(),
      getHotList(),
      getRankings(),
      getEditorsPicks(),
      getUpdatedList(),
      getCompletedList(),
      getRecommendations(),
      getCategories(),
      getSidebarTopMonth(),
      getFeaturedAuthors(),
    ])

    return Response.json({
      slides,
      hotList,
      rankings,
      editorsPicks,
      updatedList,
      completedList,
      recommendations,
      categories,
      sidebarTopMonth,
      featuredAuthors,
    })
  } catch {
    return Response.json({ error: "Failed to fetch home data" }, { status: 500 })
  }
}
