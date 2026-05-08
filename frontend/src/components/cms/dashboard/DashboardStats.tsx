import StatCard from "@/components/cms/shared/StatCard"
import { getCmsStats } from "@/services/cms/story.service"

export default async function DashboardStats() {
  const stats = await getCmsStats()

  const cards = [
    { label: "Tổng truyện",  value: String(stats.storyCount),   sub: "truyện trong hệ thống",  icon: "📚", accent: "red"    as const, trend: "up" as const },
    { label: "Tổng chương",  value: String(stats.chapterCount), sub: "chương đã đăng",          icon: "📄", accent: "blue"   as const, trend: "up" as const },
    { label: "Tổng tác giả", value: String(stats.authorCount),  sub: "tác giả đang hoạt động", icon: "✍️", accent: "green"  as const, trend: "up" as const },
    { label: "Thể loại",     value: String(stats.categoryCount),sub: "thể loại truyện",         icon: "🏷️", accent: "purple" as const, trend: "up" as const },
  ]

  return (
    <div className="grid grid-cols-4 gap-3.5 mb-6">
      {cards.map(s => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  )
}
