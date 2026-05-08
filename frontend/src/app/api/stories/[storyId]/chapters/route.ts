import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

function formatRelativeDate(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 60) return `${diffMin} phút`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH} giờ`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 30) return `${diffD} ngày trước`
  const diffM = Math.floor(diffD / 30)
  if (diffM < 12) return `${diffM} tháng trước`
  return `${Math.floor(diffM / 12)} năm trước`
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storyId: string }> }
) {
  const { storyId } = await params
  const { searchParams } = request.nextUrl
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
  const pageSize = 100

  const story = await prisma.story.findUnique({ where: { slug: storyId }, select: { id: true } })
  if (!story) return Response.json({ error: "Not found" }, { status: 404 })

  const [total, rows] = await Promise.all([
    prisma.chapter.count({ where: { storyId: story.id } }),
    prisma.chapter.findMany({
      where: { storyId: story.id },
      orderBy: { chapterNo: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { chapterNo: true, title: true, isFree: true, publishedAt: true },
    }),
  ])

  const chapters = rows.map(c => ({
    no: `Ch.${c.chapterNo}`,
    title: c.title,
    date: formatRelativeDate(c.publishedAt),
    free: c.isFree,
  }))

  return Response.json({ chapters, total, page, pageSize })
}
