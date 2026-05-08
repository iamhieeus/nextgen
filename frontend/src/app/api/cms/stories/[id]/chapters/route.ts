import { NextRequest, NextResponse } from "next/server"
import { listChapters, createChapter } from "@/services/cms/chapter.service"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const chapters = await listChapters(Number(id))
    return NextResponse.json(chapters)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { paragraphs, ...chapterData } = body
    const chapter = await createChapter({ ...chapterData, storyId: Number(id) }, paragraphs)
    return NextResponse.json(chapter, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
