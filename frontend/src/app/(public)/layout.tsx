export const dynamic = 'force-dynamic'

import { Suspense } from "react"
import TopBar from "@/components/layout/TopBar"
import SiteHeader from "@/components/layout/SiteHeader"
import GenreNav from "@/components/layout/GenreNav"
import SiteFooter from "@/components/layout/SiteFooter"
import Toast from "@/components/ui/Toast"
import { getCategories } from "@/services/home.service"

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-site text-[#333] flex flex-col">
      <TopBar />
      <SiteHeader />
      <Suspense fallback={<div className="bg-nav h-[38px]" />}>
        <GenreNav categories={categories} />
      </Suspense>
      <main className="py-3 pb-7 flex-1">{children}</main>
      <SiteFooter />
      <Toast />
    </div>
  )
}
