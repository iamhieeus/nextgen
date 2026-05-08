import { getCategories } from "@/services/home.service"

export async function GET() {
  try {
    const categories = await getCategories()
    return Response.json({ categories })
  } catch {
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
