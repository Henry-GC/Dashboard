import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ProductProvider } from "@/context/ProductContext"

export default function Page({children}: {children: React.ReactNode}) {
  return (
    <ProductProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ProductProvider>
  )
}
