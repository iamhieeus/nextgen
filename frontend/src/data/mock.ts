// ─── Slider ───────────────────────────────────────────────────────────────────
export type SlideData = {
  title: string
  desc: string
  tags: { label: string; color?: "green" | "blue" }[]
  author: string
  chapters: string
  views: string
  bg: string
  emoji: string
}

export const slides: SlideData[] = [
  {
    title: "Lục Địa Kiện Tiên",
    desc: "Tại đại lục phồn hoa, vạn tộc tranh hùng, tiên đạo xưng bá. Một thanh niên bình thường từ Trái Đất xuyên qua, mang theo ký ức vạn năm, bắt đầu cuộc hành trình tu tiên huyền thoại...",
    tags: [{ label: "Tiên Hiệp" }, { label: "Huyền Huyễn" }, { label: "Đang Ra", color: "green" }],
    author: "Lục Như Hòa Thượng",
    chapters: "2.554 chương",
    views: "12.8M lượt đọc",
    bg: "linear-gradient(135deg,#1a1040,#3d1a6b)",
    emoji: "⚔️",
  },
  {
    title: "Người Tình Của Lý Tổng",
    desc: "Cô ấy chỉ là một cô gái bình thường, anh ấy là tổng giám đốc quyền lực nhất thành phố. Một hợp đồng tình yêu vô tình đẩy họ vào nhau, rồi tình yêu thật sự nảy sinh...",
    tags: [{ label: "Ngôn Tình" }, { label: "Đô Thị" }, { label: "Full", color: "green" }],
    author: "Linh Linh",
    chapters: "395 chương",
    views: "8.2M lượt đọc",
    bg: "linear-gradient(135deg,#7f0000,#c62828)",
    emoji: "🌹",
  },
  {
    title: "Toàn Chức Pháp Sư",
    desc: "Thế giới game online nơi phép thuật và chiến đấu là tất cả. Một game thủ thiên tài tái sinh với ký ức của kiếp trước, quyết tâm leo lên đỉnh cao vinh quang...",
    tags: [{ label: "Võng Du" }, { label: "Đang Ra", color: "blue" }],
    author: "Loạn",
    chapters: "3.137 chương",
    views: "15.4M lượt đọc",
    bg: "linear-gradient(135deg,#004d1a,#1b5e20)",
    emoji: "🏆",
  },
  {
    title: "Chuyển Sinh Thành Liễu Đột Biến",
    desc: "Sau khi chết trong thế giới tận thế, anh ta tỉnh dậy trong cơ thể một cây liễu đột biến. Với hệ thống vô địch trong tay, anh bắt đầu viết lại lịch sử...",
    tags: [{ label: "Trọng Sinh" }, { label: "Đô Thị" }, { label: "Hệ Thống" }],
    author: "Ẩn danh",
    chapters: "4.099 chương",
    views: "9.1M lượt đọc",
    bg: "linear-gradient(135deg,#0d2b5e,#1565c0)",
    emoji: "🕵️",
  },
]

// ─── Hot List ──────────────────────────────────────────────────────────────────
export type HotItem = {
  rank: number
  title: string
  genres: string
  chapters: string
  bg: string
  emoji: string
  href?: string
}

export const hotList: HotItem[] = [
  { rank: 1, title: "Chàng Rể Chiến Thần", genres: "Ngôn Tình · Đô Thị", chapters: "4.136 ch.", bg: "linear-gradient(135deg,#7f0000,#c62828)", emoji: "🌹", href: "/stories/chang-re-chien-than" },
  { rank: 2, title: "Thần Y Trở Lại", genres: "Ngôn Tình · Đô Thị", chapters: "4.690 ch.", bg: "linear-gradient(135deg,#1a3a6b,#1565c0)", emoji: "⚕️" },
  { rank: 3, title: "Toàn Chức Pháp Sư", genres: "Huyền Huyễn · Dị Giới", chapters: "3.137 ch.", bg: "linear-gradient(135deg,#004d1a,#2e7d32)", emoji: "🏆" },
  { rank: 4, title: "Lục Địa Kiện Tiên", genres: "Tiên Hiệp · Sắc", chapters: "2.554 ch.", bg: "linear-gradient(135deg,#4a0072,#7b1fa2)", emoji: "⚔️" },
  { rank: 5, title: "Chàng Rể Vô Dụng Là Tiên Tôn", genres: "Trọng Sinh · Đô Thị", chapters: "1.704 ch.", bg: "linear-gradient(135deg,#1a0060,#3949ab)", emoji: "💪" },
  { rank: 6, title: "Chàng Rể Bác Sĩ", genres: "Ngôn Tình · Đô Thị", chapters: "2.431 ch.", bg: "linear-gradient(135deg,#3e2600,#f57f17)", emoji: "👨‍⚕️" },
  { rank: 7, title: "Người Chồng Vô Dụng Của Nữ Thần", genres: "Ngôn Tình · Hiện đại", chapters: "5.290 ch.", bg: "linear-gradient(135deg,#1b004a,#6a1b9a)", emoji: "🌟" },
  { rank: 8, title: "Toàn Chức Cao Thủ: Như Bóng Với Hình", genres: "Võng Du", chapters: "248 ch.", bg: "linear-gradient(135deg,#004030,#00695c)", emoji: "🎮" },
]

// ─── Rankings ─────────────────────────────────────────────────────────────────
export type RankItem = { title: string; genre: string }

export const rankings = {
  mostRead: [
    { title: "Chàng Rể Chiến Thần", genre: "Ngôn Tình" },
    { title: "Thần Y Trở Lại", genre: "Đô Thị" },
    { title: "Toàn Chức Pháp Sư", genre: "Huyền Huyễn" },
    { title: "Người Chồng Vô Dụng Của Nữ Thần", genre: "Ngôn Tình" },
    { title: "Lục Địa Kiện Tiên", genre: "Tiên Hiệp" },
    { title: "Chàng Rể Bác Sĩ", genre: "Đô Thị" },
    { title: "Tiên Lộ Bình Thường", genre: "Tiên Hiệp" },
    { title: "Chàng Rể Vô Dụng Là Tiên Tôn", genre: "Trọng Sinh" },
    { title: "Binh Vương Và Bảy Chị Gái Cực Phẩm", genre: "Đô Thị" },
    { title: "Người Tình Của Lý Tổng", genre: "Ngôn Tình" },
  ] as RankItem[],
  topRated: [
    { title: "Rể Ngoan Xuống Núi, Tu Thành Chính Quả", genre: "Kiếm Hiệp" },
    { title: "Toàn Chức Pháp Sư", genre: "Võng Du" },
    { title: "Tiên Lộ Bình Thường", genre: "Tiên Hiệp" },
    { title: "Từ Tam Quốc Bắt Đầu Tu Tiên", genre: "Lịch Sử" },
    { title: "Thần Y Trở Lại", genre: "Đô Thị" },
    { title: "Chàng Rể Chiến Thần", genre: "Ngôn Tình" },
    { title: "Người Tình Của Lý Tổng", genre: "Ngôn Tình" },
    { title: "Chuyển Sinh Thành Liễu Đột Biến", genre: "Hệ Thống" },
    { title: "Lục Địa Kiện Tiên", genre: "Tiên Hiệp" },
    { title: "Binh Vương Và Bảy Chị Gái Cực Phẩm", genre: "Sắc" },
  ] as RankItem[],
  newTrending: [
    { title: "Võng Du Tam Quốc: Thăng Cấp Dòng", genre: "Võng Du" },
    { title: "Đại Đường, Ta Mới Vừa Xuyên Qua", genre: "Xuyên Không" },
    { title: "Tây Môn Tiên Tộc", genre: "Tiên Hiệp" },
    { title: "Mỗi Ngày Tình Báo: Từ Rắn Nước", genre: "Dị Năng" },
    { title: "Toàn Dân Hải Đảo Cầu Sinh", genre: "Mạt Thế" },
    { title: "Tinh Tế Rách Nát Nữ Vương", genre: "Nữ Cường" },
    { title: "Chia Tay Sau Ta Dựa Cá Mặn Bạo Hồng", genre: "Đam Mỹ" },
    { title: "Bắt Đầu Triệu Hoán Lý Tầm Hoan", genre: "Hệ Thống" },
    { title: "Đại Hạ Thánh Đình", genre: "Lịch Sử" },
    { title: "Chuyển Sinh Thành Liễu Đột Biến", genre: "Trọng Sinh" },
  ] as RankItem[],
}

// ─── Book Card Vertical ────────────────────────────────────────────────────────
export type BookCardVData = {
  title: string
  meta: string
  cover: { bg: string; emoji: string }
  badge?: { label: string; type: "hot" | "full" | "new" }
}

export const editorsPicks: BookCardVData[] = [
  { title: "Người Tình Của Lý Tổng", meta: "Linh Linh · Ngôn Tình · 395ch", cover: { bg: "linear-gradient(135deg,#7f0000,#c62828)", emoji: "🌹" }, badge: { label: "HOT", type: "hot" } },
  { title: "Lục Địa Kiện Tiên", meta: "Lục Như Hòa Thượng · Tiên Hiệp", cover: { bg: "linear-gradient(135deg,#4a0072,#7b1fa2)", emoji: "⚔️" }, badge: { label: "HOT", type: "hot" } },
  { title: "Toàn Chức Pháp Sư", meta: "Loạn · Huyền Huyễn · 3.137ch", cover: { bg: "linear-gradient(135deg,#004d1a,#2e7d32)", emoji: "🏆" }, badge: { label: "HOT", type: "hot" } },
  { title: "Rể Ngoan Xuống Núi", meta: "Ss Tần · Kiếm Hiệp · 1.477ch", cover: { bg: "linear-gradient(135deg,#1a0d40,#3949ab)", emoji: "💪" }, badge: { label: "FULL", type: "full" } },
  { title: "Toàn Dân Hải Đảo Cầu Sinh", meta: "Ẩn danh · Mạt Thế · 198ch", cover: { bg: "linear-gradient(135deg,#002a3a,#00838f)", emoji: "🕵️" }, badge: { label: "MỚI", type: "new" } },
]

// ─── Updated Stories ───────────────────────────────────────────────────────────
export type UpdateItem = {
  title: string
  latestChapter: string
  latestTitle: string
  time: string
  cover: { bg: string; emoji: string }
  isNew?: boolean
}

export const updatedList: UpdateItem[] = [
  { title: "Chàng Rể Vô Dụng Là Tiên Tôn", latestChapter: "Ch.1.704", latestTitle: "Tiên tôn tái xuất thế gian...", time: "15 phút", cover: { bg: "linear-gradient(135deg,#1a0060,#3949ab)", emoji: "💪" }, isNew: true },
  { title: "Chàng Rể Chiến Thần", latestChapter: "Ch.4.136", latestTitle: "Chiến thần hiển uy danh...", time: "42 phút", cover: { bg: "linear-gradient(135deg,#7f0000,#c62828)", emoji: "🌹" }, isNew: true },
  { title: "Thần Y Trở Lại", latestChapter: "Ch.4.690", latestTitle: "Bí ẩn về huyết mạch...", time: "1 giờ", cover: { bg: "linear-gradient(135deg,#1a3a6b,#1565c0)", emoji: "⚕️" }, isNew: true },
  { title: "Võng Du Tam Quốc: Thăng Cấp Dòng", latestChapter: "Ch.381", latestTitle: "Đại chiến quyết định...", time: "2 giờ", cover: { bg: "linear-gradient(135deg,#004030,#00695c)", emoji: "🎮" } },
  { title: "Từ Tam Quốc Bắt Đầu Tu Tiên", latestChapter: "Ch.479", latestTitle: "Bí kíp cổ đại hiển thế...", time: "3 giờ", cover: { bg: "linear-gradient(135deg,#3e1200,#bf360c)", emoji: "🔮" } },
  { title: "Tinh Tế Rách Nát Nữ Vương", latestChapter: "Ch.2.925", latestTitle: "Nữ vương phản công...", time: "5 giờ", cover: { bg: "linear-gradient(135deg,#1b004a,#6a1b9a)", emoji: "🌟" } },
]

// ─── Completed Stories ─────────────────────────────────────────────────────────
export type CompletedItem = {
  title: string
  genreInfo: string
  cover: { bg: string; emoji: string }
}

export const completedList: CompletedItem[] = [
  { title: "Rể Ngoan Xuống Núi, Tu Thành Chính Quả", genreInfo: "Kiếm Hiệp · 1.477 chương", cover: { bg: "linear-gradient(135deg,#1a0d40,#3949ab)", emoji: "🧙" } },
  { title: "Người Tình Của Lý Tổng", genreInfo: "Ngôn Tình · 395 chương", cover: { bg: "linear-gradient(135deg,#7f0000,#c62828)", emoji: "🌹" } },
  { title: "Người Chồng Vô Dụng Của Nữ Thần", genreInfo: "Ngôn Tình · 5.290 chương", cover: { bg: "linear-gradient(135deg,#1b004a,#6a1b9a)", emoji: "🌸" } },
  { title: "Ngôn Tình Tổng Giám Đốc: Yêu Em Từ Khi Nào", genreInfo: "Ngôn Tình · 280 chương", cover: { bg: "linear-gradient(135deg,#3e1200,#bf360c)", emoji: "🌺" } },
  { title: "Xuyên Thành Tiểu Thư Phản Diện", genreInfo: "Xuyên Không · 422 chương", cover: { bg: "linear-gradient(135deg,#004030,#00695c)", emoji: "📜" } },
  { title: "Trọng Sinh Thành Đại Tiểu Thư Nhà Giàu", genreInfo: "Trọng Sinh · 318 chương", cover: { bg: "linear-gradient(135deg,#002a3a,#01579b)", emoji: "🌊" } },
]

// ─── Book Card Horizontal ──────────────────────────────────────────────────────
export type BookCardHData = {
  title: string
  tags: { label: string; highlight?: boolean }[]
  desc: string
  author: string
  chapters: string
  views: string
  cover: { bg: string; emoji: string }
}

export const recommendations: BookCardHData[] = [
  {
    title: "Chàng Rể Chiến Thần",
    tags: [{ label: "Ngôn Tình", highlight: true }, { label: "Đô Thị", highlight: true }, { label: "Sủng" }, { label: "Đang Ra" }],
    desc: "Bị gia đình vợ coi thường, nhưng anh chính là chiến thần huyền thoại đã ẩn danh suốt nhiều năm qua. Khi thân phận được hé lộ, cả thành phố rung chuyển...",
    author: "Tiếu Ngạo Dư Sinh", chapters: "4.136 ch.", views: "18.3M đọc",
    cover: { bg: "linear-gradient(135deg,#7f0000,#c62828)", emoji: "🌹" },
  },
  {
    title: "Lục Địa Kiện Tiên",
    tags: [{ label: "Tiên Hiệp", highlight: true }, { label: "Sắc" }, { label: "Đang Ra" }],
    desc: "Vạn tộc tranh hùng tại đại lục Thần Châu, tiên đạo xưng bá. Một thanh niên bình thường với ký ức ngàn năm bắt đầu hành trình chinh phục tiên giới...",
    author: "Lục Như Hòa Thượng", chapters: "2.554 ch.", views: "12.8M đọc",
    cover: { bg: "linear-gradient(135deg,#4a0072,#7b1fa2)", emoji: "⚔️" },
  },
  {
    title: "Thần Y Trở Lại",
    tags: [{ label: "Ngôn Tình", highlight: true }, { label: "Đô Thị", highlight: true }, { label: "Đang Ra" }],
    desc: "Thần y huyền thoại trở về sau nhiều năm ẩn tích. Vừa xuất hiện đã lập tức chấn động y giới, kẻ thù cũ, tình cũ đều lần lượt tìm đến...",
    author: "Tiểu Tịnh", chapters: "4.690 ch.", views: "21.6M đọc",
    cover: { bg: "linear-gradient(135deg,#1a3a6b,#1565c0)", emoji: "⚕️" },
  },
  {
    title: "Chuyển Sinh Thành Liễu Đột Biến",
    tags: [{ label: "Trọng Sinh", highlight: true }, { label: "Hệ Thống", highlight: true }, { label: "Đô Thị" }],
    desc: "Sau khi chết trong tận thế, tái sinh thành cây liễu đột biến. Với hệ thống vạn năng, dần dần tiến hóa, thống trị thế giới hoang tàn...",
    author: "Ẩn danh", chapters: "4.099 ch.", views: "9.1M đọc",
    cover: { bg: "linear-gradient(135deg,#0d2b5e,#1565c0)", emoji: "🕵️" },
  },
  {
    title: "Từ Tam Quốc Bắt Đầu Tu Tiên",
    tags: [{ label: "Tiên Hiệp", highlight: true }, { label: "Lịch Sử", highlight: true }, { label: "Đang Ra" }],
    desc: "Xuyên đến thời Tam Quốc loạn lạc, bỗng nhiên phát hiện thiên địa có linh khí, tu tiên có thể thành tiên. Trong thời đại anh hùng, ta chọn con đường bất tử...",
    author: "Phàm Nhân Nhậm", chapters: "479 ch.", views: "3.2M đọc",
    cover: { bg: "linear-gradient(135deg,#3e1200,#e64a19)", emoji: "🔮" },
  },
  {
    title: "Tinh Tế Rách Nát Nữ Vương",
    tags: [{ label: "Nữ Cường", highlight: true }, { label: "Ngôn Tình", highlight: true }, { label: "Đô Thị" }],
    desc: "Cô bị phản bội, bị cướp đoạt tất cả. Khi tái sinh, cô không còn là cô gái ngây thơ ngày xưa. Nữ vương trở về, thời đại thay đổi...",
    author: "Liễu Thăng Thăng", chapters: "2.925 ch.", views: "7.4M đọc",
    cover: { bg: "linear-gradient(135deg,#1b004a,#6a1b9a)", emoji: "🌸" },
  },
]

// ─── Categories ───────────────────────────────────────────────────────────────
export type CategoryItem = { icon: string; name: string; count: string }

export const categories: CategoryItem[] = [
  { icon: "⚔️", name: "Tiên Hiệp", count: "8.241 bộ" },
  { icon: "🗡️", name: "Kiếm Hiệp", count: "4.132 bộ" },
  { icon: "🌹", name: "Ngôn Tình", count: "12.544 bộ" },
  { icon: "💙", name: "Đam Mỹ", count: "6.318 bộ" },
  { icon: "🌸", name: "Bách Hợp", count: "2.104 bộ" },
  { icon: "🏛️", name: "Quan Trường", count: "1.876 bộ" },
  { icon: "🎮", name: "Võng Du", count: "3.210 bộ" },
  { icon: "🚀", name: "Khoa Huyễn", count: "2.890 bộ" },
  { icon: "⚙️", name: "Hệ Thống", count: "5.442 bộ" },
  { icon: "🔮", name: "Huyền Huyễn", count: "9.103 bộ" },
  { icon: "🌍", name: "Dị Giới", count: "4.567 bộ" },
  { icon: "⚡", name: "Dị Năng", count: "3.012 bộ" },
  { icon: "🪖", name: "Quân Sự", count: "1.234 bộ" },
  { icon: "📜", name: "Lịch Sử", count: "2.788 bộ" },
  { icon: "⏳", name: "Xuyên Không", count: "7.891 bộ" },
  { icon: "⚡", name: "Xuyên Nhanh", count: "4.320 bộ" },
  { icon: "🔄", name: "Trọng Sinh", count: "6.543 bộ" },
  { icon: "🔍", name: "Trinh Thám", count: "1.890 bộ" },
  { icon: "👻", name: "Linh Dị", count: "2.345 bộ" },
  { icon: "😭", name: "Ngược", count: "3.102 bộ" },
  { icon: "💋", name: "Sắc", count: "8.920 bộ" },
  { icon: "💕", name: "Sủng", count: "7.654 bộ" },
  { icon: "👑", name: "Cung Đấu", count: "2.210 bộ" },
  { icon: "💪", name: "Nữ Cường", count: "4.432 bộ" },
  { icon: "🏠", name: "Gia Đấu", count: "1.987 bộ" },
  { icon: "🏯", name: "Đông Phương", count: "3.321 bộ" },
  { icon: "🏙️", name: "Đô Thị", count: "11.234 bộ" },
  { icon: "🌾", name: "Điền Văn", count: "2.109 bộ" },
  { icon: "☣️", name: "Mạt Thế", count: "3.456 bộ" },
  { icon: "📚", name: "Light Novel", count: "1.543 bộ" },
  { icon: "✍️", name: "Đoản Văn", count: "5.678 bộ" },
  { icon: "💼", name: "Hiện Đại", count: "9.876 bộ" },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export type SidebarTopItem = {
  rank: number
  title: string
  sub: string
  cover: { bg: string; emoji: string }
}

export const sidebarTopMonth: SidebarTopItem[] = [
  { rank: 1, title: "Chàng Rể Chiến Thần", sub: "Ngôn Tình · 18.3M đọc", cover: { bg: "linear-gradient(135deg,#7f0000,#c62828)", emoji: "🌹" } },
  { rank: 2, title: "Thần Y Trở Lại", sub: "Đô Thị · 21.6M đọc", cover: { bg: "linear-gradient(135deg,#1a3a6b,#1565c0)", emoji: "⚕️" } },
  { rank: 3, title: "Toàn Chức Pháp Sư", sub: "Huyền Huyễn · 15.4M đọc", cover: { bg: "linear-gradient(135deg,#004d1a,#2e7d32)", emoji: "🏆" } },
  { rank: 4, title: "Lục Địa Kiện Tiên", sub: "Tiên Hiệp · 12.8M đọc", cover: { bg: "linear-gradient(135deg,#4a0072,#7b1fa2)", emoji: "⚔️" } },
  { rank: 5, title: "Người Chồng Vô Dụng Của Nữ Thần", sub: "Ngôn Tình · 11.2M đọc", cover: { bg: "linear-gradient(135deg,#1b004a,#6a1b9a)", emoji: "🌸" } },
  { rank: 6, title: "Chàng Rể Bác Sĩ", sub: "Đô Thị · 9.8M đọc", cover: { bg: "linear-gradient(135deg,#3e2600,#f57f17)", emoji: "👨‍⚕️" } },
  { rank: 7, title: "Chàng Rể Vô Dụng Là Tiên Tôn", sub: "Trọng Sinh · 8.5M đọc", cover: { bg: "linear-gradient(135deg,#1a0060,#3949ab)", emoji: "💪" } },
]

export type AuthorItem = {
  rank: number
  name: string
  sub: string
  cover: { bg: string }
}

export const featuredAuthors: AuthorItem[] = [
  { rank: 1, name: "Tiếu Ngạo Dư Sinh", sub: "12 bộ · 48.2M đọc", cover: { bg: "linear-gradient(135deg,#7f0000,#c62828)" } },
  { rank: 2, name: "Tiểu Tịnh", sub: "8 bộ · 31.5M đọc", cover: { bg: "linear-gradient(135deg,#1a3a6b,#1565c0)" } },
  { rank: 3, name: "Lục Như Hòa Thượng", sub: "5 bộ · 18.9M đọc", cover: { bg: "linear-gradient(135deg,#004d1a,#2e7d32)" } },
  { rank: 4, name: "Linh Linh", sub: "15 bộ · 14.2M đọc", cover: { bg: "linear-gradient(135deg,#4a0072,#7b1fa2)" } },
  { rank: 5, name: "Phàm Nhân Nhậm", sub: "7 bộ · 10.1M đọc", cover: { bg: "linear-gradient(135deg,#3e1200,#bf360c)" } },
]
