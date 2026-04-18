// import AppSidebar from "@/components/AppSidebar";
// import Menu from "@/components/Menu";
// import Navbar from "@/components/Navbar";
// import { ThemeProvider } from "@/components/providers/ThemeProvider";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { cookies } from "next/headers";



// export default async function DashboardLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {

//   const cookieStore = await cookies()
//   const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

//   return (
//     <div className="h-screen flex">
//       {/* LEFT */}
//     <ThemeProvider attribute="class"
//               defaultTheme="system"
//               enableSystem
//               disableTransitionOnChange>
//       <SidebarProvider defaultOpen={defaultOpen}>
//         <AppSidebar />
//         {/* RIGHT */}
//         <div className="w-full overflow-scroll bg-[#babdcc]">
//           <Navbar />
//           {children}
//         </div>
//       </SidebarProvider>
//     </ThemeProvider>
//     </div>
//   );
// }



import AdminLayoutGuard from "@/components/AdminLayoutGuard";
import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <AdminLayoutGuard>
      <ThemeProvider attribute="class" defaultTheme="system">
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <div className="w-full overflow-scroll bg-background">
            <Navbar />
            {children}
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </AdminLayoutGuard>
  );
}
