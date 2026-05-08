import Link from "next/link"
import CoverBox from "./CoverBox"

type SimilarStory = { title: string; genre: string; chapters: string; views: string; cover: { bg: string; emoji: string; image?: string }; href?: string }
type StoryRanking = { label: string; rank: string; icon: string; rankClass: string }

type Props = {
  author: string
  authorId: number | null
  tags: string[]
  similarStories: SimilarStory[]
  storyRankings: StoryRanking[]
}

const rankBg: Record<string, string> = {
  n1: "bg-ac text-white",
  n2: "bg-[#e8892a] text-white",
  n3: "bg-[#e8b52a] text-white",
}

export default function StorySidebar({ author, authorId, tags, similarStories, storyRankings }: Props) {
  return (
    <div className="w-[252px] flex-shrink-0 flex flex-col gap-[10px]">

      {/* Author card */}
      <div className="bg-white border border-[#e5e5e5]">
        <div className="flex flex-col items-center p-[16px_14px] text-center">
          {authorId ? (
            <Link href={`/authors/${authorId}`} className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7f0000] to-[#c62828] flex items-center justify-center text-[26px] mb-2 shadow-[0_2px_8px_rgba(0,0,0,.15)] hover:opacity-80 transition-opacity">
              ✍️
            </Link>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7f0000] to-[#c62828] flex items-center justify-center text-[26px] mb-2 shadow-[0_2px_8px_rgba(0,0,0,.15)]">
              ✍️
            </div>
          )}
          {authorId ? (
            <Link href={`/authors/${authorId}`} className="text-[15px] font-bold mb-1 text-[#222] hover:text-ac transition-colors">{author}</Link>
          ) : (
            <div className="text-[15px] font-bold mb-1 text-[#222]">{author}</div>
          )}
          {authorId ? (
            <Link href={`/authors/${authorId}`} className="w-full block py-2 border border-ac text-ac bg-white text-[13px] font-semibold rounded-[3px] hover:bg-ac hover:text-white transition-colors text-center mt-2">
              Xem trang tác giả →
            </Link>
          ) : (
            <button className="w-full py-2 border border-ac text-ac bg-white text-[13px] font-semibold rounded-[3px] hover:bg-ac hover:text-white transition-colors cursor-pointer mt-2">
              + Theo dõi tác giả
            </button>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white border border-[#e5e5e5]">
        <div className="bg-panel-hd px-[14px] py-[10px] flex items-center border-b border-[#e5e5e5]">
          <h3 className="text-[13px] font-bold text-ac">🏷️ Tags</h3>
        </div>
        <div className="flex flex-wrap gap-[5px] p-[10px_14px_12px]">
          {tags.map((tag, i) => (
            <a key={`${i}-${tag}`} href="#" className="text-[11px] bg-[#f5f5f5] text-[#555] px-2 py-[3px] border border-[#ebebeb] rounded-[1px] hover:bg-ac-lt hover:text-ac hover:border-[#ffc5c7] transition-all">
              {tag}
            </a>
          ))}
        </div>
      </div>

      {/* Rankings */}
      {storyRankings.length > 0 && (
        <div className="bg-white border border-[#e5e5e5]">
          <div className="bg-panel-hd px-[14px] py-[10px] flex items-center border-b border-[#e5e5e5]">
            <h3 className="text-[13px] font-bold text-ac flex-1">📊 Vị trí BXH</h3>
            <a href="#" className="text-[11px] text-[#999] hover:text-ac transition-colors">Xem tất cả →</a>
          </div>
          <div className="p-[10px_14px_12px] flex flex-col gap-0">
            {storyRankings.map((r, i) => (
              <div key={i} className="flex items-center gap-2 py-[5px] border-b border-[#f7f7f7] last:border-none">
                <span className={`w-5 h-5 rounded-[2px] flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${rankBg[r.rankClass] ?? "bg-[#eee] text-[#999]"}`}>
                  {i + 1}
                </span>
                <span className="flex-1 text-[12px] overflow-hidden text-ellipsis whitespace-nowrap hover:text-ac transition-colors cursor-pointer">
                  {r.label}
                </span>
                <span className="text-[11px] text-[#999] flex-shrink-0">{r.rank}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar stories */}
      {similarStories.length > 0 && (
        <div className="bg-white border border-[#e5e5e5]">
          <div className="bg-panel-hd px-[14px] py-[10px] border-b border-[#e5e5e5]">
            <h3 className="text-[13px] font-bold text-ac">📚 Truyện tương tự</h3>
          </div>
          <div className="p-[12px_14px]">
            {similarStories.map((story, i) => (
              <Link key={i} href={story.href ?? "#"} className="flex gap-[10px] py-2 border-b border-[#f5f5f5] last:border-none cursor-pointer group">
                <CoverBox cover={story.cover} className="w-10 h-[60px] rounded-[2px] flex-shrink-0 shadow-[1px_2px_5px_rgba(0,0,0,.15)]" emojiSize="text-[18px]" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-bold overflow-hidden text-ellipsis whitespace-nowrap mb-[3px] group-hover:text-ac transition-colors">
                    {story.title}
                  </div>
                  <div className="text-[11px] text-[#999]">
                    {story.genre} · <span className="text-ac">{story.chapters}</span>
                  </div>
                  <div className="text-[11px] text-[#999]">{story.views} lượt đọc</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
