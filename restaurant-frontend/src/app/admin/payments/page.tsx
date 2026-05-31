"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { RefreshCw } from "lucide-react";

type Payment = {
  id: number;
  order_id: number;
  amount: string;
  payment_method?: string;
  method: string;
  status: string;
};

const PAYMENT_STATUSES = ["pending", "paid", "failed"];

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
  paid:    "bg-green-50 text-green-700 ring-green-600/20",
  failed:  "bg-red-50 text-red-700 ring-red-600/20",
};

function getToken() {
  return localStorage.getItem("token") || undefined;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Payment[]>("/admin/payments", "GET", undefined, getToken());
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleStatusChange = async (paymentId: number, newStatus: string) => {
    setUpdatingId(paymentId);
    try {
      await apiFetch(`/admin/payments/${paymentId}/status`, "PATCH", { status: newStatus }, getToken());
      setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: newStatus } : p));
    } catch (err: any) {
      alert(err.message || "Failed to update payment status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Payments
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View transaction history and manage payment statuses.
          </p>
        </div>
        <button
          onClick={fetchPayments}
          className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
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
              <tr><td colSpan={5} className="py-8 text-center text-sm text-gray-500">Loading...</td></tr>
            ) : payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    TXN-{payment.id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    #{payment.order_id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    ${parseFloat(payment.amount).toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 uppercase">
                    {payment.method || '—'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <select
                      value={payment.status}
                      disabled={updatingId === payment.id}
                      onChange={e => handleStatusChange(payment.id, e.target.value)}
                      className={`rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-amber-500 ${statusStyles[payment.status] || "bg-gray-50 text-gray-700 ring-gray-600/20"} ${updatingId === payment.id ? "opacity-50 cursor-wait" : ""}`}
                    >
                      {PAYMENT_STATUSES.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="py-8 text-center text-sm text-gray-500">No payments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
