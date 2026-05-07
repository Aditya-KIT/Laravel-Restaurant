"use client";
import AuthGuard from "@/components/AuthGuard";

export default function CartPage() {
  return <AuthGuard role="customer"><main className="p-6"><h1 className="text-2xl font-bold">Cart</h1></main></AuthGuard>;
}
