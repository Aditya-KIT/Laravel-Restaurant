"use client";
import AuthGuard from "@/components/AuthGuard";

export default function CheckoutPage() {
  return <AuthGuard role="customer"><main className="p-6"><h1 className="text-2xl font-bold">Checkout</h1></main></AuthGuard>;
}
