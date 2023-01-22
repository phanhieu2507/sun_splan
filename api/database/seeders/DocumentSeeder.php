<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('documents')->insert([
            [
                'doc_name' => 'JLPT N3 Goi',
                'limit' => 12,
                'url' =>
                'https://giaotrinhtiengnhat.com/sach-tieng-nhat/sach-luyen-thi-n3-mimikara-oboeru-tu-vung.html',
                'doc_content' => 'Sách luyện thi N3 gối',
                'unit_id' => 3,
                'category_id' => 1,
                'user_id' => 1,
            ],
            [
                'doc_name' => 'JLPT N3 Bunbo',
                'limit' => 10,
                'url' =>
                'https://giaotrinhtiengnhat.com/sach-tieng-nhat/sach-luyen-thi-n3-mimikara-oboeru-tu-vung.html',
                'doc_content' => 'Sách luyện thi N3 bunbo',
                'unit_id' => 3,
                'category_id' => 1,
                'user_id' => 1,
            ],
            [
                'doc_name' => 'JLPT N3 Choukai',
                'limit' => 5,
                'url' =>
                'https://giaotrinhtiengnhat.com/sach-tieng-nhat/sach-luyen-thi-n3-mimikara-oboeru-tu-vung.html',
                'doc_content' => 'Sách luyện thi N3 choukai',
                'unit_id' => 3,
                'category_id' => 1,
                'user_id' => 1,
            ],
            [
                'doc_name' => 'Udemy Laravel Course',
                'limit' => 42,
                'url' => 'https://www.udemy.com/course/php-with-laravel-for-beginners-become-a-master-in-laravel/',
                'doc_content' => 'PHP with Laravel for beginners - Become a Master in Laravel',
                'unit_id' => 1,
                'category_id' => 3,
                'user_id' => 1,
            ],
        ]);
    }
}
