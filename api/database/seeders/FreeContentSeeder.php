<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FreeContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('free_contents')->insert([
            [
                'content' => 'Javaの学習',
                'result' => 'done',
                'target_detail_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'content' => 'Rubyの学習',
                'result' => null,
                'target_detail_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'content' => 'Javaの学習',
                'result' => 'done',
                'target_detail_id' => 7,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'content' => 'Rubyの学習',
                'result' => null,
                'target_detail_id' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'content' => 'Javaの学習',
                'result' => 'done',
                'target_detail_id' => 11,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'content' => 'Rubyの学習',
                'result' => null,
                'target_detail_id' => 12,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'content' => 'Javaの学習',
                'result' => 'done',
                'target_detail_id' => 15,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'content' => 'Rubyの学習',
                'result' => null,
                'target_detail_id' => 16,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'content' => 'Javaの学習',
                'result' => 'done',
                'target_detail_id' => 19,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'content' => 'Rubyの学習',
                'result' => null,
                'target_detail_id' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'content' => 'Javaの学習',
                'result' => 'done',
                'target_detail_id' => 23,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'content' => 'Rubyの学習',
                'result' => null,
                'target_detail_id' => 24,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'content' => 'Javaの学習',
                'result' => 'done',
                'target_detail_id' => 27,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'content' => 'Rubyの学習',
                'result' => null,
                'target_detail_id' => 28,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'content' => 'Javaの学習',
                'result' => 'done',
                'target_detail_id' => 31,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'content' => 'Rubyの学習',
                'result' => null,
                'target_detail_id' => 32,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'content' => 'Javaの学習',
                'result' => 'done',
                'target_detail_id' => 35,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'content' => 'Rubyの学習',
                'result' => null,
                'target_detail_id' => 36,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
