import { Suspense } from "react"
import FilterPanel from "@/components/search/FilterPanel"
import SortBar from "@/components/search/SortBar"
import SearchResultList from "@/components/search/SearchResultList"
import Pagination from "@/components/search/Pagination"
import SearchSidebar from "@/components/search/SearchSidebar"
import {
  searchStories,
  getSearchSidebar,
  getSearchCategories,
} from "@/services/search.service"

const PAGE_SIZE = 8

type SearchPageProps = {
  searchParams: Promise<{
    q?: string
    category?: string
    status?: string
    sort?: string
    page?: string
  }>
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  return {
    title: q ? `Tìm kiếm "${q}" – Cấm Địa` : "Tìm kiếm truyện – Cấm Địa",
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, category, status, sort = "relevant", page = "1" } = await searchParams
  const currentPage = Math.max(1, parseInt(page, 10) || 1)

  const [{ results, total }, sidebarData, categories] = await Promise.all([
    searchStories({
      q,
      categorySlug: category,
      status,
      sort,
      page: currentPage,
      pageSize: PAGE_SIZE,
    }),
    getSearchSidebar(q),
    getSearchCategories(),
  ])

  return (
    <div className="max-w-[1200px] w-full mx-auto flex gap-3 items-start">

      {/* Left — filter panel (client, needs Suspense for useSearchParams) */}
      <Suspense fallback={<div className="w-[180px] flex-shrink-0 bg-white border border-[#e5e5e5] h-[300px]" />}>
        <FilterPanel categories={categories} />
      </Suspense>

      {/* Center — sort + results + pagination */}
      <div className="flex-1 min-w-0">
        <Suspense fallback={<SortBarSkeleton />}>
          <SortBar q={q} total={total} />
        </Suspense>

        <SearchResultList items={results} />

        <Suspense fallback={null}>
          <Pagination total={total} page={currentPage} pageSize={PAGE_SIZE} />
        </Suspense>
      </div>

      {/* Right — sidebar */}
      <SearchSidebar data={sidebarData} />

    </div>
  )
}

function SortBarSkeleton() {
  return (
    <div className="bg-white border border-[#e5e5e5] px-[14px] py-[10px] mb-2 h-[42px] animate-pulse" />
  )
}
