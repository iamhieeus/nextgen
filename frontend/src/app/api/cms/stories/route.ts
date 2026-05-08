import { NextRequest, NextResponse } from "next/server"
import { listStoriesCms, createStoryCms } from "@/services/cms/story.service"
import type { StoryStatus } from "@/generated/prisma"

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const result = await listStoriesCms({
      search:     sp.get("search") ?? undefined,
      status:     (sp.get("status") as StoryStatus) ?? undefined,
      categoryId: sp.get("categoryId") ? Number(sp.get("categoryId")) : undefined,
      authorId:   sp.get("authorId")   ? Number(sp.get("authorId"))   : undefined,
      page:       sp.get("page")       ? Number(sp.get("page"))       : 1,
      pageSize:   sp.get("pageSize")   ? Number(sp.get("pageSize"))   : 20,
    })
    return NextResponse.json({
      ...result,
      items: result.items.map(s => ({ ...s, chapterCount: s._count.chapters })),
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const story = await createStoryCms(body)
    return NextResponse.json(story, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
