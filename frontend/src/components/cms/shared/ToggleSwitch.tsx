"use client"

interface ToggleSwitchProps {
  checked: boolean
  onChange: (v: boolean) => void
  title?: string
}

export default function ToggleSwitch({ checked, onChange, title }: ToggleSwitchProps) {
  return (
    <label className="inline-flex cursor-pointer relative shrink-0" title={title}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
      />
      <span
        className="relative inline-block w-11 h-6 rounded-xl transition-colors duration-200"
        style={{ background: checked ? "#e5353e" : "#d1d5db" }}
      >
        <span
          className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform duration-200"
          style={{ left: 3, transform: checked ? "translateX(20px)" : "translateX(0)" }}
        />
      </span>
    </label>
  )
}
