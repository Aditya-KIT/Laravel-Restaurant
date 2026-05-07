<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $starter = Category::where('name', 'Starters')->first();
        $main = Category::where('name', 'Main Course')->first();

        MenuItem::updateOrCreate(['name' => 'Tomato Soup'], [
            'category_id' => $starter?->id,
            'price' => 120,
            'description' => 'Fresh tomato soup with herbs',
            'is_available' => true,
        ]);

        MenuItem::updateOrCreate(['name' => 'Paneer Tikka'], [
            'category_id' => $main?->id,
            'price' => 320,
            'description' => 'Grilled paneer cubes with spices',
            'is_available' => true,
        ]);
    }
}
