import AuthorBio from "./AuthorBio"

type Props = {
  penname: string
  bio: string
  initial: string
  color: string
  joinedLabel: string
  daysWriting: number
  storyCount: number
  totalWordsFormatted: string
  facebook: string
  twitter: string
  website: string
}

export default function AuthorHero({
  penname, bio, initial, color, joinedLabel,
  daysWriting, storyCount, totalWordsFormatted,
  facebook, twitter, website,
}: Props) {
  return (
    <div className="bg-[#1a0030] relative overflow-hidden"
      style={{ background: "linear-gradient(135deg,#1a0030 0%,#2d1260 35%,#6b0f1a 70%,#8b1a1a 100%)" }}
    >
      {/* Radial glows */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 50%,rgba(120,40,200,.3) 0%,transparent 60%),radial-gradient(ellipse at 80% 30%,rgba(200,40,40,.25) 0%,transparent 50%)" }}
      />

      <div className="max-w-[1200px] w-full mx-auto px-0 py-8 flex items-center gap-7 relative z-10">
        {/* Avatar */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-[40px] font-black text-white flex-shrink-0 shadow-[0_4px_20px_rgba(0,0,0,.4)] border-[3px] border-white/20"
          style={{ background: `linear-gradient(135deg,${color},${color}aa)` }}
        >
          {initial}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-[26px] font-black text-white mb-1 leading-tight">{penname}</h1>
          <AuthorBio bio={bio} />
          <div className="flex items-center gap-3 flex-wrap">
            <button className="inline-flex items-center gap-1.5 bg-ac text-white px-5 py-[7px] rounded-[3px] text-[13px] font-bold hover:bg-ac-dk transition-colors cursor-pointer">
              + Theo dõi tác giả
            </button>
            {facebook && (
              <a href={facebook} target="_blank" rel="noopener" className="text-[12px] text-white/50 hover:text-white transition-colors">Facebook</a>
            )}
            {twitter && (
              <a href={twitter} target="_blank" rel="noopener" className="text-[12px] text-white/50 hover:text-white transition-colors">Twitter/X</a>
            )}
            {website && (
              <a href={website} target="_blank" rel="noopener" className="text-[12px] text-white/50 hover:text-white transition-colors">Website</a>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-shrink-0">
          {[
            { val: String(storyCount), label: "Tác phẩm" },
            { val: totalWordsFormatted, label: "Tổng số chữ" },
            { val: `${daysWriting}`, label: "Ngày sáng tác" },
          ].map((stat, i) => (
            <div key={stat.label} className={`text-center px-8 ${i > 0 ? "border-l border-white/12" : ""}`}>
              <div className="text-[22px] font-black text-white leading-tight">{stat.val}</div>
              <div className="text-[12px] text-white/50 mt-[3px]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
