<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('contests')->insert([
            [
                'contest_name' => 'JLPT N3',
                'pass_score' => 95,
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
                'total_score' => 180,
                'image_id' => 7,
                'category_id' => 1,
            ],
            [
                'contest_name' => 'TOEIC',
                'pass_score' => 450,
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
                'total_score' => 990,
                'image_id' => 8,
                'category_id' => 1,
            ],
            [
                'contest_name' => 'The Fundamentals of Engineering (FE) ',
                'pass_score' => 60,
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
                'total_score' => 100,
                'image_id' => 9,
                'category_id' => 1,
            ],
            [
                'contest_name' => 'JLPT N1',
                'pass_score' => 100,
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
                'total_score' => 180,
                'image_id' => 13,
                'category_id' => 1,
            ],
            [
                'contest_name' => 'JLPT N2',
                'pass_score' => 90,
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
                'total_score' => 180,
                'image_id' => 14,
                'category_id' => 1,
            ],
            [
                'contest_name' => 'JLPT N4',
                'pass_score' => 90,
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
                'total_score' => 180,
                'image_id' => 15,
                'category_id' => 1,
            ],
            [
                'contest_name' => 'JLPT N5',
                'pass_score' => 80,
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
                'total_score' => 180,
                'image_id' => 16,
                'category_id' => 1,
            ],
        ]);
    }
}
