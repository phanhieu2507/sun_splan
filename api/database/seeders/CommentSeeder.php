<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('comments')->insert([
            [
                'post_id' => 1,
                'user_id' => 2,
                'content' => 'Sugoi desune!!',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'post_id' => 1,
                'user_id' => 3,
                'content' => 'Erai desune!!',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'post_id' => 2,
                'user_id' => 4,
                'content' => 'Kanpai',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
