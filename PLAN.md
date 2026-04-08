# Plan: Cấm Địa – Nền Tảng Đọc Truyện Online Việt Nam (Qidian-Inspired)

## Context
Build a full-stack Vietnamese web novel reading platform named **Cấm Địa** (`camdia.vn`) at `d:\MISC\nextgen`. The site is inspired by Qidian.com and metruyenchu.com.vn — targeting Vietnamese readers of tiểu thuyết mạng (web novels). Content covers all major Vietnamese web novel genres: Tiên Hiệp, Ngôn Tình, Huyền Huyễn, Đô Thị, Xuyên Không, Trọng Sinh, Hệ Thống, etc. Readers can browse, read, and bookmark stories; authors can publish serialized chapters; admins manage content.

### Brand
- **Tên**: Cấm Địa (Forbidden Zone — evokes the dangerous, treasure-filled secret realms from xianxia/tiên hiệp novels)
- **Domain**: camdia.vn
- **Tagline**: "Vùng đất của những câu chuyện huyền bí"
- **Previous name considered**: PhépMàu (rejected — too fairy-tale, not matching the Vietnamese web novel genre mix)

---

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (slate base color)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5 (Credentials + Google OAuth)
- **Client State**: Zustand (reader preferences, persisted to localStorage)
- **Search**: PostgreSQL full-text search (`tsvector` + GIN index)
- **Validation**: Zod

---

## Project Bootstrap

```bash
cd d:/MISC
npx create-next-app@latest nextgen --typescript --tailwind --app --src-dir --import-alias "@/*"
cd nextgen
npm install prisma @prisma/client next-auth@beta zustand zod bcryptjs @types/bcryptjs
npx shadcn@latest init
npx shadcn@latest add button card badge input select dialog tabs sheet avatar skeleton toast textarea dropdown-menu
npx prisma init
```

---

## Directory Structure (abbreviated)

```
src/
├── app/
│   ├── (public)/           # Site layout with header/footer
│   │   ├── page.tsx        # Homepage
│   │   ├── stories/[storyId]/chapters/[chapterId]/page.tsx  # Reader
│   │   ├── stories/[storyId]/page.tsx  # Story detail
│   │   ├── stories/page.tsx            # Browse
│   │   ├── categories/[slug]/page.tsx
│   │   ├── rankings/page.tsx
│   │   └── search/page.tsx
│   ├── (auth)/             # Minimal layout
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (user)/             # Auth-protected
│   │   ├── bookshelf/page.tsx
│   │   ├── history/page.tsx
│   │   └── profile/settings/page.tsx
│   ├── (admin)/            # Admin sidebar layout
│   │   └── admin/{page,stories,users,categories,comments}/
│   ├── api/                # Route handlers
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── stories/...
│   │   ├── categories/...
│   │   ├── rankings/route.ts
│   │   ├── search/route.ts
│   │   └── chapters/[chapterId]/{comments,progress}/route.ts
│   ├── layout.tsx           # Root: html/body + providers
│   └── globals.css
├── components/
│   ├── layout/             # Header, Footer, Sidebar, AdminSidebar, MobileNav
│   ├── home/               # HeroBanner, RankingPanel, CategoryGrid, FeaturedStories
│   ├── story/              # StoryCard, StoryGrid, StoryHeader, ChapterList, BookmarkButton
│   ├── reader/             # ReaderContainer, ReaderContent, ReaderToolbar, ReaderSettings, ReaderNav
│   ├── browse/             # FilterBar, SearchBar, SortSelect, ViewToggle, Pagination
│   ├── comments/           # CommentSection, CommentForm, CommentItem
│   ├── user/               # BookshelfGrid, HistoryList, UserMenu
│   ├── admin/              # StatsCard, DataTable, StoryForm, ChapterForm
│   └── ui/                 # shadcn re-exports
├── lib/
│   ├── prisma.ts           # Singleton Prisma client
│   ├── auth.ts             # NextAuth v5 config
│   ├── utils.ts            # cn(), formatDate(), truncate()
│   ├── validations.ts      # Zod schemas
│   └── search.ts           # Full-text search helpers
├── hooks/
│   ├── useBookmark.ts      # Toggle + optimistic UI
│   ├── useReadingProgress.ts  # Debounced scroll save
│   ├── useReaderSettings.ts   # Font/theme from localStorage
│   └── useDebounce.ts
├── store/
│   └── useReaderStore.ts   # Zustand: font, theme, size
├── types/                  # story.ts, user.ts, comment.ts, api.ts
├── constants/              # genres.ts, routes.ts, config.ts
└── middleware.ts           # Auth guards for (user) and (admin)
```

---

## Database Schema (`/prisma/schema.prisma`)

### Enums
```prisma
enum Role { READER  AUTHOR  ADMIN }
enum StoryStatus { ONGOING  COMPLETED  HIATUS  DROPPED }
enum AgeRating { ALL_AGES  TEEN  MATURE }
enum CommentTarget { STORY  CHAPTER }
```

### Core Models
| Model | Key Fields |
|---|---|
| `User` | id, email, username, passwordHash, role, avatarUrl, bio |
| `Category` | id, name, slug, color, sortOrder |
| `Story` | id, title, slug, synopsis, coverUrl, status, isFeatured, isFree, viewCount, wordCount, chapterCount (denorm), ratingAvg (denorm), bookmarkCount (denorm), searchVector (tsvector), authorId, categoryId |
| `Chapter` | id, storyId, title, slug, content, chapterNo, wordCount, isPublished, isFree, viewCount |
| `Bookmark` | userId, storyId — @@unique([userId, storyId]) |
| `ReadingProgress` | userId, storyId, chapterId, scrollPercent, lastReadAt — @@unique([userId, storyId]) |
| `Comment` | userId, content, target (STORY/CHAPTER), storyId?, chapterId?, parentId? (replies) |
| `Rating` | userId, storyId, value (1-5) — @@unique([userId, storyId]) |
| `StoryView` | storyId, userId?, ipHash, createdAt |
| `Account`, `Session`, `VerificationToken` | NextAuth tables |

**Indexes**: GIN on `searchVector`; btree on `viewCount`, `ratingAvg`, `createdAt`, `categoryId`, `authorId`, `status`, `isFeatured`.

---

## Key API Routes

| Method | Route | Auth | Notes |
|---|---|---|---|
| GET | `/api/stories` | — | `?genre=&status=&sort=views|date|rating&page=&limit=` |
| GET | `/api/stories/featured` | — | Homepage data: featured, free, rankings |
| GET | `/api/rankings` | — | `?type=trending|popular|new` |
| GET | `/api/search` | — | `?q=&genre=&status=&page=` — uses `plainto_tsquery` |
| GET | `/api/stories/[id]` | — | Story + chapter list page 1 |
| GET | `/api/stories/[id]/chapters/[cId]` | — | Chapter content + prev/next IDs |
| POST | `/api/stories/[id]/bookmark` | Auth | Toggle; updates `bookmarkCount` |
| POST | `/api/stories/[id]/rating` | Auth | Upsert rating; recalculates `ratingAvg` |
| POST | `/api/chapters/[id]/progress` | Auth | Upsert `ReadingProgress` (scrollPercent) |
| POST | `/api/stories/[id]/comments` | Auth | Story-level comment |
| POST | `/api/chapters/[id]/comments` | Auth | Chapter-level comment |

---

## Architectural Decisions

**Route Groups for Layouts**: `(public)` has site header/footer; `(auth)` is minimal; `(user)` is protected; `(admin)` has sidebar nav.

**Denormalized Counts**: `Story.chapterCount`, `viewCount`, `ratingAvg`, `bookmarkCount` stored on the row (updated via `$transaction`) to avoid COUNT joins on every render.

**Trending Rankings**: Query `StoryView` with `createdAt > now() - 7 days`, group by `storyId`, order by count. Popular = highest `viewCount`. New = newest `publishedAt`.

**Full-text Search**: PostgreSQL `tsvector` column on `Story` updated by a DB trigger. `searchVector` marked as `Unsupported("tsvector")` in Prisma; raw SQL via `prisma.$queryRaw`. GIN index for fast lookups.

**ReadingProgress Upsert**: `@@unique([userId, storyId])` — one record per user/story. Overwrites `chapterId` + `scrollPercent` on every save. Bookshelf uses this to show "Continue reading" with chapter number.

**Zustand Reader State**: Font family, font size, background theme stored in localStorage via `persist` middleware — zero database round-trips for preferences.

**Middleware Auth Guard** (`/src/middleware.ts`): Uses NextAuth `auth()`. Routes under `/(bookshelf|history|profile)` → redirect to `/login` if unauthenticated. Routes under `/admin` → redirect to `/` if `role !== ADMIN`.

---

## Implementation Phases

### Phase 1 — Foundation
Bootstrap project, install dependencies, set up Prisma schema + migrations, configure NextAuth v5 with Credentials provider, implement login/register pages, `middleware.ts`.

### Phase 2 — Core Reading Experience
Header/Footer, story browse page (`/stories`), story detail page, chapter reader (ReaderContainer + all sub-components), comment system.

### Phase 3 — Homepage & Discovery
`/api/stories/featured` endpoint, HeroBanner carousel, RankingPanel (3 tabs), CategoryGrid, `/rankings` page, `/categories` pages.

### Phase 4 — Search & User Features
PostgreSQL full-text search, SearchBar with autocomplete, bookmark toggle with optimistic UI, reading progress tracking, bookshelf page, reading history page, profile/settings.

### Phase 5 — Admin Panel
Admin dashboard with stats, DataTable component, story/chapter CRUD forms, user role management, comment moderation.

### Phase 6 — Polish
`loading.tsx` skeletons, `error.tsx` boundaries, `not-found.tsx`, OG image generation (`/opengraph-image.tsx` per story), `generateMetadata` for SEO, `sitemap.ts`, rate limiting on write endpoints, `next/image` optimization with blur placeholders.

---

## Verification Plan
1. Run `npx prisma studio` to verify all models seed correctly.
2. Register a user → login → browse stories → click into story → read chapter → verify reading progress saved.
3. Bookmark a story → check bookshelf page shows it with "Continue reading" link.
4. Search for a story title → verify ranked results appear.
5. Log in as ADMIN → access `/admin` → create a category, create a story, publish a chapter.
6. Verify middleware redirects: unauthenticated `/bookshelf` → `/login`; non-admin `/admin` → `/`.
7. Verify reader settings (font size, dark mode) persist across page refreshes (localStorage).
8. Check `Rankings` page shows different stories under Trending / Popular / New tabs.
