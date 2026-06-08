"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Boxes,
  Ticket,
  Wrench,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/assets", label: "Assets", icon: Boxes },
  { href: "/service-requests", label: "Service Requests", icon: Ticket },
  { href: "/maintenance-logs", label: "Maintenance Logs", icon: Wrench },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-2 py-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        <Link
          href="/"
          className="flex items-center justify-center overflow-hidden px-2 group-data-[collapsible=icon]:px-0"
        >
          <Image
            src="/megasoft-logo-light.png"
            alt="MegaSoft"
            width={200}
            height={71}
            priority
            className="h-12 w-auto group-data-[collapsible=icon]:hidden"
          />
          <Image
            src="/megasoft-icon.png"
            alt="MegaSoft"
            width={40}
            height={40}
            className="hidden size-10 shrink-0 object-contain group-data-[collapsible=icon]:block"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    render={<Link href={item.href} />}
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-brand data-active:bg-brand data-active:text-brand-foreground data-active:font-medium [&_svg]:text-current"
                  >
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.label}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
