-- =============================================================================
-- CẤM ĐỊA – init.sql
-- Tạo bảng (snake_case) và insert dữ liệu mẫu từ mock data
-- Chạy: psql -U postgres -d camdia -f prisma/init.sql
-- =============================================================================

-- Enums
DO $$ BEGIN
  CREATE TYPE "StoryStatus" AS ENUM ('ONGOING', 'COMPLETED', 'HIATUS', 'DROPPED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS category (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  slug       TEXT NOT NULL UNIQUE,
  icon       TEXT NOT NULL DEFAULT '',
  count      TEXT NOT NULL DEFAULT '',
  sort_order INT  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS author (
  id         SERIAL PRIMARY KEY,
  penname    VARCHAR(120) UNIQUE NOT NULL,
  realname   VARCHAR(120) NOT NULL DEFAULT '',
  email      VARCHAR(200) NOT NULL DEFAULT '',
  bio        TEXT         NOT NULL DEFAULT '',
  initial    VARCHAR(4)   NOT NULL DEFAULT '',
  color      VARCHAR(20)  NOT NULL DEFAULT '#e5353e',
  role       VARCHAR(20)  NOT NULL DEFAULT 'AUTHOR',
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  view_count VARCHAR(30)  NOT NULL DEFAULT '0',
  facebook   VARCHAR(200) NOT NULL DEFAULT '',
  twitter    VARCHAR(200) NOT NULL DEFAULT '',
  website    VARCHAR(200) NOT NULL DEFAULT '',
  joined_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS story (
  id              SERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  author          TEXT NOT NULL,
  author_id       INT  REFERENCES author(id),
  synopsis        TEXT NOT NULL DEFAULT '',
  cover_bg        TEXT NOT NULL DEFAULT '',
  cover_emoji     TEXT NOT NULL DEFAULT '',
  status          "StoryStatus" NOT NULL DEFAULT 'ONGOING',
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  view_count      TEXT NOT NULL DEFAULT '0',
  chapter_count   INT NOT NULL DEFAULT 0,
  word_count      TEXT NOT NULL DEFAULT '',
  rating_avg      FLOAT NOT NULL DEFAULT 0,
  rating_count    INT NOT NULL DEFAULT 0,
  bookmark_count  TEXT NOT NULL DEFAULT '0',
  update_schedule TEXT NOT NULL DEFAULT '',
  category_id     INT NOT NULL REFERENCES category(id)
);
CREATE INDEX IF NOT EXISTS idx_story_category ON story(category_id);
CREATE INDEX IF NOT EXISTS idx_story_author   ON story(author_id);
CREATE INDEX IF NOT EXISTS idx_story_featured  ON story(is_featured);
CREATE INDEX IF NOT EXISTS idx_story_status    ON story(status);

-- Safe migration: add author_id to existing story tables created before this version
DO $$ BEGIN
  ALTER TABLE story ADD COLUMN author_id INT REFERENCES author(id);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS story_tag (
  id       SERIAL PRIMARY KEY,
  story_id INT  NOT NULL REFERENCES story(id) ON DELETE CASCADE,
  label    TEXT NOT NULL,
  UNIQUE (story_id, label)
);
CREATE INDEX IF NOT EXISTS idx_story_tag ON story_tag(story_id);

CREATE TABLE IF NOT EXISTS similar_story (
  story_id   INT NOT NULL REFERENCES story(id) ON DELETE CASCADE,
  similar_id INT NOT NULL REFERENCES story(id) ON DELETE CASCADE,
  PRIMARY KEY (story_id, similar_id)
);

DO $$ BEGIN
  ALTER TABLE story ADD COLUMN cover_image TEXT NOT NULL DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS story_category (
  story_id    INT NOT NULL REFERENCES story(id)    ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES category(id) ON DELETE CASCADE,
  PRIMARY KEY (story_id, category_id)
);
CREATE INDEX IF NOT EXISTS idx_story_category_story ON story_category(story_id);
CREATE INDEX IF NOT EXISTS idx_story_category_cat   ON story_category(category_id);

CREATE TABLE IF NOT EXISTS volume (
  id           SERIAL PRIMARY KEY,
  story_id     INT  NOT NULL REFERENCES story(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  range        TEXT NOT NULL,
  sort_order   INT  NOT NULL DEFAULT 0,
  default_open BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_volume_story ON volume(story_id);

CREATE TABLE IF NOT EXISTS chapter (
  id           SERIAL PRIMARY KEY,
  story_id     INT  NOT NULL REFERENCES story(id) ON DELETE CASCADE,
  volume_id    INT  REFERENCES volume(id),
  chapter_no   INT  NOT NULL,
  title        TEXT NOT NULL,
  word_count   TEXT NOT NULL DEFAULT '',
  is_free      BOOLEAN NOT NULL DEFAULT TRUE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  view_count   TEXT NOT NULL DEFAULT '0',
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (story_id, chapter_no)
);
CREATE INDEX IF NOT EXISTS idx_chapter_story ON chapter(story_id);

CREATE TABLE IF NOT EXISTS chapter_paragraph (
  id            SERIAL PRIMARY KEY,
  chapter_id    INT  NOT NULL REFERENCES chapter(id) ON DELETE CASCADE,
  sort_order    INT  NOT NULL,
  type          TEXT NOT NULL DEFAULT 'normal',
  text          TEXT NOT NULL,
  comment_count INT  NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_para_chapter ON chapter_paragraph(chapter_id);

CREATE TABLE IF NOT EXISTS comment (
  id         SERIAL PRIMARY KEY,
  story_id   INT REFERENCES story(id) ON DELETE CASCADE,
  chapter_id INT REFERENCES chapter(id) ON DELETE CASCADE,
  initial    TEXT NOT NULL,
  avatar_bg  TEXT NOT NULL,
  name       TEXT NOT NULL,
  badge      TEXT,
  text       TEXT NOT NULL,
  likes      INT NOT NULL DEFAULT 0,
  replies    INT NOT NULL DEFAULT 0,
  liked      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_comment_story   ON comment(story_id);
CREATE INDEX IF NOT EXISTS idx_comment_chapter ON comment(chapter_id);

CREATE TABLE IF NOT EXISTS rating (
  id       SERIAL PRIMARY KEY,
  story_id INT  NOT NULL REFERENCES story(id) ON DELETE CASCADE,
  star     TEXT NOT NULL,
  pct      INT  NOT NULL,
  count    INT  NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rating_story ON rating(story_id);

CREATE TABLE IF NOT EXISTS story_ranking (
  id         SERIAL PRIMARY KEY,
  story_id   INT  NOT NULL REFERENCES story(id) ON DELETE CASCADE,
  label      TEXT NOT NULL,
  rank       TEXT NOT NULL,
  icon       TEXT NOT NULL DEFAULT '',
  rank_class TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_story_ranking ON story_ranking(story_id);

CREATE TABLE IF NOT EXISTS rank_list (
  id    SERIAL PRIMARY KEY,
  type  TEXT NOT NULL,
  title TEXT NOT NULL,
  genre TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ranklist_type ON rank_list(type);

CREATE TABLE IF NOT EXISTS slide (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  "desc"     TEXT NOT NULL,
  author     TEXT NOT NULL,
  chapters   TEXT NOT NULL,
  views      TEXT NOT NULL,
  bg         TEXT NOT NULL,
  emoji      TEXT NOT NULL,
  sort_order INT  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS slide_tag (
  id       SERIAL PRIMARY KEY,
  slide_id INT  NOT NULL REFERENCES slide(id) ON DELETE CASCADE,
  label    TEXT NOT NULL,
  color    TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS hot_story (
  id       SERIAL PRIMARY KEY,
  rank     INT  NOT NULL,
  title    TEXT NOT NULL,
  genres   TEXT NOT NULL,
  chapters TEXT NOT NULL,
  bg       TEXT NOT NULL,
  emoji    TEXT NOT NULL,
  href     TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS updated_story (
  id             SERIAL PRIMARY KEY,
  title          TEXT NOT NULL,
  latest_chapter TEXT NOT NULL,
  latest_title   TEXT NOT NULL,
  time           TEXT NOT NULL,
  cover_bg       TEXT NOT NULL,
  cover_emoji    TEXT NOT NULL,
  is_new         BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order     INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS completed_story (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  genre_info TEXT NOT NULL,
  cover_bg   TEXT NOT NULL,
  cover_emoji TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sidebar_top_story (
  id          SERIAL PRIMARY KEY,
  rank        INT  NOT NULL,
  title       TEXT NOT NULL,
  sub         TEXT NOT NULL,
  cover_bg    TEXT NOT NULL,
  cover_emoji TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS featured_author (
  id       SERIAL PRIMARY KEY,
  rank     INT  NOT NULL,
  name     TEXT NOT NULL,
  sub      TEXT NOT NULL,
  cover_bg TEXT NOT NULL
);

-- =============================================================================
-- INSERT DỮ LIỆU MẪU
-- =============================================================================

-- ─── category ─────────────────────────────────────────────────────────────────
INSERT INTO category (name, slug, icon, count, sort_order) VALUES
  ('Tiên Hiệp',    'tien-hiep',    '⚔️',  '8.241 bộ',  1),
  ('Kiếm Hiệp',    'kiem-hiep',    '🗡️',  '4.132 bộ',  2),
  ('Ngôn Tình',    'ngon-tinh',    '🌹',  '12.544 bộ', 3),
  ('Đam Mỹ',       'dam-my',       '💙',  '6.318 bộ',  4),
  ('Bách Hợp',     'bach-hop',     '🌸',  '2.104 bộ',  5),
  ('Quan Trường',  'quan-truong',  '🏛️',  '1.876 bộ',  6),
  ('Võng Du',      'vong-du',      '🎮',  '3.210 bộ',  7),
  ('Khoa Huyễn',   'khoa-huyen',   '🚀',  '2.890 bộ',  8),
  ('Hệ Thống',     'he-thong',     '⚙️',  '5.442 bộ',  9),
  ('Huyền Huyễn',  'huyen-huyen',  '🔮',  '9.103 bộ',  10),
  ('Dị Giới',      'di-gioi',      '🌍',  '4.567 bộ',  11),
  ('Dị Năng',      'di-nang',      '⚡',  '3.012 bộ',  12),
  ('Quân Sự',      'quan-su',      '🪖',  '1.234 bộ',  13),
  ('Lịch Sử',      'lich-su',      '📜',  '2.788 bộ',  14),
  ('Xuyên Không',  'xuyen-khong',  '⏳',  '7.891 bộ',  15),
  ('Xuyên Nhanh',  'xuyen-nhanh',  '⚡',  '4.320 bộ',  16),
  ('Trọng Sinh',   'trong-sinh',   '🔄',  '6.543 bộ',  17),
  ('Trinh Thám',   'trinh-tham',   '🔍',  '1.890 bộ',  18),
  ('Linh Dị',      'linh-di',      '👻',  '2.345 bộ',  19),
  ('Ngược',        'nguoc',        '😭',  '3.102 bộ',  20),
  ('Sắc',          'sac',          '💋',  '8.920 bộ',  21),
  ('Sủng',         'sung',         '💕',  '7.654 bộ',  22),
  ('Cung Đấu',     'cung-dau',     '👑',  '2.210 bộ',  23),
  ('Nữ Cường',     'nu-cuong',     '💪',  '4.432 bộ',  24),
  ('Gia Đấu',      'gia-dau',      '🏠',  '1.987 bộ',  25),
  ('Đông Phương',  'dong-phuong',  '🏯',  '3.321 bộ',  26),
  ('Đô Thị',       'do-thi',       '🏙️',  '11.234 bộ', 27),
  ('Điền Văn',     'dien-van',     '🌾',  '2.109 bộ',  28),
  ('Mạt Thế',      'mat-the',      '☣️',  '3.456 bộ',  29),
  ('Light Novel',  'light-novel',  '📚',  '1.543 bộ',  30),
  ('Đoản Văn',     'doan-van',     '✍️',  '5.678 bộ',  31),
  ('Hiện Đại',     'hien-dai',     '💼',  '9.876 bộ',  32)
ON CONFLICT (slug) DO NOTHING;

-- ─── author ───────────────────────────────────────────────────────────────────
INSERT INTO author (penname, realname, email, bio, initial, color, role, is_active, view_count, facebook, twitter, website)
VALUES
  ('Tiếu Ngạo Dư Sinh', 'Nguyễn Văn An',  'tieungao@gmail.com',
   'Tác giả chuyên thể loại ngôn tình và đô thị, nổi tiếng với series Chàng Rể.',
   'T', '#c62828', 'AUTHOR', TRUE, '48.2M', '', '', ''),
  ('Tiểu Tịnh',         'Trần Thị Bình',  'tieuting@gmail.com',
   'Tác giả chuyên đô thị hiện đại, đặc biệt về đề tài y học.',
   'T', '#1565c0', 'AUTHOR', TRUE, '31.5M', '', '', ''),
  ('Lục Như Hòa Thượng','Lê Minh Cường',  'lucnhu@gmail.com',
   'Tác giả tiên hiệp hàng đầu, nổi bật với bộ Lục Địa Kiện Tiên.',
   'L', '#1b5e20', 'AUTHOR', TRUE, '18.9M', '', '', ''),
  ('Loạn',              '',               'loan@gmail.com',
   'Tác giả huyền huyễn, sở trường viết game và phép thuật.',
   'L', '#4a148c', 'AUTHOR', TRUE, '15.4M', '', '', ''),
  ('Linh Linh',         'Phạm Thị Lan',   'linhlinhauthor@gmail.com',
   'Tác giả ngôn tình lãng mạn, chuyên đề tài tổng giám đốc và tình yêu hiện đại.',
   'L', '#880e4f', 'AUTHOR', TRUE, '14.2M', '', '', ''),
  ('Phàm Nhân Nhậm',    '',               'phamnnhan@gmail.com',
   'Tác giả lịch sử và tiên hiệp kết hợp.',
   'P', '#bf360c', 'AUTHOR', TRUE, '10.1M', '', '', ''),
  ('Liễu Thăng Thăng',  '',               '',
   '',
   'L', '#6a1b9a', 'AUTHOR', TRUE, '7.4M',  '', '', ''),
  ('Ss Tần',            '',               '',
   '',
   'S', '#3949ab', 'AUTHOR', TRUE, '0',     '', '', '')
ON CONFLICT (penname) DO UPDATE SET
  realname   = EXCLUDED.realname,
  email      = EXCLUDED.email,
  bio        = EXCLUDED.bio,
  initial    = EXCLUDED.initial,
  color      = EXCLUDED.color,
  view_count = EXCLUDED.view_count;

-- ─── story ────────────────────────────────────────────────────────────────────
INSERT INTO story (title, slug, author, author_id, synopsis, cover_bg, cover_emoji, status, is_featured,
                   view_count, chapter_count, word_count, rating_avg, rating_count,
                   bookmark_count, update_schedule, category_id)
SELECT s.title, s.slug, s.author, (SELECT id FROM author WHERE penname = s.author),
       s.synopsis, s.cover_bg, s.cover_emoji,
       s.status::"StoryStatus", s.is_featured, s.view_count, s.chapter_count,
       s.word_count, s.rating_avg, s.rating_count, s.bookmark_count, s.update_schedule,
       c.id
FROM (VALUES
  ('Chàng Rể Chiến Thần','chang-re-chien-than','Tiếu Ngạo Dư Sinh',
   'Lý Phong — một chàng trai bình thường lấy vợ giàu và bị cả gia đình nhà vợ khinh thường. Nhưng không ai biết rằng, anh chính là Chiến Thần số một của liên minh phương Đông.',
   'linear-gradient(135deg,#7f0000,#c62828)','🌹','ONGOING',TRUE,'18.3M',4136,'8.2M',4.7,1284,'1.2M','Hàng ngày','Ngôn Tình'),
  ('Thần Y Trở Lại','than-y-tro-lai','Tiểu Tịnh',
   'Thần y huyền thoại trở về sau nhiều năm ẩn tích. Vừa xuất hiện đã lập tức chấn động y giới.',
   'linear-gradient(135deg,#1a3a6b,#1565c0)','⚕️','ONGOING',TRUE,'21.6M',4690,'',0,0,'','','Đô Thị'),
  ('Toàn Chức Pháp Sư','toan-chuc-phap-su','Loạn',
   'Thế giới game online nơi phép thuật và chiến đấu là tất cả. Một game thủ thiên tài tái sinh với ký ức của kiếp trước.',
   'linear-gradient(135deg,#004d1a,#1b5e20)','🏆','ONGOING',TRUE,'15.4M',3137,'',0,0,'','','Huyền Huyễn'),
  ('Lục Địa Kiện Tiên','luc-dia-kien-tien','Lục Như Hòa Thượng',
   'Tại đại lục phồn hoa, vạn tộc tranh hùng, tiên đạo xưng bá. Một thanh niên bình thường từ Trái Đất xuyên qua.',
   'linear-gradient(135deg,#1a1040,#3d1a6b)','⚔️','ONGOING',TRUE,'12.8M',2554,'',0,0,'','','Tiên Hiệp'),
  ('Người Tình Của Lý Tổng','nguoi-tinh-cua-ly-tong','Linh Linh',
   'Cô ấy chỉ là một cô gái bình thường, anh ấy là tổng giám đốc quyền lực nhất thành phố.',
   'linear-gradient(135deg,#7f0000,#c62828)','🌹','COMPLETED',FALSE,'8.2M',395,'',0,0,'','','Ngôn Tình'),
  ('Chuyển Sinh Thành Liễu Đột Biến','chuyen-sinh-thanh-lieu-dot-bien','Ẩn danh',
   'Sau khi chết trong thế giới tận thế, anh ta tỉnh dậy trong cơ thể một cây liễu đột biến.',
   'linear-gradient(135deg,#0d2b5e,#1565c0)','🕵️','ONGOING',FALSE,'9.1M',4099,'',0,0,'','','Trọng Sinh'),
  ('Chàng Rể Vô Dụng Là Tiên Tôn','chang-re-vo-dung-la-tien-ton','Ẩn danh',
   'Bị cả nhà vợ khinh thường, nhưng thực ra là Tiên Tôn tái thế.',
   'linear-gradient(135deg,#1a0060,#3949ab)','💪','ONGOING',FALSE,'11.2M',1704,'',0,0,'','','Trọng Sinh'),
  ('Chàng Rể Bác Sĩ','chang-re-bac-si','Ẩn danh',
   'Bác sĩ thiên tài ẩn mình trong vai người chồng vô dụng.',
   'linear-gradient(135deg,#3e2600,#f57f17)','👨‍⚕️','ONGOING',FALSE,'9.8M',2431,'',0,0,'','','Ngôn Tình'),
  ('Người Chồng Vô Dụng Của Nữ Thần','nguoi-chong-vo-dung-cua-nu-than','Ẩn danh',
   'Người chồng bí ẩn đứng sau người vợ nổi tiếng.',
   'linear-gradient(135deg,#1b004a,#6a1b9a)','🌟','COMPLETED',FALSE,'11.2M',5290,'',0,0,'','','Ngôn Tình'),
  ('Võng Du Tam Quốc: Thăng Cấp Dòng','vong-du-tam-quoc-thang-cap-dong','Ẩn danh',
   'Game thủ xuyên vào thế giới Tam Quốc, tu luyện và xưng bá.',
   'linear-gradient(135deg,#004030,#00695c)','🎮','ONGOING',FALSE,'0',381,'',0,0,'','','Võng Du'),
  ('Từ Tam Quốc Bắt Đầu Tu Tiên','tu-tam-quoc-bat-dau-tu-tien','Phàm Nhân Nhậm',
   'Xuyên đến thời Tam Quốc loạn lạc, phát hiện thiên địa có linh khí, tu tiên có thể thành tiên.',
   'linear-gradient(135deg,#3e1200,#bf360c)','🔮','ONGOING',FALSE,'3.2M',479,'',0,0,'','','Lịch Sử'),
  ('Tinh Tế Rách Nát Nữ Vương','tinh-te-rach-nat-nu-vuong','Liễu Thăng Thăng',
   'Cô bị phản bội, bị cướp đoạt tất cả. Khi tái sinh, cô không còn là cô gái ngây thơ.',
   'linear-gradient(135deg,#1b004a,#6a1b9a)','🌸','ONGOING',FALSE,'7.4M',2925,'',0,0,'','','Nữ Cường'),
  ('Rể Ngoan Xuống Núi, Tu Thành Chính Quả','re-ngoan-xuong-nui','Ss Tần',
   'Sau nhiều năm tu luyện trên núi, xuống núi đối mặt với thế giới.',
   'linear-gradient(135deg,#1a0d40,#3949ab)','🧙','COMPLETED',FALSE,'0',1477,'',0,0,'','','Kiếm Hiệp'),
  ('Toàn Dân Hải Đảo Cầu Sinh','toan-dan-hai-dao-cau-sinh','Ẩn danh',
   'Cả thế giới bị đưa đến hải đảo sinh tồn trong tận thế.',
   'linear-gradient(135deg,#002a3a,#00838f)','🕵️','ONGOING',FALSE,'0',198,'',0,0,'','','Mạt Thế'),
  ('Trọng Sinh Thành Đại Tiểu Thư Nhà Giàu','trong-sinh-thanh-dai-tieu-thu','Ẩn danh',
   'Tái sinh vào gia đình giàu có, bắt đầu cuộc sống mới.',
   'linear-gradient(135deg,#002a3a,#01579b)','🌊','COMPLETED',FALSE,'0',318,'',0,0,'','','Trọng Sinh'),
  ('Xuyên Thành Tiểu Thư Phản Diện','xuyen-thanh-tieu-thu-phan-dien','Ẩn danh',
   'Xuyên vào thân xác nhân vật phản diện trong tiểu thuyết.',
   'linear-gradient(135deg,#004030,#00695c)','📜','COMPLETED',FALSE,'0',422,'',0,0,'','','Xuyên Không'),
  ('Ngôn Tình Tổng Giám Đốc: Yêu Em Từ Khi Nào','ngon-tinh-tong-giam-doc','Ẩn danh',
   'Tổng giám đốc lạnh lùng và cô gái bình thường.',
   'linear-gradient(135deg,#3e1200,#bf360c)','🌺','COMPLETED',FALSE,'0',280,'',0,0,'','','Ngôn Tình'),
  ('Binh Vương Và Bảy Chị Gái Cực Phẩm','binh-vuong-va-bay-chi-gai','Ẩn danh',
   'Binh vương trở về, bảy chị gái xuất hiện.',
   'linear-gradient(135deg,#1a0d40,#3949ab)','💪','ONGOING',FALSE,'0',0,'',0,0,'','','Đô Thị'),
  ('Vương Bài Hôn Phu','vuong-bai-hon-phu','Ẩn danh',
   'Hôn ước bí ẩn với người đàn ông quyền lực.',
   'linear-gradient(135deg,#7f0000,#c62828)','⚔️','COMPLETED',FALSE,'6.3M',882,'',0,0,'','','Ngôn Tình'),
  ('Tiên Lộ Bình Thường','tien-lo-binh-thuong','Ẩn danh',
   'Con đường tu tiên bình thường nhưng ẩn chứa bí mật.',
   'linear-gradient(135deg,#4a0072,#7b1fa2)','✨','ONGOING',FALSE,'0',0,'',0,0,'','','Tiên Hiệp')
) AS s(title, slug, author, synopsis, cover_bg, cover_emoji, status, is_featured,
       view_count, chapter_count, word_count, rating_avg, rating_count,
       bookmark_count, update_schedule, category_name)
JOIN category c ON c.name = s.category_name
ON CONFLICT (slug) DO UPDATE SET
  author_id = EXCLUDED.author_id;

-- backfill author_id for any rows that were inserted before the author table existed
UPDATE story SET author_id = (SELECT id FROM author WHERE penname = story.author)
WHERE author_id IS NULL AND EXISTS (SELECT 1 FROM author WHERE penname = story.author);

-- ─── story_tag ────────────────────────────────────────────────────────────────
INSERT INTO story_tag (story_id, label)
SELECT s.id, t.label FROM story s, (VALUES
  ('chang-re-chien-than','#chàng-rể'),
  ('chang-re-chien-than','#chiến-thần'),
  ('chang-re-chien-than','#ẩn thân'),
  ('chang-re-chien-than','#ngôn-tình'),
  ('chang-re-chien-than','#đô-thị'),
  ('chang-re-chien-than','#cường-giả'),
  ('chang-re-chien-than','#hôn-nhân'),
  ('chang-re-chien-than','#full')
) AS t(slug, label) WHERE s.slug = t.slug
ON CONFLICT (story_id, label) DO NOTHING;

-- ─── volume ───────────────────────────────────────────────────────────────────
INSERT INTO volume (story_id, name, range, sort_order, default_open)
SELECT s.id, v.name, v.range, v.sort_order, v.default_open
FROM story s, (VALUES
  ('chang-re-chien-than','Quyển 1: Chàng Rể Bị Khinh',    'Chương 1 – 312',       1, TRUE),
  ('chang-re-chien-than','Quyển 2: Chiến Thần Thức Tỉnh',  'Chương 313 – 980',     2, FALSE),
  ('chang-re-chien-than','Quyển 3: Bá Đồ Tranh Hùng',      'Chương 981 – 2.100',   3, FALSE),
  ('chang-re-chien-than','Quyển 4: Đỉnh Cao Quyền Lực',    'Chương 2.101 – 3.500', 4, FALSE),
  ('chang-re-chien-than','Quyển 5: Kết Cục Viên Mãn',      'Chương 3.501 – 4.136', 5, FALSE)
) AS v(slug, name, range, sort_order, default_open)
WHERE s.slug = v.slug;

-- ─── chapter ──────────────────────────────────────────────────────────────────
INSERT INTO chapter (story_id, volume_id, chapter_no, title, word_count, is_free, is_published, published_at)
SELECT s.id, vol.id, c.chapter_no, c.title, c.word_count, c.is_free, TRUE,
       NOW() - (c.days_ago || ' days')::INTERVAL
FROM (VALUES
  ('chang-re-chien-than',1,1,  'Chàng Rể Ăn Bám',                               '4.687',TRUE, 1095),
  ('chang-re-chien-than',1,2,  'Bữa Cơm Khinh Bỉ',                              '',     TRUE, 1094),
  ('chang-re-chien-than',1,299,'Nhớ lại quá khứ — máu và vinh quang',           '',     TRUE, 13),
  ('chang-re-chien-than',1,300,'Lời thề với người thầy quá cố',                 '',     TRUE, 12),
  ('chang-re-chien-than',1,301,'Đêm nay, Chiến Thần trở lại',                   '',     TRUE, 11),
  ('chang-re-chien-than',1,302,'Hai năm ẩn mình kết thúc hôm nay',              '',     TRUE, 10),
  ('chang-re-chien-than',1,303,'Gã chàng rể không ai ngờ tới',                  '',     TRUE, 9),
  ('chang-re-chien-than',1,304,'Tướng quân xuất thế, vạn người kính phục',      '',     TRUE, 8),
  ('chang-re-chien-than',1,305,'Quân đoàn Hắc Phong nghe lệnh ta',              '',     TRUE, 7),
  ('chang-re-chien-than',1,306,'Một cuộc điện thoại rung chuyển cả thành phố',  '',     TRUE, 6),
  ('chang-re-chien-than',1,307,'Nhà họ Lưu sụp đổ trong đêm',                  '',     TRUE, 5),
  ('chang-re-chien-than',1,308,'Lộ diện thân phận thật',                        '',     TRUE, 4),
  ('chang-re-chien-than',1,309,'Vợ ta — không ai được động vào',                '',     TRUE, 3),
  ('chang-re-chien-than',1,310,'Đại chiến tại đỉnh tòa nhà',                    '',     TRUE, 2),
  ('chang-re-chien-than',1,311,'Ta là Chiến Thần — hãy ghi nhớ điều đó',        '',     TRUE, 1),
  ('chang-re-chien-than',1,312,'Kẻ thù cuối cùng phải quỳ',                     '',     TRUE, 0),
  ('chang-re-chien-than',2,313,'Chiến thần bước ra từ bóng tối',                '',     TRUE, 730),
  ('chang-re-chien-than',2,979,'Bí mật của tổ chức Rồng Đen',                   '',     FALSE,60),
  ('chang-re-chien-than',2,980,'Đại hội võ lâm — không ai địch nổi',            '',     TRUE, 60),
  ('chang-re-chien-than',3,981,'Thế giới ngầm run sợ',                          '',     FALSE,540),
  ('chang-re-chien-than',4,2101,'Trở thành ông chủ tập đoàn',                   '',     FALSE,365),
  ('chang-re-chien-than',5,4136,'Hạnh phúc bên gia đình nhỏ',                   '',     TRUE, 0)
) AS c(slug, vol_order, chapter_no, title, word_count, is_free, days_ago)
JOIN story s ON s.slug = c.slug
JOIN volume vol ON vol.story_id = s.id AND vol.sort_order = c.vol_order
ON CONFLICT (story_id, chapter_no) DO NOTHING;

-- ─── chapter_paragraph (chương 1) ────────────────────────────────────────────
INSERT INTO chapter_paragraph (chapter_id, sort_order, type, text, comment_count)
SELECT ch.id, p.sort_order, p.type, p.text, p.comment_count
FROM chapter ch JOIN story s ON s.id = ch.story_id
, (VALUES
  (1, 'normal','Căn phòng tối tăm ở cuối hành lang nhà họ Trần — nơi người ta thường gọi bằng cái tên mỉa mai là "phòng ở nhờ" — chỉ rộng vỏn vẹn mười mét vuông.',97),
  (2, 'normal','Bên ngoài phòng khách, tiếng chén chạm nhau lanh canh, tiếng cười nói rôm rả, mùi rượu ngoại thoang thoảng theo từng cơn gió.',43),
  (3, 'normal','"Ông anh rể nhà mày đâu rồi, Ngọc Hà? Cưới về ba năm mà không kiếm được một xu — ăn hại quá vậy!"',156),
  (4, 'normal','Đó là giọng Trần Đức Minh — em trai vợ anh — vừa nói vừa cười, không thèm hạ giọng.',28),
  (5, 'normal','Ba năm. Anh đã nghe quen những lời như vậy từ lâu rồi.',212),
  (6, 'normal','Anh đã quen với những ánh mắt khinh miệt, quen với việc bị phân công căn phòng tệ nhất.',67),
  (7, 'normal','Điện thoại trong túi quần anh rung lên. Một tin nhắn, từ số máy lạ.',89),
  (8, 'keyword','«THIẾT HUYẾT QUÂN ĐOÀN — THỐNG SOÁI YÊU CẦU TRỞ VỀ. TÌNH HUỐNG KHẨN CẤP.»',302),
  (9, 'normal','Lâm Phong đọc tin nhắn đó. Đọc một lần. Rồi khóa màn hình lại.',44),
  (10,'normal','Anh đứng dậy, bước đến cửa sổ. Bên ngoài là phố xá Giang Thành náo nhiệt.',118),
  (11,'normal','Nhưng trước cái ngày anh chấp nhận hôn ước theo lời trăng trối của người thầy quá cố — trước tất cả điều đó — anh là ai?',234),
  (12,'normal','Anh là Lâm Phong. Thống Soái Thiết Huyết — người đàn ông mà mười sáu quốc gia phải kiêng dè.',567),
  (13,'normal','Cánh cửa phòng bị đẩy mạnh ra — không gõ. Trần Đức Minh bước vào, mùi rượu nồng nặc.',143),
  (14,'normal','Lâm Phong quay đầu nhìn Đức Minh. Chỉ một cái nhìn, không nói gì.',72),
  (15,'normal','Nhưng cái nhìn đó khiến Đức Minh — dù đang ngà ngà say — tự nhiên khựng lại.',289),
  (16,'normal','"Tôi hiểu rồi." Lâm Phong nói, giọng bình thản như gió.',56),
  (17,'normal','Nhưng khi bước ra ngoài hành lang, anh lặng lẽ gõ một tin nhắn hồi âm, chỉ hai chữ.',198),
  (18,'keyword','«Tôi về.»',421),
  (19,'divider','— · —',0),
  (20,'ps','ps: Anh em ủng hộ mình với nhé! Nếu thấy hay, thả tim và theo dõi để không bỏ lỡ chương mới.',0)
) AS p(sort_order, type, text, comment_count)
WHERE s.slug = 'chang-re-chien-than' AND ch.chapter_no = 1;

-- ─── rating ───────────────────────────────────────────────────────────────────
INSERT INTO rating (story_id, star, pct, count)
SELECT s.id, r.star, r.pct, r.count FROM story s, (VALUES
  ('chang-re-chien-than','5 ★',74,951),
  ('chang-re-chien-than','4 ★',18,231),
  ('chang-re-chien-than','3 ★', 5, 64),
  ('chang-re-chien-than','2 ★', 2, 25),
  ('chang-re-chien-than','1 ★', 1, 13)
) AS r(slug, star, pct, count) WHERE s.slug = r.slug;

-- ─── story_ranking ────────────────────────────────────────────────────────────
INSERT INTO story_ranking (story_id, label, rank, icon, rank_class)
SELECT s.id, r.label, r.rank, r.icon, r.rank_class
FROM story s, (VALUES
  ('chang-re-chien-than','BXH Ngôn Tình tháng này','#1','🏆','n1'),
  ('chang-re-chien-than','BXH Toàn site tuần này', '#3','',  'n3'),
  ('chang-re-chien-than','BXH Hot nhất hôm nay',   '#1 🔥','','n1')
) AS r(slug, label, rank, icon, rank_class) WHERE s.slug = r.slug;

-- ─── comment ──────────────────────────────────────────────────────────────────
INSERT INTO comment (story_id, initial, avatar_bg, name, badge, text, likes, replies, liked)
SELECT s.id, c.initial, c.avatar_bg, c.name, c.badge, c.text, c.likes, c.replies, c.liked
FROM story s, (VALUES
  ('chang-re-chien-than','T','linear-gradient(135deg,#1a3a6b,#1565c0)','TieuBach2k','VIP',
   'Chương mới nhất cực đỉnh! Cái cảnh Lý Phong lộ diện thân phận trước mặt nhà họ Trần mà tác giả viết... đọc mà người cứ nổi da gà.',328,12,TRUE),
  ('chang-re-chien-than','M','linear-gradient(135deg,#004d1a,#2e7d32)','MinhKhoi_Reader',NULL,
   'Nói thật truyện kiểu này đọc rất dễ nghiện dù biết là cliché 😂',147,5,FALSE),
  ('chang-re-chien-than','L','linear-gradient(135deg,#4a0072,#7b1fa2)','LinhLinhFan','Top fan',
   'Mình đọc từ chương 1 lúc mới ra, giờ đã 4136 chương rồi mà vẫn theo đến tận đây. 5 sao không tiếc!',89,3,FALSE),
  ('chang-re-chien-than','H','linear-gradient(135deg,#3e2600,#f57f17)','HoangAnhDoc',NULL,
   'Khóa chương từ chương 980 thì hơi tiếc. Nhưng mà phần miễn phí đọc cũng đủ hiểu câu chuyện rồi.',54,0,FALSE)
) AS c(slug, initial, avatar_bg, name, badge, text, likes, replies, liked)
WHERE s.slug = c.slug;

-- ─── rank_list ────────────────────────────────────────────────────────────────
INSERT INTO rank_list (type, title, genre) VALUES
  ('mostRead','Chàng Rể Chiến Thần',           'Ngôn Tình'),
  ('mostRead','Thần Y Trở Lại',                'Đô Thị'),
  ('mostRead','Toàn Chức Pháp Sư',             'Huyền Huyễn'),
  ('mostRead','Người Chồng Vô Dụng Của Nữ Thần','Ngôn Tình'),
  ('mostRead','Lục Địa Kiện Tiên',             'Tiên Hiệp'),
  ('mostRead','Chàng Rể Bác Sĩ',               'Đô Thị'),
  ('mostRead','Tiên Lộ Bình Thường',            'Tiên Hiệp'),
  ('mostRead','Chàng Rể Vô Dụng Là Tiên Tôn',  'Trọng Sinh'),
  ('mostRead','Binh Vương Và Bảy Chị Gái Cực Phẩm','Đô Thị'),
  ('mostRead','Người Tình Của Lý Tổng',         'Ngôn Tình'),
  ('topRated','Rể Ngoan Xuống Núi, Tu Thành Chính Quả','Kiếm Hiệp'),
  ('topRated','Toàn Chức Pháp Sư',             'Võng Du'),
  ('topRated','Tiên Lộ Bình Thường',            'Tiên Hiệp'),
  ('topRated','Từ Tam Quốc Bắt Đầu Tu Tiên',   'Lịch Sử'),
  ('topRated','Thần Y Trở Lại',                'Đô Thị'),
  ('topRated','Chàng Rể Chiến Thần',           'Ngôn Tình'),
  ('topRated','Người Tình Của Lý Tổng',         'Ngôn Tình'),
  ('topRated','Chuyển Sinh Thành Liễu Đột Biến','Hệ Thống'),
  ('topRated','Lục Địa Kiện Tiên',             'Tiên Hiệp'),
  ('topRated','Binh Vương Và Bảy Chị Gái Cực Phẩm','Sắc'),
  ('newTrending','Võng Du Tam Quốc: Thăng Cấp Dòng','Võng Du'),
  ('newTrending','Đại Đường, Ta Mới Vừa Xuyên Qua',  'Xuyên Không'),
  ('newTrending','Tây Môn Tiên Tộc',            'Tiên Hiệp'),
  ('newTrending','Mỗi Ngày Tình Báo: Từ Rắn Nước','Dị Năng'),
  ('newTrending','Toàn Dân Hải Đảo Cầu Sinh',  'Mạt Thế'),
  ('newTrending','Tinh Tế Rách Nát Nữ Vương',   'Nữ Cường'),
  ('newTrending','Chia Tay Sau Ta Dựa Cá Mặn Bạo Hồng','Đam Mỹ'),
  ('newTrending','Bắt Đầu Triệu Hoán Lý Tầm Hoan','Hệ Thống'),
  ('newTrending','Đại Hạ Thánh Đình',           'Lịch Sử'),
  ('newTrending','Chuyển Sinh Thành Liễu Đột Biến','Trọng Sinh');

-- ─── slide ────────────────────────────────────────────────────────────────────
INSERT INTO slide (title, "desc", author, chapters, views, bg, emoji, sort_order) VALUES
  ('Lục Địa Kiện Tiên',
   'Tại đại lục phồn hoa, vạn tộc tranh hùng, tiên đạo xưng bá. Một thanh niên bình thường từ Trái Đất xuyên qua, mang theo ký ức vạn năm.',
   'Lục Như Hòa Thượng','2.554 chương','12.8M lượt đọc','linear-gradient(135deg,#1a1040,#3d1a6b)','⚔️',1),
  ('Người Tình Của Lý Tổng',
   'Cô ấy chỉ là một cô gái bình thường, anh ấy là tổng giám đốc quyền lực nhất thành phố.',
   'Linh Linh','395 chương','8.2M lượt đọc','linear-gradient(135deg,#7f0000,#c62828)','🌹',2),
  ('Toàn Chức Pháp Sư',
   'Thế giới game online nơi phép thuật và chiến đấu là tất cả. Một game thủ thiên tài tái sinh với ký ức của kiếp trước.',
   'Loạn','3.137 chương','15.4M lượt đọc','linear-gradient(135deg,#004d1a,#1b5e20)','🏆',3),
  ('Chuyển Sinh Thành Liễu Đột Biến',
   'Sau khi chết trong thế giới tận thế, anh ta tỉnh dậy trong cơ thể một cây liễu đột biến.',
   'Ẩn danh','4.099 chương','9.1M lượt đọc','linear-gradient(135deg,#0d2b5e,#1565c0)','🕵️',4);

-- ─── slide_tag ────────────────────────────────────────────────────────────────
INSERT INTO slide_tag (slide_id, label, color)
SELECT s.id, t.label, t.color FROM slide s, (VALUES
  ('Lục Địa Kiện Tiên','Tiên Hiệp',''),
  ('Lục Địa Kiện Tiên','Huyền Huyễn',''),
  ('Lục Địa Kiện Tiên','Đang Ra','green'),
  ('Người Tình Của Lý Tổng','Ngôn Tình',''),
  ('Người Tình Của Lý Tổng','Đô Thị',''),
  ('Người Tình Của Lý Tổng','Full','green'),
  ('Toàn Chức Pháp Sư','Võng Du',''),
  ('Toàn Chức Pháp Sư','Đang Ra','blue'),
  ('Chuyển Sinh Thành Liễu Đột Biến','Trọng Sinh',''),
  ('Chuyển Sinh Thành Liễu Đột Biến','Đô Thị',''),
  ('Chuyển Sinh Thành Liễu Đột Biến','Hệ Thống','')
) AS t(title, label, color) WHERE s.title = t.title;

-- ─── hot_story ────────────────────────────────────────────────────────────────
INSERT INTO hot_story (rank, title, genres, chapters, bg, emoji, href) VALUES
  (1,'Chàng Rể Chiến Thần','Ngôn Tình · Đô Thị','4.136 ch.','linear-gradient(135deg,#7f0000,#c62828)','🌹','/stories/chang-re-chien-than'),
  (2,'Thần Y Trở Lại',      'Ngôn Tình · Đô Thị','4.690 ch.','linear-gradient(135deg,#1a3a6b,#1565c0)','⚕️',''),
  (3,'Toàn Chức Pháp Sư',   'Huyền Huyễn · Dị Giới','3.137 ch.','linear-gradient(135deg,#004d1a,#2e7d32)','🏆',''),
  (4,'Lục Địa Kiện Tiên',   'Tiên Hiệp · Sắc','2.554 ch.','linear-gradient(135deg,#4a0072,#7b1fa2)','⚔️',''),
  (5,'Chàng Rể Vô Dụng Là Tiên Tôn','Trọng Sinh · Đô Thị','1.704 ch.','linear-gradient(135deg,#1a0060,#3949ab)','💪',''),
  (6,'Chàng Rể Bác Sĩ',     'Ngôn Tình · Đô Thị','2.431 ch.','linear-gradient(135deg,#3e2600,#f57f17)','👨‍⚕️',''),
  (7,'Người Chồng Vô Dụng Của Nữ Thần','Ngôn Tình · Hiện đại','5.290 ch.','linear-gradient(135deg,#1b004a,#6a1b9a)','🌟',''),
  (8,'Toàn Chức Cao Thủ: Như Bóng Với Hình','Võng Du','248 ch.','linear-gradient(135deg,#004030,#00695c)','🎮','');

-- ─── updated_story ────────────────────────────────────────────────────────────
INSERT INTO updated_story (title, latest_chapter, latest_title, time, cover_bg, cover_emoji, is_new, sort_order) VALUES
  ('Chàng Rể Vô Dụng Là Tiên Tôn','Ch.1.704','Tiên tôn tái xuất thế gian...','15 phút','linear-gradient(135deg,#1a0060,#3949ab)','💪',TRUE,1),
  ('Chàng Rể Chiến Thần','Ch.4.136','Chiến thần hiển uy danh...','42 phút','linear-gradient(135deg,#7f0000,#c62828)','🌹',TRUE,2),
  ('Thần Y Trở Lại','Ch.4.690','Bí ẩn về huyết mạch...','1 giờ','linear-gradient(135deg,#1a3a6b,#1565c0)','⚕️',TRUE,3),
  ('Võng Du Tam Quốc: Thăng Cấp Dòng','Ch.381','Đại chiến quyết định...','2 giờ','linear-gradient(135deg,#004030,#00695c)','🎮',FALSE,4),
  ('Từ Tam Quốc Bắt Đầu Tu Tiên','Ch.479','Bí kíp cổ đại hiển thế...','3 giờ','linear-gradient(135deg,#3e1200,#bf360c)','🔮',FALSE,5),
  ('Tinh Tế Rách Nát Nữ Vương','Ch.2.925','Nữ vương phản công...','5 giờ','linear-gradient(135deg,#1b004a,#6a1b9a)','🌟',FALSE,6);

-- ─── completed_story ──────────────────────────────────────────────────────────
INSERT INTO completed_story (title, genre_info, cover_bg, cover_emoji, sort_order) VALUES
  ('Rể Ngoan Xuống Núi, Tu Thành Chính Quả','Kiếm Hiệp · 1.477 chương','linear-gradient(135deg,#1a0d40,#3949ab)','🧙',1),
  ('Người Tình Của Lý Tổng','Ngôn Tình · 395 chương','linear-gradient(135deg,#7f0000,#c62828)','🌹',2),
  ('Người Chồng Vô Dụng Của Nữ Thần','Ngôn Tình · 5.290 chương','linear-gradient(135deg,#1b004a,#6a1b9a)','🌸',3),
  ('Ngôn Tình Tổng Giám Đốc: Yêu Em Từ Khi Nào','Ngôn Tình · 280 chương','linear-gradient(135deg,#3e1200,#bf360c)','🌺',4),
  ('Xuyên Thành Tiểu Thư Phản Diện','Xuyên Không · 422 chương','linear-gradient(135deg,#004030,#00695c)','📜',5),
  ('Trọng Sinh Thành Đại Tiểu Thư Nhà Giàu','Trọng Sinh · 318 chương','linear-gradient(135deg,#002a3a,#01579b)','🌊',6);

-- ─── sidebar_top_story ────────────────────────────────────────────────────────
INSERT INTO sidebar_top_story (rank, title, sub, cover_bg, cover_emoji) VALUES
  (1,'Chàng Rể Chiến Thần',          'Ngôn Tình · 18.3M đọc','linear-gradient(135deg,#7f0000,#c62828)','🌹'),
  (2,'Thần Y Trở Lại',               'Đô Thị · 21.6M đọc',  'linear-gradient(135deg,#1a3a6b,#1565c0)','⚕️'),
  (3,'Toàn Chức Pháp Sư',            'Huyền Huyễn · 15.4M đọc','linear-gradient(135deg,#004d1a,#2e7d32)','🏆'),
  (4,'Lục Địa Kiện Tiên',            'Tiên Hiệp · 12.8M đọc','linear-gradient(135deg,#4a0072,#7b1fa2)','⚔️'),
  (5,'Người Chồng Vô Dụng Của Nữ Thần','Ngôn Tình · 11.2M đọc','linear-gradient(135deg,#1b004a,#6a1b9a)','🌸'),
  (6,'Chàng Rể Bác Sĩ',              'Đô Thị · 9.8M đọc',   'linear-gradient(135deg,#3e2600,#f57f17)','👨‍⚕️'),
  (7,'Chàng Rể Vô Dụng Là Tiên Tôn', 'Trọng Sinh · 8.5M đọc','linear-gradient(135deg,#1a0060,#3949ab)','💪');

-- ─── featured_author ──────────────────────────────────────────────────────────
INSERT INTO featured_author (rank, name, sub, cover_bg) VALUES
  (1,'Tiếu Ngạo Dư Sinh','12 bộ · 48.2M đọc','linear-gradient(135deg,#7f0000,#c62828)'),
  (2,'Tiểu Tịnh',         '8 bộ · 31.5M đọc', 'linear-gradient(135deg,#1a3a6b,#1565c0)'),
  (3,'Lục Như Hòa Thượng','5 bộ · 18.9M đọc', 'linear-gradient(135deg,#004d1a,#2e7d32)'),
  (4,'Linh Linh',          '15 bộ · 14.2M đọc','linear-gradient(135deg,#4a0072,#7b1fa2)'),
  (5,'Phàm Nhân Nhậm',     '7 bộ · 10.1M đọc', 'linear-gradient(135deg,#3e1200,#bf360c)');

-- ─── similar_story ────────────────────────────────────────────────────────────
INSERT INTO similar_story (story_id, similar_id)
SELECT a.id, b.id FROM story a, story b, (VALUES
  ('chang-re-chien-than','than-y-tro-lai'),
  ('chang-re-chien-than','chang-re-vo-dung-la-tien-ton'),
  ('chang-re-chien-than','chang-re-bac-si'),
  ('chang-re-chien-than','nguoi-chong-vo-dung-cua-nu-than'),
  ('chang-re-chien-than','vuong-bai-hon-phu')
) AS p(a, b) WHERE a.slug = p.a AND b.slug = p.b
ON CONFLICT DO NOTHING;
