"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Plus, Edit, Trash2 } from "lucide-react";

type MenuItem = {
  id: number;
  name: string;
  price: string;
  category: { name: string };
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const data = await apiFetch<MenuItem[]>("/admin/menu", "GET", undefined, localStorage.getItem("token") || undefined);
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch menu items", error);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Menu Items
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your restaurant's menu items, prices, and categories.
          </p>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0">
          <button className="inline-flex items-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600">
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Item
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow ring-1 ring-black ring-opacity-5">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr><td colSpan={4} className="py-4 text-center text-sm text-gray-500">Loading...</td></tr>
            ) : items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{item.name}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.category?.name || 'N/A'}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${parseFloat(item.price).toFixed(2)}</td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button className="text-amber-600 hover:text-amber-900 mr-4"><Edit className="h-4 w-4 inline" /></button>
                    <button className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4 inline" /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="py-4 text-center text-sm text-gray-500">No menu items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
