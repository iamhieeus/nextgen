import { NextRequest, NextResponse } from "next/server"
import { getAuthor, updateAuthor, deleteAuthor } from "@/services/cms/author.service"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const author = await getAuthor(Number(id))
    if (!author) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(author)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const author = await updateAuthor(Number(id), body)
    return NextResponse.json(author)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteAuthor(Number(id))
    return new NextResponse(null, { status: 204 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
