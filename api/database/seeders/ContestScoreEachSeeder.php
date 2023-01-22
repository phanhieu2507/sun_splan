<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContestScoreEachSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('contest_score_eaches')->insert([
            [
                'contest_id' => 1,
                'max_score' => 60,
                'name' => '言語知識',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'contest_id' => 1,
                'max_score' => 60,
                'name' => '読解',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'contest_id' => 1,
                'max_score' => 60,
                'name' => '聴解',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'contest_id' => 2,
                'max_score' => 495,
                'name' => 'Reading',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'contest_id' => 2,
                'max_score' => 495,
                'name' => 'Listening',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'contest_id' => 4,
                'max_score' => 60,
                'name' => '言語知識',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'contest_id' => 4,
                'max_score' => 60,
                'name' => '読解',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'contest_id' => 4,
                'max_score' => 60,
                'name' => '聴解',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'contest_id' => 5,
                'max_score' => 60,
                'name' => '言語知識',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'contest_id' => 5,
                'max_score' => 60,
                'name' => '読解',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'contest_id' => 5,
                'max_score' => 60,
                'name' => '聴解',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'contest_id' => 6,
                'max_score' => 60,
                'name' => '言語知識',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'contest_id' => 6,
                'max_score' => 60,
                'name' => '読解',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'contest_id' => 6,
                'max_score' => 60,
                'name' => '聴解',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'contest_id' => 7,
                'max_score' => 60,
                'name' => '言語知識',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'contest_id' => 7,
                'max_score' => 60,
                'name' => '読解',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'contest_id' => 7,
                'max_score' => 60,
                'name' => '聴解',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
