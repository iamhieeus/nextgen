import HeroSlider from "@/components/home/HeroSlider"
import HotList from "@/components/home/HotList"
import FreeBanner from "@/components/home/FreeBanner"
import RankingPanel from "@/components/home/RankingPanel"
import EditorsPicks from "@/components/home/EditorsPicks"
import UpdatedList from "@/components/home/UpdatedList"
import CompletedList from "@/components/home/CompletedList"
import Recommendations from "@/components/home/Recommendations"
import CategoryGrid from "@/components/home/CategoryGrid"
import Sidebar from "@/components/home/Sidebar"
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

export default async function HomePage() {
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

  return (
    <div className="max-w-[1200px] w-full mx-auto grid grid-cols-[1fr_252px] gap-[14px] items-start">

      {/* Main content */}
      <div className="min-w-0 flex flex-col gap-3 overflow-hidden">

        {/* Hero slider + Hot list */}
        <div className="flex gap-3 items-stretch">
          <HeroSlider slides={slides} />
          <HotList hotList={hotList} />
        </div>

        <FreeBanner />
        <RankingPanel rankings={rankings} />
        <EditorsPicks editorsPicks={editorsPicks} />

        {/* Recently updated + Completed */}
        <div className="grid grid-cols-2 gap-3">
          <UpdatedList updatedList={updatedList.filter(Boolean) as NonNullable<typeof updatedList[0]>[]} />
          <CompletedList completedList={completedList} />
        </div>

        <Recommendations recommendations={recommendations} />
        <CategoryGrid categories={categories} />

      </div>

      {/* Sidebar */}
      <Sidebar sidebarTopMonth={sidebarTopMonth} featuredAuthors={featuredAuthors} />

    </div>
  )
}
