<?php

<<<<<<< HEAD
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
=======
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\CustomerController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\MenuItemController as AdminMenuItemController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Api\Admin\ReviewController as AdminReviewController;

Route::prefix('v1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::get('/menu', [MenuController::class, 'index']);
    Route::get('/reviews', [ReviewController::class, 'index']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::get('/cart', [CartController::class, 'index'])->middleware('role:customer');
        Route::post('/cart', [CartController::class, 'store'])->middleware('role:customer');
        Route::put('/cart/{cart}', [CartController::class, 'update'])->middleware('role:customer');
        Route::delete('/cart/{cart}', [CartController::class, 'destroy'])->middleware('role:customer');
        Route::post('/checkout', [CheckoutController::class, 'store'])->middleware('role:customer');
        Route::get('/orders', [OrderController::class, 'index'])->middleware('role:customer');
        Route::post('/bookings', [BookingController::class, 'store'])->middleware('role:customer');
        Route::post('/reviews', [ReviewController::class, 'store'])->middleware('role:customer');

        Route::prefix('admin')->middleware('role:admin')->group(function () {
            Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
            Route::get('/dashboard/recent-orders', [DashboardController::class, 'recentOrders']);
            Route::get('/dashboard/recent-bookings', [DashboardController::class, 'recentBookings']);
            Route::get('/dashboard/revenue-chart', [DashboardController::class, 'revenueChart']);
            Route::get('/dashboard/popular-items', [DashboardController::class, 'popularItems']);
            Route::apiResource('/categories', AdminCategoryController::class);
            Route::apiResource('/menu', AdminMenuItemController::class);
            Route::get('/orders', [AdminOrderController::class, 'index']);
            Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus']);
            Route::get('/bookings', [AdminBookingController::class, 'index']);
            Route::patch('/bookings/{booking}/status', [AdminBookingController::class, 'updateStatus']);
            Route::get('/customers', [CustomerController::class, 'index']);
            Route::get('/reviews', [AdminReviewController::class, 'index']);
            Route::patch('/reviews/{review}/approve', [AdminReviewController::class, 'approve']);
            Route::delete('/reviews/{review}', [AdminReviewController::class, 'destroy']);
            Route::get('/payments', [AdminPaymentController::class, 'index']);
            Route::patch('/payments/{payment}/status', [AdminPaymentController::class, 'updateStatus']);
        });
    });
>>>>>>> 6d22108 (Update)
});
