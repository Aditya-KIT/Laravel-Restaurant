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
        try {
            // If no users exist, the first user becomes an admin
            $isFirstUser = User::count() === 0;
            $roleName = $isFirstUser ? 'admin' : 'customer';
            
            $role = Role::firstOrCreate(['name' => $roleName]);

            $user = User::create([
                'name' => $request->name,
                'role_id' => $role->id,
                'phone' => $request->phone,
                'email' => $request->email,
                'password' => $request->password,
            ]);

            return response()->json([
                'message' => 'Registration successful' . ($isFirstUser ? ' (Admin Account Created)' : ''),
                'token' => $user->createToken('api-token')->plainTextToken,
                'user' => $user->load('role'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }


    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $user = User::where('email', $request->email)->first();

            if (! $user || ! Hash::check($request->password, $user->password)) {
                return response()->json(['message' => 'Invalid credentials'], 422);
            }

            return response()->json([
                'message' => 'Login successful',
                'token' => $user->createToken('api-token')->plainTextToken,
                'user' => $user->load('role'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Login failed: ' . $e->getMessage()
            ], 500);
        }
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
