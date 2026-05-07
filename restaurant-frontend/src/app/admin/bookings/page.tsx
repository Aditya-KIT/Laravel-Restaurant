"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Booking = {
  id: number;
  booking_date: string;
  booking_time: string;
  guests: number;
  status: string;
  user?: { name: string };
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await apiFetch<Booking[]>("/admin/bookings", "GET", undefined, localStorage.getItem("token") || undefined);
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

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
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow ring-1 ring-black ring-opacity-5">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Booking ID</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date & Time</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Guests</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr><td colSpan={5} className="py-4 text-center text-sm text-gray-500">Loading...</td></tr>
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">#{booking.id}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{booking.user?.name || 'Guest'}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{booking.guests}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{booking.status}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="py-4 text-center text-sm text-gray-500">No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
