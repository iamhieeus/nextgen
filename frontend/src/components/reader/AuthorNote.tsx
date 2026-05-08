export default function AuthorNote({ author, note }: { author: string; note: string }) {
  return (
    <div
      className="border-t px-[48px] py-[16px] pb-[20px] transition-colors duration-300"
      style={{ background: 'var(--rd-panel)', borderColor: 'var(--rd-border)' }}
    >
      <div className="text-[12px] mb-[7px]" style={{ color: 'var(--rd-text-muted)' }}>
        <a href="#" className="text-ac">{author}</a> · Tác giả nói:
      </div>
      <div className="text-[14px] leading-[1.8]" style={{ color: 'var(--rd-text-sub)' }}>
        {note}
      </div>
    </div>
  )
}
