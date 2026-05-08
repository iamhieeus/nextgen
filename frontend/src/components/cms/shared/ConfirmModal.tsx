"use client"

interface ConfirmModalProps {
  open:      boolean
  title:     string
  message:   string
  onConfirm: () => void
  onClose:   () => void
}

export default function ConfirmModal({ open, title, message, onConfirm, onClose }: ConfirmModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/45 flex items-center justify-center z-[100]"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl p-7 w-[400px] shadow-[0_20px_60px_rgba(0,0,0,.25)]">
        <h3 className="text-[16px] font-bold mb-2">{title}</h3>
        <p className="text-[13.5px] text-[#555] mb-5 leading-[1.6]">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-[7px] text-[13px] font-medium bg-white text-[#333] border-[1.5px] border-[#e5e5e5] hover:bg-[#f5f5f5] hover:border-[#ccc] transition-all"
          >
            Hủy
          </button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            className="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-[7px] text-[13px] font-medium bg-[#e5353e] text-white border-[1.5px] border-[#e5353e] hover:bg-[#b82830] hover:border-[#b82830] transition-all"
          >
            🗑️ Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  )
}
