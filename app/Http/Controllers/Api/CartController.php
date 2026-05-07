<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddToCartRequest;
use App\Http\Requests\Cart\UpdateCartRequest;
use App\Models\Cart;
use Illuminate\Http\JsonResponse;

class CartController extends Controller
{
    public function index(): JsonResponse
    {
        $items = Cart::with('menuItem')->where('user_id', auth()->id())->get();
        return response()->json($items);
    }

    public function store(AddToCartRequest $request): JsonResponse
    {
        $cart = Cart::updateOrCreate(
            ['user_id' => auth()->id(), 'menu_item_id' => $request->menu_item_id],
            ['quantity' => $request->quantity]
        );

        return response()->json(['message' => 'Cart updated', 'item' => $cart->load('menuItem')], 201);
    }

    public function update(UpdateCartRequest $request, Cart $cart): JsonResponse
    {
        abort_unless($cart->user_id === auth()->id(), 403);
        $cart->update(['quantity' => $request->quantity]);
        return response()->json(['message' => 'Quantity updated']);
    }

    public function destroy(Cart $cart): JsonResponse
    {
        abort_unless($cart->user_id === auth()->id(), 403);
        $cart->delete();
        return response()->json(['message' => 'Cart item removed']);
    }
}
