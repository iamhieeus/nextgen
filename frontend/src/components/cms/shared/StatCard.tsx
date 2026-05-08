type Accent = "red" | "blue" | "green" | "purple"

const accentClass: Record<Accent, string> = {
  red:    "border-t-[#e5353e]",
  blue:   "border-t-[#3b82f6]",
  green:  "border-t-[#22c55e]",
  purple: "border-t-[#a855f7]",
}

interface StatCardProps {
  label:   string
  value:   string
  sub:     string
  icon:    string
  accent:  Accent
  trend?:  "up" | "down"
}

export default function StatCard({ label, value, sub, icon, accent, trend = "up" }: StatCardProps) {
  return (
    <div className={`bg-white rounded-[10px] px-5 py-[18px] border border-[#e5e5e5] border-t-[3px] ${accentClass[accent]} hover:shadow-[0_4px_20px_rgba(0,0,0,.08)] hover:-translate-y-px transition-all cursor-default`}>
      <div className="text-[11.5px] font-semibold text-[#888] uppercase tracking-[.05em] mb-2 flex justify-between items-start">
        {label}
        <span className="text-[22px] -mt-0.5">{icon}</span>
      </div>
      <div className="text-[26px] font-bold text-[#1a1a1a] leading-none">{value}</div>
      <div className="text-[11.5px] text-[#aaa] mt-[5px]">
        <span className={`font-semibold mr-0.5 ${trend === "up" ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
          {trend === "up" ? "↑" : "↓"}
        </span>
        {sub}
      </div>
    </div>
  )
}
