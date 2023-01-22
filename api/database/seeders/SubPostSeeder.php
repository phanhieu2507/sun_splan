<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubPostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('sub_posts')->insert(
            [
                [
                    'post_id' => 4,
                    'content' => null,
                    'sub_content' => '10 章',
                    'contest_name' => null,
                    'contest_date' => null,
                    'max_score' => null,
                    'expected_score'    => null,
                    'achieved_score'    => null,
                    'document_name' => 'JLPT N3 Bunbo',
                    'type' => 'planCreation',
                    'success' => null,
                ],
                [
                    'post_id' => 4,
                    'content' => null,
                    'sub_content' => '12 章',
                    'contest_name' => null,
                    'contest_date' => null,
                    'max_score' => null,
                    'expected_score'    => null,
                    'achieved_score'    => null,
                    'document_name' => 'JLPT N3 Goi',
                    'type' => 'planCreation',
                    'success' => null,
                ],
                [
                    'post_id' => 4,
                    'content' => null,
                    'sub_content' => '42 時間',
                    'contest_name' => null,
                    'contest_date' => null,
                    'max_score' => null,
                    'expected_score'    => null,
                    'achieved_score'    => null,
                    'document_name' => 'Udemy Laravel Course',
                    'type' => 'planCreation',
                    'success' => null,
                ],
                [
                    'post_id' => 6,
                    'content' => '2020/09の目標を達成しました！',
                    'sub_content' => 'やった！',
                    'contest_name' => 'JLPT N3',
                    'contest_date' => '2020/09/01',
                    'max_score' => 180,
                    'expected_score' => 120,
                    'achieved_score' => 130,
                    'document_name' => null,
                    'type' => 'contest',
                    'success' => true,
                ],
                [
                    'post_id' => 6,
                    'content' => '2020/09の目標を達成しませんでした！',
                    'sub_content' => '残念！',
                    'contest_name' => 'TOEIC',
                    'contest_date' => '2020/09/01',
                    'max_score' => 990,
                    'expected_score' => 600,
                    'achieved_score' => 400,
                    'document_name' => null,
                    'type' => 'contest',
                    'success' => false,
                ],
                [
                    'post_id' => 6,
                    'content' => 'Javaの学習',
                    'sub_content' => 'done',
                    'contest_name' => null,
                    'contest_date' => null,
                    'max_score' => null,
                    'expected_score'    => null,
                    'achieved_score'    => null,
                    'document_name' => null,
                    'type' => 'freeContent',
                    'success' => true,
                ],
                [
                    'post_id' => 6,
                    'content' => 'Rubyの学習',
                    'sub_content' => null,
                    'contest_name' => null,
                    'contest_date' => null,
                    'max_score' => null,
                    'expected_score'    => null,
                    'achieved_score'    => null,
                    'document_name' => null,
                    'type' => 'freeContent',
                    'success' => false,
                ],
                [
                    'post_id' => 8,
                    'content' => '2020/09の目標を達成しました！',
                    'sub_content' => 'やった！',
                    'contest_name' => 'JLPT N3',
                    'contest_date' => '2020/09/01',
                    'max_score' => 180,
                    'expected_score' => 90,
                    'achieved_score' => 130,
                    'document_name' => null,
                    'type' => 'contest',
                    'success' => true,
                ],
                [
                    'post_id' => 8,
                    'content' => 'Laravelの学習',
                    'sub_content' => 'done',
                    'contest_name' => null,
                    'contest_date' => null,
                    'max_score' => null,
                    'expected_score'    => null,
                    'achieved_score'    => null,
                    'document_name' => null,
                    'type' => 'freeContent',
                    'success' => true,
                ],
            ]
        );
    }
}
