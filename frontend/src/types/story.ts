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

export type ChapterPara = {
  type: string
  text: string
  comments?: number
}
