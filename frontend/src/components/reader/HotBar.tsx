export default function HotBar({ count }: { count: number }) {
  return (
    <div
      className="px-[24px] py-[10px] text-[12px] flex items-center gap-[6px] transition-colors duration-300 border-t border-b-[3px]"
      style={{ background: 'var(--rd-panel)', borderTopColor: 'var(--rd-border)', borderBottomColor: '#e8e0d4', color: 'var(--rd-text-muted)' }}
    >
      🔥&ensp;Thảo luận sôi nổi: Chương này có{' '}
      <strong style={{ color: 'var(--rd-text)', margin: '0 3px' }}>{count.toLocaleString('vi-VN')}</strong>{' '}
      bình luận đoạn văn
    </div>
  )
}
