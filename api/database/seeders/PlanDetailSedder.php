<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlanDetailSedder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('plan_details')->insert([
            [
                'expected_amount' => 12,
                'real_amount' => 2,
                'doc_id' => 1,
                'plan_id' => 1,
            ],
            [
                'expected_amount' => 10,
                'real_amount' => 1,
                'doc_id' => 2,
                'plan_id' => 1,
            ],
            [
                'expected_amount' => 42,
                'real_amount' => 10,
                'doc_id' => 4,
                'plan_id' => 1,
            ],
        ]);
    }
}
