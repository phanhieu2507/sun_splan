<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('companies')->insert([
            [
                'company_name' => 'Money Forward',
                'company_info' => 'KGKkdksjkdjsksjdksjdksdjskd',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_name' => 'Yumemi',
                'company_info' => 'KGKkdksjkdjsksjdksjdksdjskd',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_name' => 'Sun',
                'company_info' => 'KGKkdksjkdjsksjdksjdksdjskd',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_name' => 'Fast Retailing',
                'company_info' => 'KGKkdksjkdjsksjdksjdksdjskd',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_name' => 'Brain Tech',
                'company_info' => 'KGKkdksjkdjsksjdksjdksdjskd',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
