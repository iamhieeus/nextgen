// ── Types ────────────────────────────────────────────────────────────────────

export type StoryStatus = "ONGOING" | "COMPLETED" | "HIATUS" | "DROPPED"
export type AuthorRole  = "AUTHOR"  | "ADMIN"

export interface Author {
  id:       number
  penname:  string
  realname: string
  email:    string
  bio:      string
  initial:  string
  color:    string
  stories:  number
  views:    string
  joined:   string
  status:   "active" | "inactive"
  role:     AuthorRole
  facebook: string
  twitter:  string
  website:  string
}

export interface Story {
  id:       number
  title:    string
  author:   string
  category: string
  chapters: number
  status:   StoryStatus
  rating:   number
  bg:       string
  emoji:    string
}

export interface Chapter {
  no:          number
  title:       string
  volume:      string
  free:        boolean
  published:   boolean
  words:       string
  publishedAt: string | null
}

export interface Category {
  icon:    string
  name:    string
  slug:    string
  stories: number
  order:   number
}

export interface CmsUser {
  initial: string
  color:   string
  name:    string
  email:   string
  role:    "ADMIN" | "AUTHOR" | "READER"
  joined:  string
}

// ── Mock Data ────────────────────────────────────────────────────────────────

export const AUTHORS: Author[] = [
  { id:1, penname:"Thiên Tằm Thổ Đậu", realname:"Nguyễn Văn Bình",  email:"thientam@email.com",  bio:"Tác giả của nhiều bộ truyện tiên hiệp đình đám. Bắt đầu viết từ năm 2018, chuyên về thể loại tu tiên với những tình tiết hành động mãn nhãn và thế giới quan phong phú.", initial:"T", color:"#8b5cf6", stories:5, views:"12.4M", joined:"12/03/2019", status:"active", role:"AUTHOR", facebook:"thientam.truyen", twitter:"", website:"https://thientam.vn" },
  { id:2, penname:"Lạc Địa Thành Phong",realname:"Trần Thị Lan",     email:"lacdia@email.com",    bio:"Chuyên gia ngôn tình và huyền huyễn kết hợp. Các tác phẩm nổi bật với những nhân vật nữ mạnh mẽ, tình cảm sâu sắc và plot twist bất ngờ.", initial:"L", color:"#0ea5e9", stories:3, views:"8.7M",  joined:"05/07/2020", status:"active", role:"AUTHOR", facebook:"", twitter:"lacdia_author", website:"" },
  { id:3, penname:"Mặc Mặc Sắc",        realname:"Phạm Hữu Dũng",    email:"macmacsac@email.com", bio:"Tác giả kỳ cựu, viết truyện từ những ngày đầu của web novel Việt Nam. Nổi tiếng với bút pháp mô tả thiên nhiên tinh tế và triết lý sống sâu sắc.", initial:"M", color:"#18a55b", stories:8, views:"24.1M", joined:"20/01/2017", status:"active", role:"AUTHOR", facebook:"macmacsac.official", twitter:"", website:"" },
  { id:4, penname:"Vũ Thuỵ",            realname:"Lê Đức Thịnh",     email:"vuthuy@email.com",    bio:"Tác giả trẻ năng động. Chuyên thể loại đô thị hiện đại và xuyên không. Được yêu thích bởi lối viết trẻ trung, hài hước.", initial:"V", color:"#f59e0b", stories:4, views:"5.2M",  joined:"14/09/2022", status:"active", role:"AUTHOR", facebook:"", twitter:"vuthuy_writes", website:"" },
  { id:5, penname:"Linh Vũ",            realname:"",                  email:"lingvu@email.com",    bio:"Đam mê khoa học viễn tưởng và hệ thống. Các truyện thường có world-building chi tiết và hệ thống tu luyện độc đáo.", initial:"L", color:"#e5353e", stories:2, views:"3.8M",  joined:"30/11/2023", status:"active", role:"AUTHOR", facebook:"", twitter:"", website:"" },
  { id:6, penname:"Bạch Ngọc",          realname:"Hoàng Bảo Châu",   email:"bachngoc@email.com",  bio:"Tác giả ngôn tình lãng mạn. Được độc giả yêu mến vì cách xây dựng tình cảm tự nhiên và kết thúc có hậu.", initial:"B", color:"#ec4899", stories:3, views:"6.9M",  joined:"08/04/2021", status:"inactive", role:"AUTHOR", facebook:"bachngoc.novel", twitter:"", website:"" },
]

export const STORIES: Story[] = [
  { id:1, title:"Chiến Thần Bất Diệt", author:"Thiên Tằm Thổ Đậu",  category:"Tiên hiệp",   chapters:412, status:"ONGOING",   rating:4.8, bg:"#fde68a", emoji:"⚔️" },
  { id:2, title:"Dạ Ma Hoàng Phi",     author:"Lạc Địa Thành Phong", category:"Ngôn tình",   chapters:88,  status:"ONGOING",   rating:4.6, bg:"#ddd6fe", emoji:"🌙" },
  { id:3, title:"Thảo Dược Sư Độc Tôn",author:"Mặc Mặc Sắc",        category:"Huyền huyễn", chapters:204, status:"HIATUS",    rating:4.5, bg:"#bbf7d0", emoji:"🌿" },
  { id:4, title:"Đế Bá Thiên Hạ",      author:"Vũ Thuỵ",             category:"Tiên hiệp",   chapters:892, status:"COMPLETED", rating:4.9, bg:"#fecaca", emoji:"👑" },
  { id:5, title:"Hệ Thống Tu Tiên",    author:"Linh Vũ",             category:"Huyền huyễn", chapters:331, status:"ONGOING",   rating:4.3, bg:"#bfdbfe", emoji:"🤖" },
  { id:6, title:"Nữ Đế Chi Đạo",       author:"Bạch Ngọc",           category:"Ngôn tình",   chapters:156, status:"COMPLETED", rating:4.7, bg:"#fcd34d", emoji:"🌸" },
]

export const CHAPTERS: Chapter[] = [
  { no:412, title:"Thiên Kiếm Xuất Thế",          volume:"Quyển 4", free:true,  published:true,  words:"3.240", publishedAt:"14/04/2026 10:32:05" },
  { no:411, title:"Kiếm Thần Giáng Thế",           volume:"Quyển 4", free:true,  published:true,  words:"2.890", publishedAt:"12/04/2026 08:15:44" },
  { no:410, title:"Đại Chiến Bắt Đầu",             volume:"Quyển 4", free:true,  published:true,  words:"3.100", publishedAt:"10/04/2026 20:07:18" },
  { no:409, title:"Bí Mật Huyết Mạch",             volume:"Quyển 3", free:false, published:true,  words:"2.750", publishedAt:"08/04/2026 09:00:00" },
  { no:408, title:"Cổ Thần Tàn Tích",              volume:"Quyển 3", free:false, published:true,  words:"3.450", publishedAt:"06/04/2026 14:22:33" },
  { no:407, title:"Âm Mưu Hắc Ám",                volume:"Quyển 3", free:false, published:true,  words:"2.600", publishedAt:"04/04/2026 11:58:09" },
  { no:406, title:"Hội Ngộ Tiên Nhân",             volume:"Quyển 3", free:false, published:false, words:"1.820", publishedAt:null },
  { no:405, title:"[Nháp] Chương chưa hoàn thành", volume:"Quyển 3", free:false, published:false, words:"—",     publishedAt:null },
]

export const CATEGORIES: Category[] = [
  { icon:"⚔️", name:"Tiên hiệp",   slug:"tien-hiep",   stories:18, order:1 },
  { icon:"🌌", name:"Huyền huyễn", slug:"huyen-huyen", stories:14, order:2 },
  { icon:"🏙️", name:"Đô thị",      slug:"do-thi",      stories:9,  order:3 },
  { icon:"💕", name:"Ngôn tình",   slug:"ngon-tinh",   stories:7,  order:4 },
]

export const CMS_USERS: CmsUser[] = [
  { initial:"A", color:"#e5353e", name:"Nguyễn Admin",  email:"admin@camdiatruyen.vn",  role:"ADMIN",  joined:"01/01/2024" },
  { initial:"T", color:"#8b5cf6", name:"Thiên Tằm",     email:"thientam@email.com",     role:"AUTHOR", joined:"15/03/2024" },
  { initial:"L", color:"#0ea5e9", name:"Lạc Địa",       email:"lacdia@email.com",       role:"AUTHOR", joined:"22/05/2024" },
  { initial:"N", color:"#64748b", name:"Nguyễn Văn A",  email:"nguyenvana@gmail.com",   role:"READER", joined:"10/06/2024" },
]

export const AVATAR_COLORS = [
  "#e5353e","#8b5cf6","#0ea5e9","#18a55b",
  "#f59e0b","#ec4899","#0d9488","#6366f1",
  "#ef4444","#64748b",
]

export const DEMO_CHAPTER_CONTENT = `Trên đỉnh Thiên Kiếm Phong, mây mù bao phủ, gió lớn cuốn qua từng vách đá cheo leo. Lâm Phong đứng thẳng, mắt nhìn về phương xa, trái tim rỗng tuếch như bầu trời vô tận trước mặt.

Đã mười năm từ ngày hắn rời khỏi Kiếm Tông, mười năm lưu lạc giang hồ, nếm trải đủ mọi khổ cực của cuộc đời. Và giờ đây, hắn trở về — không phải với tư cách một kẻ bại trận, mà là với sức mạnh có thể chấn động cả thiên địa.

---

"Lâm Phong!" Giọng nói quen thuộc vang lên từ sau lưng khiến hắn giật mình. Xoay người lại, hắn thấy Trần Tiểu Nguyệt — người con gái mà hắn đã thề sẽ bảo vệ — đang đứng cách đó chừng mười bước, mắt đỏ hoe.

Hắn không nói gì. Chỉ mở rộng vòng tay, và cô lao vào lòng hắn.

[ps] Chương tiếp theo sẽ ra vào thứ Hai. Mọi người đón đọc nhé! Cảm ơn đã ủng hộ truyện suốt thời gian qua 💙`
