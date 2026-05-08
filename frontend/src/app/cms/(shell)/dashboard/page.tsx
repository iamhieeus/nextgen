import DashboardStats       from "@/components/cms/dashboard/DashboardStats"
import RecentStoriesWidget  from "@/components/cms/dashboard/RecentStoriesWidget"

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">Dashboard</h1>
          <p className="text-[12.5px] text-[#888] mt-0.5">Tổng quan hệ thống</p>
        </div>
      </div>
      <DashboardStats />
      <RecentStoriesWidget />
    </>
  )
}
