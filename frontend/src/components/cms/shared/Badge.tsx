import { cn } from "@/lib/utils"

type BadgeVariant = "green" | "yellow" | "red" | "gray" | "blue"

const variantClass: Record<BadgeVariant, string> = {
  green:  "bg-[#dcfce7] text-[#16a34a]",
  yellow: "bg-[#fef9c3] text-[#b45309]",
  red:    "bg-[#fee2e2] text-[#dc2626]",
  gray:   "bg-[#f3f4f6] text-[#6b7280]",
  blue:   "bg-[#dbeafe] text-[#2563eb]",
}

interface BadgeProps {
  variant: BadgeVariant
  dot?: boolean
  children: React.ReactNode
  className?: string
}

export default function Badge({ variant, dot, children, className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[11px] font-semibold",
      variantClass[variant],
      className
    )}>
      {dot && (
        <span className="w-[5px] h-[5px] rounded-full bg-current shrink-0" />
      )}
      {children}
    </span>
  )
}
