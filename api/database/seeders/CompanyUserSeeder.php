<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanyUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('companies_users')->insert(
            [
                [
                    'user_id' => 1,
                    'company_id' => 1,
                    'type' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'user_id' => 2,
                    'company_id' => 1,
                    'type' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'user_id' => 3,
                    'company_id' => 2,
                    'type' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'user_id' => 4,
                    'company_id' => 3,
                    'type' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'user_id' => 23,
                    'company_id' => 1,
                    'type' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'user_id' => 24,
                    'company_id' => 2,
                    'type' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'user_id' => 25,
                    'company_id' => 1,
                    'type' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'user_id' => 26,
                    'company_id' => 3,
                    'type' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'user_id' => 27,
                    'company_id' => 1,
                    'type' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'user_id' => 28,
                    'company_id' => 2,
                    'type' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]
        );
    }
}
