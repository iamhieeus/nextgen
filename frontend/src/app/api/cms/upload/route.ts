import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

// Infer MIME type from file extension when browser doesn't send Content-Type
function inferType(name: string, declared: string): string {
  if (ALLOWED_TYPES.includes(declared)) return declared
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  if (ext === "png")  return "image/png"
  if (ext === "webp") return "image/webp"
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg"
  return declared
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const mimeType = inferType(file.name ?? "", file.type)

    if (!ALLOWED_TYPES.includes(mimeType)) {
      console.error("[upload] rejected type:", file.type, "name:", file.name)
      return NextResponse.json(
        { error: `Chỉ chấp nhận ảnh jpg, png, webp (nhận: ${file.type || "unknown"})` },
        { status: 400 }
      )
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Ảnh vượt quá giới hạn 2 MB" },
        { status: 400 }
      )
    }

    const extMap: Record<string, string> = { "image/png": "png", "image/webp": "webp", "image/jpeg": "jpg" }
    const ext = extMap[mimeType] ?? "jpg"
    const storyId = formData.get("storyId")?.toString() ?? "new"
    const filename = `${storyId}-${Date.now()}.${ext}`

    const uploadDir = join(process.cwd(), "public", "uploads", "covers")
    await mkdir(uploadDir, { recursive: true })

    const bytes = await file.arrayBuffer()
    await writeFile(join(uploadDir, filename), Buffer.from(bytes))

    return NextResponse.json({ url: `/uploads/covers/${filename}` })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Upload thất bại" }, { status: 500 })
  }
}
