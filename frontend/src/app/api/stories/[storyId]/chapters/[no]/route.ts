import { NextRequest } from "next/server"
import { getChapter } from "@/services/chapter.service"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ storyId: string; no: string }> }
) {
  try {
    const { storyId, no } = await params
    const chapterNo = parseInt(no, 10)

    if (isNaN(chapterNo)) {
      return Response.json({ error: "Invalid chapter number" }, { status: 400 })
    }

    const chapter = await getChapter(storyId, chapterNo)
    return Response.json({ chapter })
  } catch {
    return Response.json({ error: "Failed to fetch chapter" }, { status: 500 })
  }
}
