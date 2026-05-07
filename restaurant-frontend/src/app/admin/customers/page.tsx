"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const data = await apiFetch<Customer[]>("/admin/customers", "GET", undefined, localStorage.getItem("token") || undefined);
        setCustomers(data);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Customers
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View registered customers.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow ring-1 ring-black ring-opacity-5">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr><td colSpan={4} className="py-4 text-center text-sm text-gray-500">Loading...</td></tr>
            ) : customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{customer.name}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.email}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.phone}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(customer.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="py-4 text-center text-sm text-gray-500">No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
