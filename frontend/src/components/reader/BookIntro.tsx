import CoverBox from "@/components/story/CoverBox"

type Props = {
  cover: { bg: string; emoji: string; image?: string }
  storyTitle: string
  author: string
  genres: string[]
  publishedDate: string
  totalWords: string
  readerCount: string
}

export default function BookIntro({ cover, storyTitle, author, genres, publishedDate, totalWords, readerCount }: Props) {
  const stats = [
    { value: publishedDate, label: 'Ngày đăng' },
    { value: totalWords, label: 'Đang ra (chữ)' },
  ]

  return (
    <div
      className="flex flex-col items-center text-center px-[40px] py-[36px] pb-[28px] transition-colors duration-300"
      style={{ background: '#f5f1e8' }}
    >
      <CoverBox
        cover={cover}
        className="w-[128px] h-[171px] rounded-[4px] shadow-[3px_5px_18px_rgba(0,0,0,.25)] mb-[22px] flex-shrink-0"
        emojiSize="text-[58px]"
      />

      <div className="text-[28px] font-black mb-[8px] tracking-[-0.3px]" style={{ color: 'var(--rd-text)' }}>
        {storyTitle}
      </div>
      <div className="text-[14px] mb-[16px]" style={{ color: 'var(--rd-text-muted)' }}>
        {author} 著
      </div>

      {/* Genre chips */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-[20px]">
        {genres.map((g) => (
          <span key={g} className="text-[12px] px-[10px] py-[2px] rounded-[2px] font-medium" style={{ background: 'rgba(229,53,62,.12)', color: '#e5353e', border: '1px solid rgba(229,53,62,.3)' }}>{g}</span>
        ))}
      </div>

      <div className="flex gap-[52px] mb-[16px]">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <strong className="block text-[16px] font-bold" style={{ color: 'var(--rd-text)' }}>{value}</strong>
            <span className="text-[12px] mt-[3px] block" style={{ color: 'var(--rd-text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>

      <div className="text-[13px] mb-[20px] leading-[1.7]" style={{ color: 'var(--rd-text-muted)' }}>
        Cùng <strong>{readerCount}</strong> độc giả khám phá hành trình của <em>{storyTitle}</em>
      </div>

      <div
        className="rounded-[4px] px-[22px] py-[13px] text-[12px] leading-[2]"
        style={{ background: '#ece7db', border: '1px solid #d8d2c4', color: '#aaa' }}
      >
        <div className="text-[20px] mb-[3px]">📖</div>
        Cấm Địa<br />
        Tác phẩm được phát hành độc quyền trên Cấm Địa<br />
        ©Bản quyền thuộc tác giả · Nghiêm cấm sao chép trái phép
      </div>
    </div>
  )
}
