"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MenuSquare, 
  Tags, 
  ShoppingBag, 
  CalendarCheck, 
  Users, 
  Star, 
  CreditCard,
  LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Menu Items', href: '/admin/menu', icon: MenuSquare },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", "POST", undefined, localStorage.getItem("token") || undefined);
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      router.push("/login");
    }
  };

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 border-r border-slate-800">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
          <span className="text-amber-500">RESTO</span>ADMIN
        </h1>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-4 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-amber-500 text-white" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 shrink-0 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-red-500" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
