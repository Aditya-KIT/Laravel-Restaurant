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
        $starters = Category::where('name', 'Starters')->first();
        $mains = Category::where('name', 'Mains')->first();
        $desserts = Category::where('name', 'Desserts')->first();
        $drinks = Category::where('name', 'Drinks')->first();

        $items = [
            // Starters
            [
                'name' => 'Gilawat Kebab',
                'category_id' => $starters?->id,
                'price' => 480,
                'sub_category' => 'Signature',
                'badge' => "Chef's Pick",
                'gradient' => 'linear-gradient(135deg,#3D1F08 0%,#8B4513 50%,#5D2E0C 100%)',
                'description' => 'Melt-in-mouth mutton kebabs with 160 spices, a Lucknowi legacy since 1987.',
                'is_available' => true,
            ],
            [
                'name' => 'Burrata Caprese',
                'category_id' => $starters?->id,
                'price' => 620,
                'sub_category' => 'Continental',
                'badge' => null,
                'gradient' => 'linear-gradient(135deg,#1A2E1A 0%,#2D5A27 50%,#1A3D1A 100%)',
                'description' => 'Creamy burrata with heirloom tomatoes, micro-basil, and aged balsamic.',
                'is_available' => true,
            ],
            [
                'name' => 'Tandoori Jhinga',
                'category_id' => $starters?->id,
                'price' => 780,
                'sub_category' => 'Seafood',
                'badge' => 'Bestseller',
                'gradient' => 'linear-gradient(135deg,#3D1A0A 0%,#B84A1A 50%,#7A2A08 100%)',
                'description' => 'Tiger prawns marinated in saffron yogurt, finished in our clay tandoor.',
                'is_available' => true,
            ],

            // Mains
            [
                'name' => 'Dum Biryani',
                'category_id' => $mains?->id,
                'price' => 850,
                'sub_category' => 'Heritage',
                'badge' => 'Heritage',
                'gradient' => 'linear-gradient(135deg,#2A1A08 0%,#C8651A 50%,#5D2E0C 100%)',
                'description' => 'Slow-cooked for 4 hours with aged basmati, saffron strands and tender mutton.',
                'is_available' => true,
            ],
            [
                'name' => 'Filet Mignon',
                'category_id' => $mains?->id,
                'price' => 1450,
                'sub_category' => 'Continental',
                'badge' => 'Premium',
                'gradient' => 'linear-gradient(135deg,#2A0808 0%,#8B1A1A 50%,#3D0808 100%)',
                'description' => '200g grass-fed tenderloin, truffle butter, asparagus and red wine reduction.',
                'is_available' => true,
            ],
            [
                'name' => 'Dal Makhani',
                'category_id' => $mains?->id,
                'price' => 380,
                'sub_category' => 'Vegetarian',
                'badge' => null,
                'gradient' => 'linear-gradient(135deg,#1A0A20 0%,#4A1A7A 50%,#2A0A3D 100%)',
                'description' => 'Black lentils slow-simmered overnight with butter and cream. Pure comfort.',
                'is_available' => true,
            ],

            // Desserts
            [
                'name' => 'Shahi Tukda',
                'category_id' => $desserts?->id,
                'price' => 280,
                'sub_category' => 'Indian Classic',
                'badge' => 'Signature',
                'gradient' => 'linear-gradient(135deg,#2A1A00 0%,#D4A000 50%,#7A5A00 100%)',
                'description' => 'Double ka meetha soaked in reduced milk, cardamom and silver leaf.',
                'is_available' => true,
            ],
            [
                'name' => 'Crème Brûlée',
                'category_id' => $desserts?->id,
                'price' => 380,
                'sub_category' => 'French',
                'badge' => null,
                'gradient' => 'linear-gradient(135deg,#2A2010 0%,#A07030 50%,#5A3A10 100%)',
                'description' => 'Classic vanilla custard with a caramelised sugar crust, served warm.',
                'is_available' => true,
            ],
            [
                'name' => 'Gulab Jamun',
                'category_id' => $desserts?->id,
                'price' => 220,
                'sub_category' => 'Traditional',
                'badge' => 'Loved',
                'gradient' => 'linear-gradient(135deg,#300A0A 0%,#B02020 50%,#5A0A0A 100%)',
                'description' => 'Soft khoya dumplings in rose saffron syrup, served with vanilla ice cream.',
                'is_available' => true,
            ],

            // Drinks
            [
                'name' => 'Saffron Lassi',
                'category_id' => $drinks?->id,
                'price' => 180,
                'sub_category' => 'Signature',
                'badge' => null,
                'gradient' => 'linear-gradient(135deg,#2A1A00 0%,#E8A030 50%,#8A5000 100%)',
                'description' => 'Thick yogurt blended with Kashmiri saffron, rose water and cardamom.',
                'is_available' => true,
            ],
            [
                'name' => 'Thandai',
                'category_id' => $drinks?->id,
                'price' => 160,
                'sub_category' => 'Traditional',
                'badge' => 'Classic',
                'gradient' => 'linear-gradient(135deg,#0A1A2A 0%,#2060A0 50%,#0A2A4A 100%)',
                'description' => 'Chilled milk with almonds, fennel, peppercorn and a touch of rose.',
                'is_available' => true,
            ],
            [
                'name' => 'Mocktail Royale',
                'category_id' => $drinks?->id,
                'price' => 240,
                'sub_category' => 'Crafted',
                'badge' => 'New',
                'gradient' => 'linear-gradient(135deg,#0A2A0A 0%,#1A8A1A 50%,#0A4A0A 100%)',
                'description' => 'Passion fruit, lychee and mint with a sparkling elderflower finish.',
                'is_available' => true,
            ],
        ];

        foreach ($items as $item) {
            MenuItem::updateOrCreate(['name' => $item['name']], $item);
        }
    }
}
