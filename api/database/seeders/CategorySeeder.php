<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('categories')->insert(
            [
                [
                    'name' => '日本語',
                ],
                [
                    'name' => '英語',
                ],
                [
                    'name' => 'IT知識・技術',
                ],
                [
                    'name' => 'その他',
                ],
            ]
        );
    }
}
