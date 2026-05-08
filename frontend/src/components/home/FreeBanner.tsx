export default function FreeBanner() {
  return (
    <div className="bg-gradient-to-r from-[#fff0f0] to-[#ffe0e0] border border-[#ffb3b5] flex items-center justify-between px-[16px] py-[12px] gap-[10px]">
      <div className="flex items-center gap-[10px]">
        <span className="text-[30px] flex-shrink-0">📖</span>
        <div>
          <h3 className="text-[14px] font-bold text-[#b82830]">
            Hơn 10.000 truyện miễn phí — Đọc ngay, không cần đăng ký
          </h3>
          <p className="text-[11px] text-ac mt-[1px]">
            Cập nhật liên tục · Chương mới mỗi ngày · Đồng bộ đa thiết bị
          </p>
        </div>
      </div>
      <a
        href="#"
        className="bg-ac hover:bg-ac-dk text-white px-[22px] py-[9px] text-[13px] font-semibold whitespace-nowrap rounded-[3px] flex-shrink-0 transition-colors"
      >
        Khám phá truyện miễn phí →
      </a>
    </div>
  )
}
