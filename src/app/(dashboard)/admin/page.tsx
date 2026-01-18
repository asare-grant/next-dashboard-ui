import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import UserCard from "@/components/UserCard";
import OrdersPerDayChart from "@/components/charts/OrdersPerDayChart";
import RevenuePerWeekChart from "@/components/charts/RevenuePerWeekChart";
import FinanceChart from "@/components/FinanceChart";
import TopSellingMealsTable from "@/components/dashboard/TopSellingMealsTable";
import RecentOrdersWidget from "@/components/dashboard/RecentOrdersWidget";
import { getAdminDashboard } from "@/lib/api/dashboard";

const AdminPage = async () => {
  const role = cookies().get("admin_role")?.value;

  if (role !== "admin") {
    redirect("/admin/orders");
  }

  const dashboard = await getAdminDashboard();

  return (
    <div className="p-4 flex gap-4 flex-col bg-gray-50 overflow-hidden">
      {/* METRICS */}
      <div className="flex gap-4 justify-between flex-wrap">
        <UserCard label="Revenue Today" value={`₵${dashboard.metrics.revenueToday}`} />
        <UserCard label="Total Orders" value={dashboard.metrics.totalOrders} />
        <UserCard label="Pending Orders" value={dashboard.metrics.pendingOrders} />
        <UserCard label="Processing" value={dashboard.metrics.processingOrders} />
        <UserCard label="Out For Delivery" value={dashboard.metrics.outForDelivery} />
        <UserCard label="Delivered" value={dashboard.metrics.deliveredOrders} />
        <UserCard label="Popular Menu" value={dashboard.metrics.popularMenu} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OrdersPerDayChart data={dashboard.ordersPerDay} />
        <RevenuePerWeekChart data={dashboard.revenuePerWeek} />
      </div>

      {/* TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TopSellingMealsTable data={dashboard.topMeals} />
        </div>
        <RecentOrdersWidget data={dashboard.recentOrders} />
      </div>

      {/* FINANCE */}
      <div className="w-full h-[500px]">
        <FinanceChart data={dashboard.finance} />
      </div>
    </div>
  );
};

export default AdminPage;
