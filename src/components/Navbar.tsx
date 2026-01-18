"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Moon, Settings, Sun, UserIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth/logout";
import { useEffect, useState } from "react";

type UserRole = "admin" | "manager" | "staff";

interface AdminUser {
  name: string;
  role: UserRole;
  avatar?: string | null;
}

const Navbar = () => {
  const router = useRouter();
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

  const { theme, setTheme } = useTheme();

  if (!user) return null; // Prevent flash

  return (
    <div className="flex items-center justify-between p-4">
      {/* LEFT SIDE */}
      <SidebarTrigger />
      {/* RIGHT SIDE (ICONS AND USER) */}
      <div className="flex items-center gap-4">
        {/* THEME MENU */}
        <DropdownMenu></DropdownMenu>
        {/* MESSAGE AND NOTIFICATION MENU */}
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">
            {user.name || "Welcome"}
          </span>
          <span className="text-[10px] text-gray-500 text-right">{user.role}</span>
        </div>
        {/* <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full"/> */}
        {/*  USER MENU  */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="/avatar.png" />
              <AvatarFallback>UI</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={12} className="mr-4 bg-white">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="h-[1.2rem] w-[1.2rem] mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 cursor-pointer"
            >
              <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
