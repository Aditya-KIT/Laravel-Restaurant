<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
<<<<<<< HEAD
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
=======
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            AdminSeeder::class,
            CategorySeeder::class,
            MenuItemSeeder::class,
        ]);
>>>>>>> 6d22108 (Update)
    }
}
