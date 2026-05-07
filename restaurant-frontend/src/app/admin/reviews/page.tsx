"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Review = {
  id: number;
  rating: number;
  comment: string;
  is_approved: boolean;
  user?: { name: string };
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await apiFetch<Review[]>("/admin/reviews", "GET", undefined, localStorage.getItem("token") || undefined);
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Reviews
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer feedback and ratings.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow ring-1 ring-black ring-opacity-5">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Customer</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rating</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Comment</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr><td colSpan={4} className="py-4 text-center text-sm text-gray-500">Loading...</td></tr>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{review.user?.name || 'Guest'}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{review.rating} / 5</td>
                  <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">{review.comment}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{review.is_approved ? 'Approved' : 'Pending'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="py-4 text-center text-sm text-gray-500">No reviews found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
