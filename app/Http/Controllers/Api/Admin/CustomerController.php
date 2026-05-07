<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class CustomerController extends Controller
{
    public function index(): JsonResponse
    {
        $customers = User::with('role')
            ->whereHas('role', fn ($q) => $q->where('name', 'customer'))
            ->latest()
            ->get();

        return response()->json($customers);
    }
}
