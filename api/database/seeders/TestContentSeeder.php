<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('test_contents')->insert([
            [
                'target_detail_id' => 1,
                'contest_id' => 1,
                'date_of_contest' => '2020-07-03',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'target_detail_id' => 2,
                'contest_id' => 2,
                'date_of_contest' => '2020-07-06',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'target_detail_id' => 5,
                'contest_id' => 4,
                'date_of_contest' => '2020-12-05',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'target_detail_id' => 6,
                'contest_id' => 2,
                'date_of_contest' => '2021-12-05',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'target_detail_id' => 9,
                'contest_id' => 5,
                'date_of_contest' => '2022-12-03',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'target_detail_id' => 10,
                'contest_id' => 2,
                'date_of_contest' => '2020-07-10',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'target_detail_id' => 13,
                'contest_id' => 1,
                'date_of_contest' => '2021-07-09',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'target_detail_id' => 14,
                'contest_id' => 2,
                'date_of_contest' => '2021-12-10',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'target_detail_id' => 17,
                'contest_id' => 4,
                'date_of_contest' => '2022-07-03',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'target_detail_id' => 18,
                'contest_id' => 2,
                'date_of_contest' => '2022-12-31',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'target_detail_id' => 21,
                'contest_id' => 5,
                'date_of_contest' => '2020-07-21',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'target_detail_id' => 22,
                'contest_id' => 2,
                'date_of_contest' => '2020-07-23',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'target_detail_id' => 25,
                'contest_id' => 4,
                'date_of_contest' => '2020-07-10',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'target_detail_id' => 26,
                'contest_id' => 2,
                'date_of_contest' => '2021-07-23',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'target_detail_id' => 29,
                'contest_id' => 5,
                'date_of_contest' => '2020-10-20',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'target_detail_id' => 30,
                'contest_id' => 2,
                'date_of_contest' => '2020-12-01',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'target_detail_id' => 33,
                'contest_id' => 1,
                'date_of_contest' => '2020-12-02',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'target_detail_id' => 34,
                'contest_id' => 2,
                'date_of_contest' => '2022-12-05',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
