import {SidebarProvider , SidebarInset , SidebarTrigger} from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/app-sidebar";
import {Separator} from "@/components/ui/separator";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
    return(
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <header className="flex h-14 items-center border-b px-4">
                    <SidebarTrigger/>
                    <Separator orientation="vertical" className="h-4"/>
                    <span className="text-sm font-medium text-muted-foreground">
                     MegaSoft Enterprise Service & Asset Management
                     </span>   
                </header>
                <main className="flex-1 p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    )
}