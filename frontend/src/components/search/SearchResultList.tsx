import type { SearchResultItem as Item } from "@/services/search.service"
import SearchResultItem from "./SearchResultItem"

export default function SearchResultList({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <div className="bg-white border border-[#e5e5e5] py-16 text-center text-[#999]">
        <div className="text-[40px] mb-3">🔍</div>
        <div className="text-[15px] font-semibold mb-1">Không tìm thấy kết quả</div>
        <div className="text-[13px]">Thử từ khóa khác hoặc bỏ bớt bộ lọc</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <SearchResultItem key={i} item={item} />
      ))}
    </div>
  )
}
