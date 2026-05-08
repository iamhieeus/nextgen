export default function TopBar() {
  return (
    <div className="bg-[#2a2a2a] text-[#999] h-[30px] flex items-center text-[12px]">
      <div className="max-w-[1200px] w-full mx-auto flex justify-between items-center">
        <div className="flex items-center gap-0">
          <a href="#" className="text-[#999] hover:text-white transition-colors">Chào mừng bạn đến Cấm Địa!</a>
          <span className="text-[#555] mx-[5px]">|</span>
          <a href="#" className="text-[#999] hover:text-white transition-colors">Tải App Android</a>
          <span className="text-[#555] mx-[5px]">|</span>
          <a href="#" className="text-[#999] hover:text-white transition-colors">Tải App iOS</a>
          <span className="text-[#555] mx-[5px]">|</span>
          <a href="#" className="text-[#999] hover:text-white transition-colors">Trợ giúp</a>
        </div>
        <div className="flex items-center gap-0">
          <a href="#" className="text-[#999] hover:text-white transition-colors">Đăng nhập</a>
          <span className="text-[#555] mx-[5px]">|</span>
          <a href="#" className="text-[#999] hover:text-white transition-colors">Đăng ký</a>
          <span className="text-[#555] mx-[5px]">|</span>
          <a href="#" className="text-[#999] hover:text-white transition-colors">Tủ sách</a>
          <span className="text-[#555] mx-[5px]">|</span>
          <a href="#" className="text-[#999] hover:text-white transition-colors">Lịch sử đọc</a>
          <span className="text-[#555] mx-[5px]">|</span>
          <a href="#" className="text-[#999] hover:text-white transition-colors">Đăng truyện</a>
        </div>
      </div>
    </div>
  )
}
