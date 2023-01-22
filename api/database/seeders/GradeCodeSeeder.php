<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GradeCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('grade_codes')->insert([
            [
                'university_id' => '1',
                'code' => 'K64',
                'year' => '2019',
            ],
            [
                'university_id' => '1',
                'code' => 'K65',
                'year' => '2020',
            ],
            [
                'university_id' => '1',
                'code' => 'K66',
                'year' => '2021',
            ],
            [
                'university_id' => '1',
                'code' => 'K67',
                'year' => '2022',
            ],
            [
                'university_id' => '2',
                'code' => 'K64',
                'year' => '2019',
            ],
            [
                'university_id' => '2',
                'code' => 'K65',
                'year' => '2020',
            ],
            [
                'university_id' => '2',
                'code' => 'K66',
                'year' => '2021',
            ],
            [
                'university_id' => '2',
                'code' => 'K67',
                'year' => '2022',
            ],
            [
                'university_id' => '3',
                'code' => 'K18',
                'year' => '2018',
            ],
            [
                'university_id' => '3',
                'code' => 'K19',
                'year' => '2019',
            ],
            [
                'university_id' => '3',
                'code' => 'K20',
                'year' => '2020',
            ],
            [
                'university_id' => '3',
                'code' => 'K21',
                'year' => '2021',
            ],
            [
                'university_id' => '3',
                'code' => 'K22',
                'year' => '2022',
            ],
        ]);
    }
}
