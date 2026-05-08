import { cn } from "@/lib/utils"

interface FormCardProps {
  header:      React.ReactNode
  children:    React.ReactNode
  footer?:     React.ReactNode
  className?:  string
  headerClass?: string
}

export default function FormCard({ header, children, footer, className, headerClass }: FormCardProps) {
  return (
    <div className={cn("bg-white rounded-[10px] border border-[#e5e5e5] overflow-hidden", className)}>
      <div className={cn("px-[18px] py-[14px] border-b border-[#e5e5e5] text-[14px] font-semibold bg-[#f9fafb] flex items-center gap-2", headerClass)}>
        {header}
      </div>
      <div className="p-[18px]">{children}</div>
      {footer && (
        <div className="px-[18px] py-[14px] border-t border-[#e5e5e5] flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  )
}
