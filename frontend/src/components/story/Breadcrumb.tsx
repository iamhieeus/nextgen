type BreadcrumbItem = { label: string; href: string }

export default function Breadcrumb({ items, current }: { items: BreadcrumbItem[]; current: string }) {
  return (
    <div className="bg-white border-b border-[#e5e5e5]">
      <div className="max-w-[1200px] w-full mx-auto flex items-center gap-[6px] py-[9px] text-[12px] text-[#999]">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-[6px]">
            <a href={item.href} className="text-[#999] hover:text-ac transition-colors">{item.label}</a>
            <span className="text-[#ccc]">›</span>
          </span>
        ))}
        <span className="text-[#333] font-medium">{current}</span>
      </div>
    </div>
  )
}
