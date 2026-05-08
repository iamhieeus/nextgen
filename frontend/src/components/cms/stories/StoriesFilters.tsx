"use client"

interface StoriesFiltersProps {
  search:   string
  author:   string
  category: string
  status:   string
  onSearch:   (v: string) => void
  onAuthor:   (v: string) => void
  onCategory: (v: string) => void
  onStatus:   (v: string) => void
  onClear:    () => void
}

const selectCls = "px-2.5 py-[7px] border-[1.5px] border-[#e5e5e5] rounded-[7px] text-[13px] outline-none bg-white cursor-pointer focus:border-[#e5353e]"

export default function StoriesFilters({ search, category, status, onSearch, onCategory, onStatus, onClear }: StoriesFiltersProps) {
  return (
    <div className="px-4 py-3.5 border-b border-[#e5e5e5] flex items-center gap-2.5 flex-wrap">
      <input
        className="px-3 py-[7px] border-[1.5px] border-[#e5e5e5] rounded-[7px] text-[13px] w-[220px] outline-none focus:border-[#e5353e] transition-colors"
        placeholder="🔍  Tìm kiếm truyện..."
        value={search}
        onChange={e => onSearch(e.target.value)}
      />

      <select className={selectCls} value={category} onChange={e => onCategory(e.target.value)}>
        <option value="">Tất cả thể loại</option>
      </select>

      <select className={selectCls} value={status} onChange={e => onStatus(e.target.value)}>
        <option value="">Tất cả trạng thái</option>
        <option value="ONGOING">Đang ra</option>
        <option value="COMPLETED">Hoàn thành</option>
        <option value="HIATUS">Tạm dừng</option>
        <option value="DROPPED">Đã drop</option>
      </select>

      <button
        className="ml-auto text-[13px] text-[#aaa] hover:text-[#e5353e] px-2.5 py-[5px] rounded-[7px] hover:bg-[#f0f0f0] transition-all"
        onClick={onClear}
      >
        ✕ Xóa bộ lọc
      </button>
    </div>
  )
}
