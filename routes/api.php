<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('v1')->group(function () {
    Route::get('/reviews', [App\Http\Controllers\Api\ReviewController::class, 'index']);
    Route::get('/menu', [App\Http\Controllers\Api\MenuController::class, 'index']);

    Route::prefix('auth')->group(function () {
        Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
        Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [App\Http\Controllers\Api\AuthController::class, 'me']);
            Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
        });
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/bookings', [App\Http\Controllers\Api\BookingController::class, 'index']);
        Route::post('/bookings', [App\Http\Controllers\Api\BookingController::class, 'store']);
        Route::apiResource('cart', App\Http\Controllers\Api\CartController::class);
        Route::post('/checkout', [App\Http\Controllers\Api\CheckoutController::class, 'store']);
        Route::get('/orders', [App\Http\Controllers\Api\OrderController::class, 'index']);
    });

    Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
        Route::prefix('dashboard')->group(function () {
            Route::get('/stats', [App\Http\Controllers\Api\Admin\DashboardController::class, 'stats']);
            Route::get('/recent-orders', [App\Http\Controllers\Api\Admin\DashboardController::class, 'recentOrders']);
            Route::get('/recent-bookings', [App\Http\Controllers\Api\Admin\DashboardController::class, 'recentBookings']);
            Route::get('/revenue-chart', [App\Http\Controllers\Api\Admin\DashboardController::class, 'revenueChart']);
            Route::get('/popular-items', [App\Http\Controllers\Api\Admin\DashboardController::class, 'popularItems']);
        });

        Route::apiResource('menu', App\Http\Controllers\Api\Admin\MenuItemController::class);
        Route::apiResource('categories', App\Http\Controllers\Api\Admin\CategoryController::class);
        
        Route::apiResource('users', App\Http\Controllers\Api\Admin\UserController::class);
        Route::get('roles', function() {
            return response()->json(\App\Models\Role::all());
        });
        
        Route::get('orders', [App\Http\Controllers\Api\Admin\OrderController::class, 'index']);
        Route::patch('orders/{order}/status', [App\Http\Controllers\Api\Admin\OrderController::class, 'updateStatus']);
        
        Route::get('bookings', [App\Http\Controllers\Api\Admin\BookingController::class, 'index']);
        Route::patch('bookings/{booking}/status', [App\Http\Controllers\Api\Admin\BookingController::class, 'updateStatus']);
        
        Route::get('payments', [App\Http\Controllers\Api\Admin\PaymentController::class, 'index']);
        Route::patch('payments/{payment}/status', [App\Http\Controllers\Api\Admin\PaymentController::class, 'updateStatus']);

        Route::get('reviews', [App\Http\Controllers\Api\Admin\ReviewController::class, 'index']);
        Route::delete('reviews/{review}', [App\Http\Controllers\Api\Admin\ReviewController::class, 'destroy']);
        Route::patch('reviews/{review}/approve', [App\Http\Controllers\Api\Admin\ReviewController::class, 'approve']);
    });
});


