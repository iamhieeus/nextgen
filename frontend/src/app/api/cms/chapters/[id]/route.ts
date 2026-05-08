import { NextRequest, NextResponse } from "next/server"
import { getChapter, updateChapter, deleteChapter } from "@/services/cms/chapter.service"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const chapter = await getChapter(Number(id))
    if (!chapter) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(chapter)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { paragraphs, ...chapterData } = body
    const chapter = await updateChapter(Number(id), chapterData, paragraphs)
    return NextResponse.json(chapter)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteChapter(Number(id))
    return new NextResponse(null, { status: 204 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
