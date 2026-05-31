"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { RefreshCw } from "lucide-react";

type Booking = {
  id: number;
  booking_date: string;
  booking_time: string;
  guests: number;
  status: string;
  name?: string;
  user?: { name: string };
};

const BOOKING_STATUSES = ["pending", "approved", "rejected"];

const statusStyles: Record<string, string> = {
  pending:  "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
  approved: "bg-green-50 text-green-700 ring-green-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
};

function getToken() {
  return localStorage.getItem("token") || undefined;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Booking[]>("/admin/bookings", "GET", undefined, getToken());
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    setUpdatingId(bookingId);
    try {
      await apiFetch(`/admin/bookings/${bookingId}/status`, "PATCH", { status: newStatus }, getToken());
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (err: any) {
      alert(err.message || "Failed to update booking status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Bookings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage table reservations.
          </p>
        </div>
        <button
          onClick={fetchBookings}
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
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Booking ID</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date &amp; Time</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Guests</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr><td colSpan={5} className="py-8 text-center text-sm text-gray-500">Loading...</td></tr>
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    #{booking.id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {booking.user?.name || booking.name || 'Guest'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {booking.guests}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <select
                      value={booking.status}
                      disabled={updatingId === booking.id}
                      onChange={e => handleStatusChange(booking.id, e.target.value)}
                      className={`rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-amber-500 ${statusStyles[booking.status] || "bg-gray-50 text-gray-700 ring-gray-600/20"} ${updatingId === booking.id ? "opacity-50 cursor-wait" : ""}`}
                    >
                      {BOOKING_STATUSES.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="py-8 text-center text-sm text-gray-500">No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
