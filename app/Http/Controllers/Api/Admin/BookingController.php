<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;

class BookingController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Booking::with('user')->latest()->get());
    }

    public function updateStatus(Booking $booking): JsonResponse
    {
        request()->validate(['status' => 'required|in:pending,approved,rejected']);
        $booking->update(['status' => request('status')]);
        return response()->json(['message' => 'Booking status updated']);
    }
}
