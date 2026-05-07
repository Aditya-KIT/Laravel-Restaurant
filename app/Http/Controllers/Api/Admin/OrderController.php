<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Order::with('user', 'items.menuItem', 'payment')->latest()->get());
    }

    public function updateStatus(Order $order): JsonResponse
    {
        request()->validate(['status' => 'required|in:pending,preparing,completed,cancelled']);
        $order->update(['status' => request('status')]);
        return response()->json(['message' => 'Order status updated']);
    }
}
