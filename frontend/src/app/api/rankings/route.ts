import { NextRequest } from "next/server"
import { getRankings } from "@/services/home.service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const type = searchParams.get("type") as "mostRead" | "topRated" | "newTrending" | null

    const rankings = await getRankings()

    if (type && type in rankings) {
      return Response.json({ rankings: rankings[type] })
    }

    return Response.json({ rankings })
  } catch {
    return Response.json({ error: "Failed to fetch rankings" }, { status: 500 })
  }
}
