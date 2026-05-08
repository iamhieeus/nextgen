import "./mobile.css"
import type { Viewport } from "next"

export const metadata = {
  title: { default: "Cấm Địa – Mobile", template: "%s – Cấm Địa" },
  description: "Đọc truyện online trên di động",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mobile-app">
      {children}
    </div>
  )
}
