"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { CheckCircle, Trash2, Star, RefreshCw } from "lucide-react";

type Review = {
  id: number;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  user?: { name: string };
  menu_item?: { name: string };
};

function getToken() {
  return localStorage.getItem("token") || undefined;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Review[]>("/admin/reviews", "GET", undefined, getToken());
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleApprove = async (id: number) => {
    setApprovingId(id);
    try {
      await apiFetch(`/admin/reviews/${id}/approve`, "PATCH", undefined, getToken());
      setReviews(prev => prev.map(r => r.id === id ? { ...r, is_approved: true } : r));
    } catch (err: any) {
      alert(err.message || "Failed to approve review.");
    } finally {
      setApprovingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await apiFetch(`/admin/reviews/${id}`, "DELETE", undefined, getToken());
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Reviews
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer feedback and ratings. Approve or delete reviews.
          </p>
        </div>
        <button
          onClick={fetchReviews}
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
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Customer</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Menu Item</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rating</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Comment</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-sm text-gray-500">Loading...</td></tr>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {review.user?.name || 'Guest'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {review.menu_item?.name || '—'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <StarRating rating={review.rating} />
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 max-w-xs">
                    <p className="truncate">{review.comment}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      review.is_approved
                        ? "bg-green-50 text-green-700 ring-green-600/20"
                        : "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                    }`}>
                      {review.is_approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    {!review.is_approved && (
                      <button
                        onClick={() => handleApprove(review.id)}
                        disabled={approvingId === review.id}
                        className="text-green-600 hover:text-green-800 mr-3 transition-colors disabled:opacity-50"
                        title="Approve"
                      >
                        <CheckCircle className="h-4 w-4 inline" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={deletingId === review.id}
                      className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="py-8 text-center text-sm text-gray-500">No reviews found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
