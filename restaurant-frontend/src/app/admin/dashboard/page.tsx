"use client";

import { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  CalendarCheck,
  Clock,
  CheckCircle,
  MenuSquare,
  Star
} from "lucide-react";
import AdminStatsCard from "@/components/admin/AdminStatsCard";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";
import RevenueChart from "@/components/admin/RevenueChart";
import { apiFetch } from "@/lib/api";

type DashboardStats = {
  total_orders: number;
  total_revenue: number;
  total_customers: number;
  total_bookings: number;
  pending_orders: number;
  approved_bookings: number;
  total_menu_items: number;
  total_reviews: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await apiFetch<DashboardStats>("/admin/dashboard/stats", "GET", undefined, localStorage.getItem("token") || undefined);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div></div>;
  }

  const statCards = [
    { title: "Total Revenue", value: `$${stats?.total_revenue?.toFixed(2) || '0.00'}`, icon: DollarSign, trend: "+12.5%", trendUp: true },
    { title: "Total Orders", value: stats?.total_orders || 0, icon: ShoppingBag, trend: "+5.2%", trendUp: true },
    { title: "Total Customers", value: stats?.total_customers || 0, icon: Users, trend: "+1.1%", trendUp: true },
    { title: "Total Bookings", value: stats?.total_bookings || 0, icon: CalendarCheck, trend: "-2.4%", trendUp: false },
    { title: "Pending Orders", value: stats?.pending_orders || 0, icon: Clock },
    { title: "Approved Bookings", value: stats?.approved_bookings || 0, icon: CheckCircle },
    { title: "Menu Items", value: stats?.total_menu_items || 0, icon: MenuSquare },
    { title: "Customer Reviews", value: stats?.total_reviews || 0, icon: Star },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Dashboard Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Get a summary of your restaurant's performance and recent activities.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <AdminStatsCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <RevenueChart />
        <RecentOrdersTable />
      </div>
    </div>
  );
}
