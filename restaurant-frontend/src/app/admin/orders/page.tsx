"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Order = {
  id: number;
  total_amount: string;
  status: string;
  created_at: string;
  user?: { name: string };
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await apiFetch<Order[]>("/admin/orders", "GET", undefined, localStorage.getItem("token") || undefined);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Orders
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage customer orders.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow ring-1 ring-black ring-opacity-5">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr><td colSpan={5} className="py-4 text-center text-sm text-gray-500">Loading...</td></tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">#{order.id}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.user?.name || 'Guest'}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${parseFloat(order.total_amount).toFixed(2)}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{order.status}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="py-4 text-center text-sm text-gray-500">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
