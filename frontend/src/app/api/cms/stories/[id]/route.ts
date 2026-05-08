import { NextRequest, NextResponse } from "next/server"
import { getStoryCmsWithCategories, updateStoryCms, deleteStoryCms } from "@/services/cms/story.service"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const story = await getStoryCmsWithCategories(Number(id))
    if (!story) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(story)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const story = await updateStoryCms(Number(id), body)
    return NextResponse.json(story)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteStoryCms(Number(id))
    return new NextResponse(null, { status: 204 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
