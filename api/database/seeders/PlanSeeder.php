<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('plans')->insert([
            [
                'target_id' => 1,
                'user_id' => 1,
            ],
            [
                'target_id' => 2,
                'user_id' => 1,
            ],
            [
                'target_id' => 3,
                'user_id' => 1,
            ],
            [
                'target_id' => 4,
                'user_id' => 1,
            ],
            [
                'target_id' => 5,
                'user_id' => 1,
            ],
            [
                'target_id' => 6,
                'user_id' => 1,
            ],
            [
                'target_id' => 7,
                'user_id' => 1,
            ],
            [
                'target_id' => 8,
                'user_id' => 1,
            ],
            [
                'target_id' => 9,
                'user_id' => 1,
            ],
        ]);
    }
}
