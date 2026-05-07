<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Booking\StoreBookingRequest;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;

class BookingController extends Controller
{
    public function store(StoreBookingRequest $request): JsonResponse
    {
        $booking = Booking::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
        ]);

        return response()->json(['message' => 'Booking request submitted', 'booking' => $booking], 201);
    }
}
