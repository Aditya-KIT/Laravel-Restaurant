<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checkout\StoreOrderRequest;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $user = auth()->user();
        $cartItems = Cart::with('menuItem')->where('user_id', $user->id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        $order = DB::transaction(function () use ($request, $user, $cartItems) {
            $total = $cartItems->sum(fn ($item) => $item->menuItem->price * $item->quantity);

            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $total,
                'status' => 'pending',
                'address' => $request->address,
                'phone' => $request->phone,
                'notes' => $request->notes,
            ]);

            foreach ($cartItems as $item) {
                $order->items()->create([
                    'menu_item_id' => $item->menu_item_id,
                    'quantity' => $item->quantity,
                    'price' => $item->menuItem->price,
                ]);
            }

            Payment::create([
                'order_id' => $order->id,
                'method' => $request->payment_method,
                'status' => $request->payment_method === 'cod' ? 'pending' : 'failed',
                'amount' => $total,
            ]);

            Cart::where('user_id', $user->id)->delete();

            return $order;
        });

        return response()->json(['message' => 'Order placed', 'order' => $order->load('items.menuItem', 'payment')], 201);
    }
}
