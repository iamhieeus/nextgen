import { FONT_SIZES, LINE_HEIGHTS, type FontKey, type LhKey } from './reader-settings'

type ChapterPara = { type: string; text: string; comments?: number }

type Props = {
  chapterNo: number
  chapterTitle: string
  storyTitle: string
  author: string
  wordCount: string
  date: string
  paragraphs: ChapterPara[]
  fontSize: FontKey
  lineHeight: LhKey
}

export default function ChapterCard({
  chapterNo, chapterTitle, storyTitle, author, wordCount, date, paragraphs, fontSize, lineHeight,
}: Props) {
  return (
    <div className="transition-colors duration-300" style={{ background: 'var(--rd-panel)' }}>
      {/* Head */}
      <div className="px-[48px] py-[34px] pb-[22px] border-b" style={{ borderColor: 'var(--rd-border)' }}>
        <div className="flex items-start gap-[10px] mb-[14px]">
          <h1 className="text-[22px] font-extrabold flex-1 leading-[1.35]" style={{ color: 'var(--rd-text)' }}>
            Chương {chapterNo}: {chapterTitle}
          </h1>
        </div>
        <div className="flex flex-wrap gap-[14px] text-[12px]" style={{ color: 'var(--rd-text-muted)' }}>
          <span className="flex items-center gap-[4px]">📖 {storyTitle}</span>
          <span className="flex items-center gap-[4px]">✍️ {author}</span>
          <span className="flex items-center gap-[4px]">📝 {wordCount} chữ</span>
          <span className="flex items-center gap-[4px]">🕐 {date}</span>
        </div>
      </div>

      {/* Body */}
      <div
        className="px-[48px] py-[30px] pb-[40px] transition-colors duration-300"
        style={{ fontSize: FONT_SIZES[fontSize], lineHeight: LINE_HEIGHTS[lineHeight], color: 'var(--rd-text)' }}
      >
        {paragraphs.map((para, i) => {
          if (para.type === 'divider') {
            return (
              <div key={i} className="text-center text-[18px] tracking-[6px] my-[24px] mb-[18px]" style={{ color: '#c0b8a8' }}>
                {para.text}
              </div>
            )
          }
          if (para.type === 'ps') {
            return (
              <p key={i} className="text-[14px] leading-[1.8] border-t pt-[18px] mt-[10px]" style={{ color: 'var(--rd-text-muted)', borderColor: 'var(--rd-border)' }}>
                {para.text}
              </p>
            )
          }
          if (para.type === 'keyword') {
            return (
              <p key={i} className="font-bold text-center tracking-[.5px] my-[1.3em]" style={{ color: 'var(--rd-text)' }}>
                {para.text}
                {para.comments !== undefined && <ParagraphComment count={para.comments} />}
              </p>
            )
          }
          return (
            <p key={i} className="mb-[1.1em] last:mb-0">
              {para.text}
              {para.comments !== undefined && <ParagraphComment count={para.comments} />}
            </p>
          )
        })}
      </div>
    </div>
  )
}

function ParagraphComment({ count }: { count: number }) {
  return (
    <span
      className="inline-flex items-center justify-center text-[11px] font-medium px-[6px] py-[1px] rounded-[3px] min-w-[26px] ml-[4px] align-middle cursor-pointer transition-colors duration-150 hover:bg-[#ddd9d0] hover:text-[#888]"
      style={{ background: '#eeebe4', color: '#bbb' }}
    >
      {count}
    </span>
  )
}
