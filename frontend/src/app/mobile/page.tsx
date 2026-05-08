import { getSlides, getHotList, getUpdatedList, getRecommendations, getCategories, getRankings } from "@/services/home.service"
import MobileHomeClient from "./MobileHomeClient"

const mh = (href: string) => `/mobile${href}`

export default async function MobileHomePage() {
  const [slides, hotList, updates, recommendations, categories, rankings] = await Promise.all([
    getSlides(),
    getHotList(),
    getUpdatedList(),
    getRecommendations(),
    getCategories(),
    getRankings(),
  ])

  return (
    <MobileHomeClient
      slides={slides.map(s => ({ ...s, href: `/mobile/search?q=${encodeURIComponent(s.title)}` }))}
      hotBooks={hotList.map(h => ({ ...h, href: mh(h.href) }))}
      updates={(updates.filter(Boolean) as NonNullable<typeof updates[0]>[]).map(u => ({ ...u, href: mh(u.href) }))}
      recommendations={recommendations.map(r => ({
        ...r,
        href: mh(r.href),
        authorHref: r.authorHref ? mh(r.authorHref) : undefined,
      }))}
      categories={categories}
      rankings={{
        mostRead:    rankings.mostRead.map(r    => ({ ...r, href: mh(r.href) })),
        topRated:    rankings.topRated.map(r    => ({ ...r, href: mh(r.href) })),
        newTrending: rankings.newTrending.map(r => ({ ...r, href: mh(r.href) })),
      }}
    />
  )
}
