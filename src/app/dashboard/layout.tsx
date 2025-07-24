import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ProductProvider } from "@/context/ProductContext"
import { BuildProvider } from "@/context/BuildContext"

export default function Page({children}: {children: React.ReactNode}) {
  return (
    <ProductProvider>
      <BuildProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </BuildProvider>
    </ProductProvider>
  )
}
