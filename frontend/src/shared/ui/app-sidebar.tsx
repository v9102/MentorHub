"use client"

import { usePathname } from "next/navigation"
import { Calendar, Home, Inbox, MessageCircle, Search, Settings, User } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar"
import Link from "next/link"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard/student",
    icon: Home,
  },
  {
    title: "Find Mentors",
    url: "/mentors",
    icon: Search,
  },
  {
    title: "My Sessions",
    url: "/dashboard/student/sessions",
    icon: Calendar,
  },
  {
    title: "Chat",
    url: "/dashboard/student/messages",
    icon: MessageCircle,
  },
  {
    title: "Profile",
    url: "/dashboard/student/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/dashboard/student/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-2 mb-4">
             <h1 className="text-xl font-bold text-blue-800">
                Mentor<span className="text-orange-600">Hub</span>
             </h1>
          </div>
          <SidebarGroupLabel className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
               Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {items.map((item) => {
                // Check if active (exact match or subpath)
                // For /student (Dashboard), we want exact match if possible, or handle specifically
                const isActive = item.url === "/dashboard/student" 
                    ? pathname === "/dashboard/student" 
                    : pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 p-3 bg-sidebar-accent/10 rounded-lg">
                <UserButton showName />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
