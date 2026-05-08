import { NextRequest } from "next/server"
import { searchStories, getSearchCategories } from "@/services/search.service"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const q = searchParams.get("q") ?? undefined
  const categorySlug = searchParams.get("categorySlug") ?? undefined
  const status = searchParams.get("status") ?? undefined
  const sort = searchParams.get("sort") ?? undefined
  const page = parseInt(searchParams.get("page") ?? "1", 10)
  const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10)

  const [{ results, total }, categories] = await Promise.all([
    searchStories({ q, categorySlug, status, sort, page, pageSize }),
    getSearchCategories(),
  ])
  return Response.json({ results, total, categories })
}
