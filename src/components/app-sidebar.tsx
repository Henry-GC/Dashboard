"use client"
import * as React from "react"
// import { SearchForm } from "@/components/search-form"
import {
  // AudioWaveform,
  // Command,
  GalleryVerticalEnd,
  LayoutDashboard,
  Package,
  Cpu,
  ShoppingCart,
  FileText,
  FileX2,
  Ban,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle"
// import { TeamSwitcher } from "./team-switcher"
import { NavUser } from "./nav-user"

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  // teams: [
  //   {
  //     name: "AnonymousPC",
  //     logo: GalleryVerticalEnd,
  //     plan: "Enterprise",
  //   },
  //   {
  //     name: "Rubitek",
  //     logo: AudioWaveform,
  //     plan: "Startup",
  //   },
  //   {
  //     name: "Facibot",
  //     logo: Command,
  //     plan: "Free",
  //   },
  // ],
  navMain: [
    {
      title: "Panel General",
      url: "#",
      items: [
        {
          title: "Registros",
          url: "/dashboard/registros",
          icon: LayoutDashboard,
        },
        {
          title: "Productos",
          url: "/dashboard/productos",
          icon: Package,
        },
        {
          title: "Ensambles",
          url: "/dashboard/ensambles",
          icon: Cpu,
        },
        {
          title: "Ordenes",
          url: "/dashboard/ordenes",
          icon: ShoppingCart,
        },
      ],
    },
    {
      title: "Facturación",
      url: "#",
      items: [
        {
          title: "Facturas",
          url: "/dashboard/facturacion/facturas",
          icon: FileText,
        },
        {
          title: "Notas de Crédito",
          url: "/dashboard/facturacion/notas-credito",
          icon: FileX2,
        },
        {
          title: "Anulaciones",
          url: "/dashboard/facturacion/anulaciones",
          icon: Ban,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [adminEmail, setAdminEmail] = React.useState("")

  React.useEffect(() => {
    const email = localStorage.getItem("adminEmail")
    if (email) {
      setAdminEmail(email)
    }
  }, [])

  const user = {
    name: "Administrador",
    email: adminEmail || "admin@anonymouspc.com",
    avatar: "",
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          {/* TeamSwitcher comentado - solo AnonymousPC de momento */}
          {/* <TeamSwitcher teams={data.teams} /> */}
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">AnonymousPC</span>
              <span className="truncate text-xs text-muted-foreground">Panel de Administración</span>
            </div>
          </div>
          <ModeToggle />
        </div>
        {/* SearchForm comentado temporalmente */}
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => {
                  // Determine if this sidebar item is active
                  const isActive = subItem.url !== "#" && pathname.startsWith(subItem.url);
                  return (
                    <SidebarMenuItem key={subItem.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={subItem.url}>
                          {"icon" in subItem && subItem.icon && <subItem.icon className="size-4" />}
                          {subItem.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user}/>
      </SidebarFooter>
    </Sidebar>
  )
}
