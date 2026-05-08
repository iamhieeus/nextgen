import { NextResponse } from "next/server"
import { prisma as db } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await db.category.findMany({
      select: { id: true, name: true, slug: true, icon: true },
      orderBy: { sortOrder: "asc" },
    })
    return NextResponse.json(categories)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
