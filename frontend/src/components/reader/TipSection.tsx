type Avatar = { bg: string; emoji: string }

type Props = {
  tipCount: number
  tipAvatars: Avatar[]
}

export default function TipSection({ tipCount, tipAvatars }: Props) {
  return (
    <div
      className="border-t-[10px] px-[48px] py-[28px] pb-[26px] flex flex-col items-center gap-[14px] transition-colors duration-300"
      style={{ background: 'var(--rd-panel)', borderTopColor: 'var(--rd-bg)' }}
    >
      <button className="inline-flex items-center gap-[8px] bg-ac hover:bg-ac-dk text-white text-[16px] font-bold px-[38px] py-[13px] rounded-full border-none cursor-pointer transition-colors duration-150">
        ❤️&ensp;Ủng Hộ Tác Giả
        <span className="text-[12px] font-normal opacity-85">{tipCount} lượt</span>
      </button>

      <div className="flex justify-center gap-[6px]">
        {tipAvatars.map((av, i) => (
          <div
            key={i}
            className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-[17px] border-[2px] shadow-[0_1px_5px_rgba(0,0,0,.14)]"
            style={{ background: av.bg, borderColor: 'var(--rd-panel)' }}
          >
            {av.emoji}
          </div>
        ))}
      </div>

      <button
        className="inline-flex items-center gap-[7px] border text-[13px] px-[22px] py-[9px] rounded-full cursor-pointer transition-all duration-150 hover:border-ac hover:text-ac"
        style={{ borderColor: 'var(--rd-border)', background: 'var(--rd-panel)', color: 'var(--rd-text-muted)' }}
      >
        📱&ensp;Quét QR, tiếp tục đọc trên điện thoại
      </button>
    </div>
  )
}
