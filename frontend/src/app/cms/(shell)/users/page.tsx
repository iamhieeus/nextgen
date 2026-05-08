"use client"

import { useState, useMemo } from "react"
import Badge      from "@/components/cms/shared/Badge"
import Pagination from "@/components/cms/shared/Pagination"
import { useToast } from "@/components/cms/shared/Toast"
import { CMS_USERS } from "@/data/cms-mock"

function roleBadge(role: string) {
  if (role === "ADMIN")  return <Badge variant="red">{role}</Badge>
  if (role === "AUTHOR") return <Badge variant="blue">{role}</Badge>
  return <Badge variant="gray">{role}</Badge>
}

const TH = "bg-[#fafafa] text-[11.5px] font-semibold text-[#666] uppercase tracking-[.05em] px-3.5 py-2.5 text-left border-b border-[#e5e5e5] whitespace-nowrap"
const TD = "px-3.5 py-[11px] border-b border-[#f0f0f0] text-[13px] align-middle"

export default function UsersPage() {
  const { showToast } = useToast()

  const [search,   setSearch]   = useState("")
  const [role,     setRole]     = useState("")
  const [page,     setPage]     = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const filtered = useMemo(() =>
    CMS_USERS.filter(u => {
      const q = search.toLowerCase()
      return (
        (!q    || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
        (!role || u.role === role)
      )
    }),
    [search, role]
  )

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">Quản lý Người dùng</h1>
          <p className="text-[12.5px] text-[#888] mt-0.5">
            {filtered.length === CMS_USERS.length
              ? `${CMS_USERS.length} tài khoản đã đăng ký`
              : `Hiển thị ${filtered.length} / ${CMS_USERS.length} tài khoản`}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[10px] border border-[#e5e5e5] overflow-hidden">
        <div className="px-4 py-3.5 border-b border-[#e5e5e5] flex items-center gap-2.5">
          <input
            className="px-3 py-[7px] border-[1.5px] border-[#e5e5e5] rounded-[7px] text-[13px] w-[220px] outline-none focus:border-[#e5353e] transition-colors"
            placeholder="🔍  Tìm người dùng..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
          <select
            className="px-2.5 py-[7px] border-[1.5px] border-[#e5e5e5] rounded-[7px] text-[13px] outline-none bg-white cursor-pointer focus:border-[#e5353e]"
            value={role}
            onChange={e => { setRole(e.target.value); setPage(1) }}
          >
            <option value="">Tất cả vai trò</option>
            <option value="READER">READER</option>
            <option value="AUTHOR">AUTHOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Người dùng","Email","Vai trò","Ngày đăng ký","Thao tác"].map(h => (
                <th key={h} className={TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={5} className="py-10 text-center text-[13px] text-[#aaa]">Không tìm thấy người dùng nào</td></tr>
            ) : paged.map(u => (
              <tr key={u.email} className="hover:[&>td]:bg-[#fafbfc]">
                <td className={TD}>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full grid place-items-center text-[13px] font-bold text-white shrink-0"
                      style={{ background: u.color }}
                    >{u.initial}</div>
                    <strong>{u.name}</strong>
                  </div>
                </td>
                <td className={TD}>{u.email}</td>
                <td className={TD}>{roleBadge(u.role)}</td>
                <td className={TD}>{u.joined}</td>
                <td className={TD}>
                  <button
                    className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-[7px] text-[12px] font-medium text-[#555] hover:bg-[#f0f0f0] hover:text-[#222] transition-all"
                    onClick={() => u.role === "ADMIN"
                      ? showToast("Không thể sửa tài khoản Admin", "error")
                      : showToast("Đã mở form sửa người dùng", "success")
                    }
                  >✏️ Sửa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={filtered.length}
          onPage={setPage}
          onPageSize={s => { setPageSize(s); setPage(1) }}
        />
      </div>
    </>
  )
}
