import Link from 'next/link'

type ChapterRef = { no: number; title: string }

type Props = {
  storyId: string
  prevChapter: ChapterRef | null
  nextChapter: ChapterRef | null
}

export default function ChapterNav({ storyId, prevChapter, nextChapter }: Props) {
  return (
    <div className="grid grid-cols-2 border-t-[10px]" style={{ borderTopColor: 'var(--rd-bg)' }}>
      {prevChapter ? (
        <Link
          href={`/stories/${storyId}/chapters/${prevChapter.no}`}
          className="flex items-center justify-center px-[20px] py-[20px] text-[14px] font-semibold border transition-colors duration-150 hover:text-ac border-r-0"
          style={{ background: 'var(--rd-panel)', borderColor: 'var(--rd-border)', color: 'var(--rd-text-sub)' }}
        >
          ← Chương {prevChapter.no}: {prevChapter.title}
        </Link>
      ) : (
        <Link
          href={`/stories/${storyId}`}
          className="flex items-center justify-center px-[20px] py-[20px] text-[14px] font-semibold border transition-colors duration-150 hover:text-ac border-r-0"
          style={{ background: 'var(--rd-panel)', borderColor: 'var(--rd-border)', color: 'var(--rd-text-sub)' }}
        >
          ☰&ensp;Mục Lục
        </Link>
      )}

      {nextChapter ? (
        <Link
          href={`/stories/${storyId}/chapters/${nextChapter.no}`}
          className="flex items-center justify-center px-[20px] py-[20px] text-[14px] font-semibold border text-ac transition-colors duration-150 hover:bg-[#fff0f0]"
          style={{ background: 'var(--rd-panel)', borderColor: 'var(--rd-border)' }}
        >
          Chương {nextChapter.no}: {nextChapter.title}&ensp;→
        </Link>
      ) : (
        <div
          className="flex items-center justify-center px-[20px] py-[20px] text-[14px] font-semibold border"
          style={{ background: 'var(--rd-panel)', borderColor: 'var(--rd-border)', color: 'var(--rd-text-muted)' }}
        >
          Chương cuối
        </div>
      )}
    </div>
  )
}
