import Link from "next/link"
import AuthorForm from "@/components/cms/authors/AuthorForm"
import { getAuthor } from "@/services/cms/author.service"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditAuthorPage({ params }: Props) {
  const { id } = await params
  const author = await getAuthor(Number(id))

  return (
    <>
      <Link href="/cms/authors" className="inline-flex items-center gap-1.5 text-[13px] text-[#888] mb-4 hover:text-[#e5353e] transition-colors">
        ← Quay lại danh sách tác giả
      </Link>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">
            {author ? `Chỉnh sửa: ${author.penname}` : "Chỉnh sửa tác giả"}
          </h1>
          <p className="text-[12.5px] text-[#888] mt-0.5">Quản lý thông tin và bút danh tác giả</p>
        </div>
      </div>
      <AuthorForm author={author ?? undefined} />
    </>
  )
}
