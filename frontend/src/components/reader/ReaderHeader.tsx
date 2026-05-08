import Link from 'next/link'
import Image from 'next/image'

export default function ReaderHeader() {
  return (
    <div className="flex items-center justify-between px-[24px] py-[12px]" style={{ background: 'var(--rd-bg)' }}>
      <Link href="/" className="flex items-center gap-[9px]">
        <Image src="/logo.svg" width={32} height={32} alt="" aria-hidden="true" />
        <span className="text-[20px] font-black text-ac tracking-[-0.5px] leading-[1.15]">
          Cấm Địa
          <sub className="text-[10px] font-normal text-[#aaa] block mt-[2px] tracking-[.3px] not-italic">camdia.vn</sub>
        </span>
      </Link>
      <a href="#" className="bg-ac hover:bg-ac-dk text-white px-[20px] py-[7px] rounded-[4px] text-[13px] font-semibold transition-colors">
        Đăng nhập
      </a>
    </div>
  )
}
