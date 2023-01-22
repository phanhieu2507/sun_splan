<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UniversityUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('universities_users')->insert([
            [
                'user_id' => 1,
                'university_id' => 1,
                'type' => 0,
            ],
            [
                'user_id' => 2,
                'university_id' => 1,
                'type' => 0,
            ],
            [
                'user_id' => 3,
                'university_id' => 2,
                'type' => 0,
            ],
            [
                'user_id' => 4,
                'university_id' => 3,
                'type' => 0,
            ],
            [
                'user_id' => 19,
                'university_id' => 1,
                'type' => 0,
            ],
            [
                'user_id' => 20,
                'university_id' => 2,
                'type' => 0,
            ],
            [
                'user_id' => 21,
                'university_id' => 1,
                'type' => 0,
            ],
            [
                'user_id' => 22,
                'university_id' => 3,
                'type' => 0,
            ],
            [
                'user_id' => 26,
                'university_id' => 1,
                'type' => 0,
            ],
            [
                'user_id' => 27,
                'university_id' => 1,
                'type' => 0,
            ],
            [
                'user_id' => 28,
                'university_id' => 1,
                'type' => 0,
            ],

        ]);
    }
}
