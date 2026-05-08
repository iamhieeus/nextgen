import { NextRequest } from "next/server"
import { getAuthorDetail } from "@/services/author.service"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const author = await getAuthorDetail(parseInt(id, 10))
  if (!author) return Response.json({ error: "Not found" }, { status: 404 })
  return Response.json({ author })
}
