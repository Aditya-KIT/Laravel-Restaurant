<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Payment::with('order.user')->latest()->get());
    }

    public function updateStatus(Payment $payment): JsonResponse
    {
        request()->validate(['status' => 'required|in:pending,paid,failed']);
        $payment->update(['status' => request('status')]);
        return response()->json(['message' => 'Payment status updated']);
    }
}
