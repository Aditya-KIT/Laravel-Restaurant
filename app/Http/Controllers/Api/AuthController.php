<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $customerRole = Role::firstOrCreate(['name' => 'customer']);

        $user = User::create([
            'name' => $request->name,
            'role_id' => $customerRole->id,
            'phone' => $request->phone,
            'email' => $request->email,
            'password' => $request->password,
        ]);

        return response()->json([
            'message' => 'Registration successful',
            'token' => $user->createToken('api-token')->plainTextToken,
            'user' => $user->load('role'),
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }

        return response()->json([
            'message' => 'Login successful',
            'token' => $user->createToken('api-token')->plainTextToken,
            'user' => $user->load('role'),
        ]);
    }

    public function me(): JsonResponse
    {
        return response()->json(auth()->user()->load('role'));
    }

    public function logout(): JsonResponse
    {
        auth()->user()?->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
