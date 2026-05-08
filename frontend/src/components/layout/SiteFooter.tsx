const footerLinks = [
  "Trang chủ", "Đọc truyện", "Bảng xếp hạng", "Truyện Full", "Truyện Hot",
  "Mới nhất", "Ngôn Tình", "Tiên Hiệp", "Huyền Huyễn", "Xuyên Không",
  "Đăng truyện", "Trợ giúp", "Giới thiệu",
]

export default function SiteFooter() {
  return (
    <footer className="bg-[#3d3d3d] text-[#999] text-[12px] mt-[14px]">
      <div className="border-b border-[#4a4a4a]">
        <div className="max-w-[1200px] w-full mx-auto flex flex-wrap">
          {footerLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-[#999] px-[14px] py-[11px] block hover:text-white hover:bg-[#4a4a4a] transition-all"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
      <div className="max-w-[1200px] w-full mx-auto flex justify-between items-center py-[10px] flex-wrap gap-2">
        <div className="text-[18px] font-black text-[#ccc]">Cấm Địa</div>
        <div className="text-[11px] text-[#777]">
          © 2026 Cấm Địa – Vạn thế giới trong một trang sách. Bảo lưu mọi quyền.
        </div>
        <div className="flex gap-3">
          {["Chính sách bảo mật", "Điều khoản", "Liên hệ", "DMCA"].map((link) => (
            <a key={link} href="#" className="text-[#777] hover:text-[#ccc] transition-colors">{link}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
