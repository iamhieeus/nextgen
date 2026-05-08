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

export type HotItem = {
  rank: number
  title: string
  genres: string
  chapters: string
  bg: string
  emoji: string
  href?: string
}

export type RankItem = { title: string; genre: string }

export type BookCardVData = {
  title: string
  meta: string
  cover: { bg: string; emoji: string }
  badge?: { label: string; type: "hot" | "full" | "new" }
}

export type UpdateItem = {
  title: string
  latestChapter: string
  latestTitle: string
  time: string
  cover: { bg: string; emoji: string }
  isNew?: boolean
}

export type CompletedItem = {
  title: string
  genreInfo: string
  cover: { bg: string; emoji: string }
}

export type BookCardHData = {
  title: string
  tags: { label: string; highlight?: boolean }[]
  desc: string
  author: string
  chapters: string
  views: string
  cover: { bg: string; emoji: string }
}

export type CategoryItem = { icon: string; name: string; count: string }

export type SidebarTopItem = {
  rank: number
  title: string
  sub: string
  cover: { bg: string; emoji: string }
}

export type AuthorItem = {
  rank: number
  name: string
  sub: string
  cover: { bg: string }
}
