import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ChatDrawer } from "@/components/ChatDrawer"

export default function Page({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {children}
        <ChatDrawer />
      </SidebarInset>
    </SidebarProvider>
  )
}
