<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UniversitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('universities')->insert([
            [
                'name' => 'ハノイ工科大学',
                'abbreviation' => 'HUST',
                'image_id' => 10,
            ],
            [
                'name' => 'ハノイ国家大学',
                'abbreviation' => 'VNU',
                'image_id' => 11,
            ],
            [
                'name' => 'ダナン工科大学',
                'abbreviation' => 'DUT',
                'image_id' => 12,
            ],
        ]);
    }
}
