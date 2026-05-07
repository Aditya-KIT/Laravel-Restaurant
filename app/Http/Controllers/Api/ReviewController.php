<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Models\Review;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Review::with('user', 'menuItem')->where('is_approved', true)->latest()->get()
        );
    }

    public function store(StoreReviewRequest $request): JsonResponse
    {
        $review = Review::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
        ]);

        return response()->json(['message' => 'Review submitted for approval', 'review' => $review], 201);
    }
}
