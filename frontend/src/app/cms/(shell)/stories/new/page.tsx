import Link from "next/link"
import StoryForm from "@/components/cms/stories/StoryForm"

export default function NewStoryPage() {
  return (
    <>
      <Link href="/cms/stories" className="inline-flex items-center gap-1.5 text-[13px] text-[#888] mb-4 hover:text-[#e5353e] transition-colors">
        ← Quay lại danh sách truyện
      </Link>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">Thêm truyện mới</h1>
          <p className="text-[12.5px] text-[#888] mt-0.5">Điền đầy đủ thông tin để đăng truyện</p>
        </div>
      </div>
      <StoryForm />
    </>
  )
}
