import { NextResponse } from "next/server"
import { getCmsStats } from "@/services/cms/story.service"

export async function GET() {
  try {
    const stats = await getCmsStats()
    return NextResponse.json(stats)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
