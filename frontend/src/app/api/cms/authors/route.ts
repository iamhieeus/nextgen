import { NextRequest, NextResponse } from "next/server"
import { listAuthors, createAuthor } from "@/services/cms/author.service"

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const result = await listAuthors({
      search:   sp.get("search")   ?? undefined,
      role:     sp.get("role")     ?? undefined,
      isActive: sp.get("isActive") !== null ? sp.get("isActive") === "true" : undefined,
      page:     sp.get("page")     ? Number(sp.get("page"))     : 1,
      pageSize: sp.get("pageSize") ? Number(sp.get("pageSize")) : 20,
    })
    return NextResponse.json(result)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const author = await createAuthor(body)
    return NextResponse.json(author, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
