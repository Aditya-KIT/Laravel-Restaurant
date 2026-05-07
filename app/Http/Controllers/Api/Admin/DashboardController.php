<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'total_orders' => Order::count(),
            'total_revenue' => (float) Order::where('status', 'completed')->sum('total_amount'),
            'total_customers' => User::whereHas('role', fn ($q) => $q->where('name', 'customer'))->count(),
            'total_bookings' => Booking::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'approved_bookings' => Booking::where('status', 'confirmed')->count(),
            'total_menu_items' => \App\Models\MenuItem::count(),
            'total_reviews' => \App\Models\Review::count(),
        ]);
    }

    public function recentOrders(): JsonResponse
    {
        return response()->json(Order::with('user')->latest()->limit(5)->get());
    }

    public function recentBookings(): JsonResponse
    {
        return response()->json(Booking::with('user')->latest()->limit(5)->get());
    }

    public function revenueChart(): JsonResponse
    {
        return response()->json(
            Order::selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
                ->where('status', 'completed')
                ->groupBy('date')
                ->orderBy('date')
                ->limit(7)
                ->get()
        );
    }

    public function popularItems(): JsonResponse
    {
        return response()->json(
            \App\Models\MenuItem::withCount('orderItems')
                ->orderByDesc('order_items_count')
                ->limit(5)
                ->get()
        );
    }
}
