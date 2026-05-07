<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Review::with('user', 'menuItem')->latest()->get());
    }

    public function approve(Review $review): JsonResponse
    {
        $review->update(['is_approved' => true]);
        return response()->json(['message' => 'Review approved']);
    }

    public function destroy(Review $review): JsonResponse
    {
        $review->delete();
        return response()->json(['message' => 'Review deleted']);
    }
}
