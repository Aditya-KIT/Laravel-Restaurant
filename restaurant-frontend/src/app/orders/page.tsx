"use client";
import AuthGuard from "@/components/AuthGuard";

export default function OrdersPage() {
  return <AuthGuard role="customer"><main className="p-6"><h1 className="text-2xl font-bold">My Orders</h1></main></AuthGuard>;
}
