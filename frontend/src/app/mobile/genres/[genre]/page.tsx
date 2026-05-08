export const dynamic = 'force-dynamic'

import { getCategories } from "@/services/home.service"
import { searchStories } from "@/services/search.service"
import GenreClient from "./GenreClient"

export default async function GenrePage({ params }: { params: Promise<{ genre: string }> }) {
  const { genre } = await params
  const genreName = decodeURIComponent(genre)

  const categories = await getCategories()
  const cat = categories.find(c => c.name === genreName)

  const { results, total } = await searchStories({
    categorySlug: cat?.slug,
    sort: "relevant",
    pageSize: 20,
  })

  const featured = results[0] ?? null

  return (
    <GenreClient
      genreName={genreName}
      categories={categories}
      books={results}
      total={total}
      featured={featured}
    />
  )
}
