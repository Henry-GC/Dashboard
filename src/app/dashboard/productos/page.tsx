"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ProductTable } from "./ProductTable";

function Productos () {
    return (
        <>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbPage>Productos</BreadcrumbPage>
                </BreadcrumbItem>
            </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 px-4">
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-4">
                        {/* <SectionCards /> */}
                        <ProductTable />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Productos;