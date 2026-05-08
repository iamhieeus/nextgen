import CmsSidebar from "@/components/cms/layout/CmsSidebar"
import CmsTopBar  from "@/components/cms/layout/CmsTopBar"
import { ToastProvider } from "@/components/cms/shared/Toast"

export default function CmsShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#f4f4f4]">
        <CmsSidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-x-hidden">
          <CmsTopBar />
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
