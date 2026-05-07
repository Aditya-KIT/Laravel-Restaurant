<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MenuItemRequest;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;

class MenuItemController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(MenuItem::with('category')->latest()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MenuItemRequest $request): JsonResponse
    {
        return response()->json(MenuItem::create($request->validated()), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(MenuItem $menu): JsonResponse
    {
        return response()->json($menu->load('category'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MenuItemRequest $request, MenuItem $menu): JsonResponse
    {
        $menu->update($request->validated());
        return response()->json($menu);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MenuItem $menu): JsonResponse
    {
        $menu->delete();
        return response()->json(['message' => 'Menu item deleted']);
    }
}
