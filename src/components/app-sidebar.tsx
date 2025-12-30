import * as React from "react"
import { Link } from "react-router-dom"
import {
  IconChartBar,
  IconHome,
  IconHelp,
  IconInnerShadowTop,
  IconSettings,
  IconCar,
  IconUsers,
  IconShoppingCart,
  IconBell,
  IconFileText,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Início",
      url: "/dashboard",
      icon: IconHome,
      color: "text-blue-600",
    },
    {
      title: "Estatisticas",
      url: "/dashboard/estatisticas",
      icon: IconChartBar,
      color: "text-purple-600",
    },
    {
      title: "Clientes",
      url: "/dashboard/clientes",
      icon: IconUsers,
      color: "text-green-600",
    },
    {
      title: "Veículos",
      url: "/dashboard/veiculos",
      icon: IconCar,
      color: "text-orange-600",
    },
    {
      title: "Interesses",
      url: "/dashboard/interesses",
      icon: IconShoppingCart,
      color: "text-pink-600",
    },
    {
      title: "Lembretes",
      url: "/dashboard/lembretes",
      icon: IconBell,
      color: "text-yellow-600",
    },
    {
      title: "Propostas",
      url: "/dashboard/propostas",
      icon: IconFileText,
      color: "text-indigo-600",
    },
  ],
  navSecondary: [
    {
      title: "Configurações",
      url: "/dashboard/configuracoes",
      icon: IconSettings,
      color: "text-gray-600",
    },
    {
      title: "Ajuda",
      url: "/dashboard/ajuda",
      icon: IconHelp,
      color: "text-cyan-600",
    },
  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5"
            >
              <Link to="/dashboard">
                <IconInnerShadowTop className="size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
