import Link from "next/link"

type CategoryItem = { icon: string; name: string; slug: string; count: string }

export default function CategoryGrid({ categories }: { categories: CategoryItem[] }) {
  return (
    <div className="bg-white border border-[#e5e5e5]">
      <div className="flex items-center gap-2 px-[14px] pt-[10px] mb-[10px]">
        <h2 className="text-[15px] font-bold border-l-[3px] border-ac pl-2 flex-1">Khám Phá Theo Thể Loại</h2>
        <a href="#" className="text-[12px] text-[#999] hover:text-ac ml-auto whitespace-nowrap transition-colors">Tất cả thể loại →</a>
      </div>
      <div className="grid grid-cols-8 gap-[8px] px-[14px] pb-[14px]">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/search?category=${cat.slug}`}
            className="flex flex-col items-center gap-[4px] border border-[#e5e5e5] bg-white px-[8px] py-[12px] transition-all hover:border-ac hover:bg-ac-lt hover:shadow-[0_2px_6px_rgba(240,101,32,.12)] group"
          >
            <span className="text-[22px]">{cat.icon}</span>
            <span className="text-[12px] font-semibold group-hover:text-ac transition-colors">{cat.name}</span>
            <span className="text-[11px] text-[#999]">{cat.count}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
