"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Payment = {
  id: number;
  order_id: number;
  amount: string;
  payment_method: string;
  status: string;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const data = await apiFetch<Payment[]>("/admin/payments", "GET", undefined, localStorage.getItem("token") || undefined);
        setPayments(data);
      } catch (error) {
        console.error("Failed to fetch payments", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Payments
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View transaction history and payment statuses.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow ring-1 ring-black ring-opacity-5">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Transaction ID</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Order ID</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Method</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr><td colSpan={5} className="py-4 text-center text-sm text-gray-500">Loading...</td></tr>
            ) : payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">TXN-{payment.id}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">#{payment.order_id}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${parseFloat(payment.amount).toFixed(2)}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 uppercase">{payment.payment_method}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{payment.status}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="py-4 text-center text-sm text-gray-500">No payments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
