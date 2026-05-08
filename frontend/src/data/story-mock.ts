export const storyDetail = {
  slug: "chang-re-chien-than",
  title: "Chàng Rể Chiến Thần",
  author: "Tiếu Ngạo Dư Sinh",
  genres: ["Ngôn Tình", "Đô Thị"],
  status: "ongoing" as const,
  rating: 4.7,
  ratingCount: 1284,
  views: "18.3M",
  bookmarks: "1.2M",
  chapterCount: 4136,
  wordCount: "8.2M",
  updateSchedule: "Hàng ngày",
  cover: { bg: "linear-gradient(135deg,#7f0000,#c62828)", emoji: "🌹" },
  synopsis: `Lý Phong — một chàng trai bình thường lấy vợ giàu và bị cả gia đình nhà vợ khinh thường, gọi là "chàng rể ăn bám". Nhưng không ai biết rằng, anh chính là Chiến Thần số một của liên minh phương Đông, người đã một mình chống đỡ ba quốc gia, danh chấn thiên hạ.\n\nVì lời hứa với người thầy đã khuất, anh ẩn mình trong cuộc sống bình thường. Nhưng khi những kẻ thù từ quá khứ bắt đầu đe dọa gia đình nhỏ của anh, Chiến Thần thức tỉnh — và cả thế giới sẽ phải run sợ trước cơn thịnh nộ của anh ta...`,
  introFull: [
    `Lý Phong — một chàng trai bình thường lấy vợ giàu và bị cả gia đình nhà vợ khinh thường, gọi là "chàng rể ăn bám". Nhưng không ai biết rằng, anh chính là Chiến Thần số một của liên minh phương Đông, người đã một mình chống đỡ ba quốc gia, danh chấn thiên hạ.`,
    `Vì lời hứa với người thầy đã khuất, anh ẩn mình trong cuộc sống bình thường bên cạnh người vợ xinh đẹp nhưng lạnh lùng. Ba năm sống cùng nhau, anh lo toan mọi việc nhà, cam chịu mọi sự khinh miệt từ gia đình họ Trần, chỉ để giữ trọn lời thề.`,
    `Nhưng khi tổ chức Rồng Đen bắt đầu nhắm vào gia đình anh, khi vợ anh bị đẩy vào tình cảnh nguy hiểm — Chiến Thần thức tỉnh. Và cả thế giới sẽ phải chứng kiến, kẻ bị gọi là "chàng rể ăn bám" thật sự là ai.`,
    `"Ta đã nhẫn nhịn ba năm, không phải vì ta sợ, mà vì ta chọn bình yên. Nhưng các ngươi đã chạm đến giới hạn cuối cùng của ta."`,
  ],
  tags: ["#chàng-rể", "#chiến-thần", "#ẩn thân", "#ngôn-tình", "#đô-thị", "#cường-giả", "#hôn-nhân", "#full"],
  breadcrumb: [
    { label: "Trang chủ", href: "/" },
    { label: "Ngôn Tình", href: "#" },
    { label: "Đô Thị", href: "#" },
  ],
}

export type ChapterItem = {
  no: string
  title: string
  date: string
  free: boolean
}

export type Volume = {
  name: string
  range: string
  defaultOpen: boolean
  chapters: ChapterItem[]
}

export const volumes: Volume[] = [
  {
    name: "Quyển 1: Chàng Rể Bị Khinh",
    range: "Chương 1 – 312",
    defaultOpen: true,
    chapters: [
      { no: "Ch.312", title: "Kẻ thù cuối cùng phải quỳ", date: "2 giờ trước", free: true },
      { no: "Ch.311", title: "Ta là Chiến Thần — hãy ghi nhớ điều đó", date: "hôm qua", free: true },
      { no: "Ch.310", title: "Đại chiến tại đỉnh tòa nhà", date: "2 ngày trước", free: true },
      { no: "Ch.309", title: "Vợ ta — không ai được động vào", date: "3 ngày trước", free: true },
      { no: "Ch.308", title: "Lộ diện thân phận thật", date: "4 ngày trước", free: true },
      { no: "Ch.307", title: "Nhà họ Lưu sụp đổ trong đêm", date: "5 ngày trước", free: true },
      { no: "Ch.306", title: "Một cuộc điện thoại rung chuyển cả thành phố", date: "6 ngày trước", free: true },
      { no: "Ch.305", title: "Quân đoàn Hắc Phong nghe lệnh ta", date: "7 ngày trước", free: true },
      { no: "Ch.304", title: "Tướng quân xuất thế, vạn người kính phục", date: "8 ngày trước", free: true },
      { no: "Ch.303", title: "Gã chàng rể không ai ngờ tới", date: "9 ngày trước", free: true },
      { no: "Ch.302", title: "Hai năm ẩn mình kết thúc hôm nay", date: "10 ngày trước", free: true },
      { no: "Ch.301", title: "Đêm nay, Chiến Thần trở lại", date: "11 ngày trước", free: true },
      { no: "Ch.300", title: "Lời thề với người thầy quá cố", date: "12 ngày trước", free: true },
      { no: "Ch.299", title: "Nhớ lại quá khứ — máu và vinh quang", date: "13 ngày trước", free: true },
      { no: "Ch.2", title: "Bị cả nhà khinh thường trong bữa cơm", date: "3 năm trước", free: true },
      { no: "Ch.1", title: "Chàng rể ăn bám của gia đình họ Trần", date: "3 năm trước", free: true },
    ],
  },
  {
    name: "Quyển 2: Chiến Thần Thức Tỉnh",
    range: "Chương 313 – 980",
    defaultOpen: false,
    chapters: [
      { no: "Ch.980", title: "Đại hội võ lâm — không ai địch nổi", date: "2 tháng trước", free: true },
      { no: "Ch.979", title: "Bí mật của tổ chức Rồng Đen", date: "2 tháng trước", free: false },
      { no: "Ch.313", title: "Chiến thần bước ra từ bóng tối", date: "2 năm trước", free: true },
    ],
  },
  {
    name: "Quyển 3: Bá Đồ Tranh Hùng",
    range: "Chương 981 – 2.100",
    defaultOpen: false,
    chapters: [
      { no: "Ch.981", title: "Thế giới ngầm run sợ", date: "18 tháng trước", free: false },
    ],
  },
  {
    name: "Quyển 4: Đỉnh Cao Quyền Lực",
    range: "Chương 2.101 – 3.500",
    defaultOpen: false,
    chapters: [
      { no: "Ch.2101", title: "Trở thành ông chủ tập đoàn", date: "12 tháng trước", free: false },
    ],
  },
  {
    name: "Quyển 5: Kết Cục Viên Mãn",
    range: "Chương 3.501 – 4.136",
    defaultOpen: false,
    chapters: [
      { no: "Ch.4136", title: "Hạnh phúc bên gia đình nhỏ", date: "2 giờ trước", free: true },
    ],
  },
]

export const ratingBars = [
  { star: "5 ★", pct: 74, count: 951 },
  { star: "4 ★", pct: 18, count: 231 },
  { star: "3 ★", pct: 5,  count: 64  },
  { star: "2 ★", pct: 2,  count: 25  },
  { star: "1 ★", pct: 1,  count: 13  },
]

export type Comment = {
  initial: string
  avatarBg: string
  name: string
  badge?: string
  time: string
  text: string
  likes: number
  replies: number
  liked?: boolean
}

export const comments: Comment[] = [
  {
    initial: "T", avatarBg: "linear-gradient(135deg,#1a3a6b,#1565c0)",
    name: "TieuBach2k", badge: "VIP", time: "2 giờ trước",
    text: "Chương mới nhất cực đỉnh! Cái cảnh Lý Phong lộ diện thân phận trước mặt nhà họ Trần mà tác giả viết... đọc mà người cứ nổi da gà. Đợi chương này cả tháng rồi!",
    likes: 328, replies: 12, liked: true,
  },
  {
    initial: "M", avatarBg: "linear-gradient(135deg,#004d1a,#2e7d32)",
    name: "MinhKhoi_Reader", time: "5 giờ trước",
    text: "Nói thật truyện kiểu này đọc rất dễ nghiện dù biết là cliché 😂 Lý Phong bị ức hiếp suốt 300 chương mà không lộ diện thì cũng hơi quá, nhưng khi anh ấy ra tay thì mãn nhãn thật sự. Cốt truyện đơn giản nhưng được viết tốt.",
    likes: 147, replies: 5,
  },
  {
    initial: "L", avatarBg: "linear-gradient(135deg,#4a0072,#7b1fa2)",
    name: "LinhLinhFan", badge: "Top fan", time: "hôm qua",
    text: "Mình đọc từ chương 1 lúc mới ra, giờ đã 4136 chương rồi mà vẫn theo đến tận đây. Tác giả Tiếu Ngạo Dư Sinh viết chắc tay, nhân vật phụ cũng có chiều sâu chứ không chỉ làm nền. 5 sao không tiếc!",
    likes: 89, replies: 3,
  },
  {
    initial: "H", avatarBg: "linear-gradient(135deg,#3e2600,#f57f17)",
    name: "HoangAnhDoc", time: "2 ngày trước",
    text: "Khóa chương từ chương 980 thì hơi tiếc. Nhưng mà phần miễn phí đọc cũng đủ hiểu câu chuyện rồi. Nếu thật sự muốn xem kết thì unlock thôi.",
    likes: 54, replies: 0,
  },
]

export const similarStories = [
  { title: "Thần Y Trở Lại", genre: "Đô Thị", chapters: "4.690 ch", views: "21.6M", cover: { bg: "linear-gradient(135deg,#1a3a6b,#1565c0)", emoji: "⚕️" } },
  { title: "Chàng Rể Vô Dụng Là Tiên Tôn", genre: "Trọng Sinh", chapters: "1.704 ch", views: "11.2M", cover: { bg: "linear-gradient(135deg,#1a0060,#3949ab)", emoji: "💪" } },
  { title: "Chàng Rể Bác Sĩ", genre: "Ngôn Tình", chapters: "2.431 ch", views: "9.8M", cover: { bg: "linear-gradient(135deg,#3e2600,#f57f17)", emoji: "👨‍⚕️" } },
  { title: "Người Chồng Vô Dụng Của Nữ Thần", genre: "Ngôn Tình", chapters: "5.290 ch", views: "11.2M", cover: { bg: "linear-gradient(135deg,#1b004a,#6a1b9a)", emoji: "🌸" } },
  { title: "Vương Bài Hôn Phu", genre: "Ngôn Tình", chapters: "882 ch", views: "6.3M", cover: { bg: "linear-gradient(135deg,#7f0000,#c62828)", emoji: "⚔️" } },
]

export const storyRankings = [
  { label: "BXH Ngôn Tình tháng này", rank: "#1", icon: "🏆", rankClass: "n1" },
  { label: "BXH Toàn site tuần này", rank: "#3", icon: "", rankClass: "n3" },
  { label: "BXH Hot nhất hôm nay", rank: "#1 🔥", icon: "", rankClass: "n1" },
]
