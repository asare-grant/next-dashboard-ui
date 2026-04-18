"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Grid,
  Utensils,
  ShoppingBag,
  SlidersHorizontal,
  Users,
  UserCog,
  BookOpen,
  ChevronUp,
  User2,
  Settings,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { logout } from "@/lib/auth/logout";
import colors from "@/config/colors";

/* =========================
   TYPES
========================= */
type UserRole = "admin" | "manager" | "staff";

interface AdminUser {
  name: string;
  role: UserRole;
  avatar?: string | null;
}

/* =========================
   MENU CONFIG
========================= */
const MENU_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["admin"],
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Grid,
    roles: ["admin", "manager"],
  },
  {
    label: "Menu",
    href: "/admin/menu",
    icon: Utensils,
    roles: ["admin", "manager"],
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
    roles: ["admin", "manager", "staff"],
  },
  {
    label: "Staff",
    href: "/admin/staff",
    icon: Users,
    roles: ["admin", "manager"],
  },
];

const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);

  /* =========================
     LOAD USER FROM STORAGE
  ========================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("admin_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    await logout(router);
  };

  if (!user) return null; // Prevent flash

  return (
    <Sidebar collapsible="icon" className="bg-[#f8f8f8]">
      {/* HEADER */}
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/orders" className="flex items-center gap-2">
                {/* LOGO (UNCHANGED) */}
                <Image
                  src="/splash-icon.png"
                  alt="logo"
                  width={40}
                  height={40}
                />
                <span className="font-semibold tracking-wide text-blue-600">RAAJ FOOD</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="bg-gray-300"/>

      {/* CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mt-4 mb-2">Management</SidebarGroupLabel>
          <SidebarGroupAction>
            <BookOpen className="h-4 w-4 text-[#17972a80] mt-4 mb-2" />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <SidebarMenu>
              {MENU_ITEMS.filter((item) => item.roles.includes(user.role)).map(
                (item) => {
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-indigo-100 hover:text-[#08581480] ${
                            pathname === item.href
                              ? "bg-indigo-50 text-[#08581480]"
                              : ""
                          }`}
                        >
                          <Icon
                            size={18}
                            className="text-[#17972a80] shrink-0"
                          />
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="gap-2">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <User2 className="h-4 w-4 text-[#17972a80]" />
                  )}

                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="bg-[#babdcc]">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
