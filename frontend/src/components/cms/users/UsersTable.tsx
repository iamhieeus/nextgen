"use client"

import Badge from "@/components/cms/shared/Badge"
import { CMS_USERS } from "@/data/cms-mock"
import { useToast } from "@/components/cms/shared/Toast"

const TH = "bg-[#fafafa] text-[11.5px] font-semibold text-[#666] uppercase tracking-[.05em] px-3.5 py-2.5 text-left border-b border-[#e5e5e5] whitespace-nowrap"
const TD = "px-3.5 py-[11px] border-b border-[#f0f0f0] text-[13px] align-middle"

function roleBadge(role: string) {
  if (role === "ADMIN")  return <Badge variant="red">{role}</Badge>
  if (role === "AUTHOR") return <Badge variant="blue">{role}</Badge>
  return <Badge variant="gray">{role}</Badge>
}

export default function UsersTable() {
  const { showToast } = useToast()

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {["Người dùng","Email","Vai trò","Ngày đăng ký","Thao tác"].map(h => (
            <th key={h} className={TH}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {CMS_USERS.map(u => (
          <tr key={u.email} className="hover:[&>td]:bg-[#fafbfc]">
            <td className={TD}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full grid place-items-center text-[13px] font-bold text-white shrink-0"
                  style={{ background: u.color }}
                >
                  {u.initial}
                </div>
                <strong>{u.name}</strong>
              </div>
            </td>
            <td className={TD}>{u.email}</td>
            <td className={TD}>{roleBadge(u.role)}</td>
            <td className={TD}>{u.joined}</td>
            <td className={TD}>
              <button
                className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-[7px] text-[12px] font-medium text-[#555] hover:bg-[#f0f0f0] hover:text-[#222] transition-all"
                onClick={() => {
                  if (u.role === "ADMIN") {
                    showToast("Không thể sửa tài khoản Admin", "error")
                  } else {
                    showToast("Đã mở form sửa người dùng", "success")
                  }
                }}
              >
                ✏️ Sửa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
