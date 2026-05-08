const ITEMS = ['Phản Hồi', 'Hướng Dẫn', 'Báo Cáo', 'Phiên Cũ']

export default function LeftFloat({ isNight }: { isNight: boolean }) {
  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[200] flex flex-col">
      {ITEMS.map((label, i) => (
        <a
          key={label}
          href="#"
          onClick={(e) => e.preventDefault()}
          className="[writing-mode:vertical-rl] [text-orientation:mixed] text-[12px] px-[7px] py-[13px] tracking-[1px] whitespace-nowrap transition-all duration-150 border border-[#d8d4cc] hover:text-ac hover:border-[#ffb3b5]"
          style={{
            background: isNight ? '#2e2d26' : 'rgba(255,255,255,.88)',
            borderLeft: 'none',
            color: isNight ? '#706858' : '#999',
            borderTop: i === 0 ? undefined : 'none',
          }}
        >
          {label}
        </a>
      ))}
    </div>
  )
}
