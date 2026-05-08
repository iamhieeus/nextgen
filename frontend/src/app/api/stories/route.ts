import { NextRequest } from "next/server"
import { getRecommendations, getHotList } from "@/services/home.service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const genre = searchParams.get("genre")
    const sort = searchParams.get("sort") ?? "views"
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)))

    const [recommendations, hotList] = await Promise.all([
      getRecommendations(),
      getHotList(),
    ])

    // Merge and normalise into a common shape
    type StoryListItem = {
      title: string
      genres: string
      chapters: string
      views: string
      cover: { bg: string; emoji: string }
    }

    let stories: StoryListItem[] = [
      ...recommendations.map((s) => ({
        title: s.title,
        genres: s.tags.map((t) => t.label).join(" · "),
        chapters: s.chapters,
        views: s.views,
        cover: s.cover,
      })),
      ...hotList.map((s) => ({
        title: s.title,
        genres: s.genres,
        chapters: s.chapters,
        views: "",
        cover: { bg: s.bg, emoji: s.emoji },
      })),
    ]

    // Deduplicate by title
    const seen = new Set<string>()
    stories = stories.filter((s) => {
      if (seen.has(s.title)) return false
      seen.add(s.title)
      return true
    })

    // Filter by genre
    if (genre) {
      stories = stories.filter((s) =>
        s.genres.toLowerCase().includes(genre.toLowerCase())
      )
    }

    // Sort
    if (sort === "chapters") {
      stories = stories.sort((a, b) => {
        const parse = (v: string) => parseInt(v.replace(/\D/g, ""), 10) || 0
        return parse(b.chapters) - parse(a.chapters)
      })
    }

    // Paginate
    const total = stories.length
    const start = (page - 1) * limit
    const data = stories.slice(start, start + limit)

    return Response.json({
      stories: data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch {
    return Response.json({ error: "Failed to fetch stories" }, { status: 500 })
  }
}
