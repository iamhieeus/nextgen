import Link from 'next/link'

type BreadcrumbItem = { label: string; href: string }

type Props = {
  genres: BreadcrumbItem[]
  storyTitle: string
  storyHref: string
  chapterNo: number
}

export default function ReaderBreadcrumb({ genres, storyTitle, storyHref, chapterNo }: Props) {
  return (
    <nav
      className="max-w-[820px] mx-auto pb-[10px] flex items-center gap-[5px] text-[12px]"
      style={{ color: 'var(--rd-text-muted)' }}
    >
      <Link href="/" className="hover:text-ac transition-colors" style={{ color: 'var(--rd-text-muted)' }}>
        Trang chủ
      </Link>
      <span style={{ color: '#c8c0b4' }}>›</span>
      {genres.map((item, i) => (
        <span key={i} className="flex items-center gap-[5px]">
          <a href={item.href} className="hover:text-ac transition-colors" style={{ color: 'var(--rd-text-muted)' }}>
            {item.label}
          </a>
          <span style={{ color: '#c8c0b4' }}>›</span>
        </span>
      ))}
      <Link href={storyHref} className="hover:text-ac transition-colors" style={{ color: 'var(--rd-text-muted)' }}>
        {storyTitle}
      </Link>
      <span style={{ color: '#c8c0b4' }}>›</span>
      <span style={{ color: 'var(--rd-text-sub)' }}>Chương {chapterNo}</span>
    </nav>
  )
}
