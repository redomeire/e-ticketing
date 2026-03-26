"use client"

import { Calendar, LayoutDashboard, Settings, Ticket, Users, LogOut } from "@hugeicons/core-free-icons"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useLogout } from "@/modules/auth/hooks/useAuthRepository"

const data = {
    navMain: [
        { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
        { title: "Events", url: "/admin/events", icon: Calendar },
        { title: "Tickets & Seats", url: "/admin/seats", icon: Ticket },
        { title: "Users", url: "/admin/users", icon: Users },
        { title: "Settings", url: "/admin/settings", icon: Settings },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const { mutateAsync: logout } = useLogout({});
    const handleSignOut = async () => {
        try {
            await logout();
        } finally {
            signOut();
        }
    }

    return (
        <Sidebar collapsible="icon" {...props} className="border-r border-slate-100">
            <SidebarHeader className="py-6">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="hover:bg-transparent">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                                <HugeiconsIcon icon={Ticket} size={16} />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-black uppercase text-[#002558]">E-Ticketing</span>
                                <span className="truncate text-[10px] font-bold text-blue-600 uppercase">Management</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu className="px-2">
                    {data.navMain.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                isActive={pathname === item.url}
                                className="py-6 transition-all duration-200 data-[active=true]:bg-blue-600 data-[active=true]:text-white"
                            >
                                <Link href={item.url}>
                                    <HugeiconsIcon icon={item.icon} size={16} />
                                    <span className="font-bold uppercase tracking-widest text-[11px]">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-slate-50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={handleSignOut}
                            className="bg-red-600 text-white hover:text-white hover:bg-red-500 transition font-bold uppercase tracking-widest text-[11px] h-12"
                        >
                            <HugeiconsIcon icon={LogOut} size={16} />
                            <span>Sign Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}