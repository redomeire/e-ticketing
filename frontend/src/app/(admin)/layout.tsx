import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Search } from "@hugeicons/core-free-icons"
import { AppSidebar } from "@/modules/admin/components/sidebar/AdminSidebar"
import { HugeiconsIcon } from "@hugeicons/react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-slate-50/50">
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-white px-6 sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="font-bold text-blue-600 uppercase tracking-tighter">Current View</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <div className="flex items-center gap-4 w-full max-w-sm">
                        <div className="relative w-full">
                            <Input
                                type="search"
                                placeholder="Cari data..."
                                className="w-full bg-slate-50 pl-9 focus-visible:ring-1 focus-visible:ring-blue-600"
                                startIcon={<HugeiconsIcon
                                    icon={Search}
                                    size={16}
                                />}
                            />
                        </div>
                    </div>
                </header>

                <main className="flex flex-1 flex-col gap-4 p-6 lg:p-10 no-scrollbar">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}