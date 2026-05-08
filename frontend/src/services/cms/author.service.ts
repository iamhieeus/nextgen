import { prisma as db } from "@/lib/prisma"
import type { Prisma } from "@/generated/prisma"

export type AuthorListItem = {
  id: number
  penname: string
  realname: string
  email: string
  initial: string
  color: string
  role: string
  isActive: boolean
  viewCount: string
  joinedAt: Date
  _count: { stories: number }
}

export type AuthorDetail = AuthorListItem & {
  bio: string
  facebook: string
  twitter: string
  website: string
}

export interface AuthorFilter {
  search?: string
  role?: string
  isActive?: boolean
  page?: number
  pageSize?: number
}

export async function listAuthors(filter: AuthorFilter = {}) {
  const { search, role, isActive, page = 1, pageSize = 20 } = filter

  const where: Prisma.AuthorWhereInput = {}
  if (search) {
    where.OR = [
      { penname: { contains: search, mode: "insensitive" } },
      { realname: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }
  if (role) where.role = role
  if (isActive !== undefined) where.isActive = isActive

  const [items, total] = await Promise.all([
    db.author.findMany({
      where,
      select: {
        id: true,
        penname: true,
        realname: true,
        email: true,
        initial: true,
        color: true,
        role: true,
        isActive: true,
        viewCount: true,
        joinedAt: true,
        _count: { select: { stories: true } },
      },
      orderBy: { joinedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.author.count({ where }),
  ])

  return { items, total, page, pageSize }
}

export async function getAuthor(id: number): Promise<AuthorDetail | null> {
  return db.author.findUnique({
    where: { id },
    select: {
      id: true,
      penname: true,
      realname: true,
      email: true,
      bio: true,
      initial: true,
      color: true,
      role: true,
      isActive: true,
      viewCount: true,
      facebook: true,
      twitter: true,
      website: true,
      joinedAt: true,
      _count: { select: { stories: true } },
    },
  })
}

export type AuthorInput = {
  penname: string
  realname?: string
  email?: string
  bio?: string
  initial?: string
  color?: string
  role?: string
  isActive?: boolean
  facebook?: string
  twitter?: string
  website?: string
}

export async function createAuthor(data: AuthorInput) {
  return db.author.create({ data })
}

export async function updateAuthor(id: number, data: Partial<AuthorInput>) {
  return db.author.update({ where: { id }, data })
}

export async function deleteAuthor(id: number) {
  return db.author.delete({ where: { id } })
}
