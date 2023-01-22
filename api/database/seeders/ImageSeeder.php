<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('images')->insert([
            [
                'img_link' =>
                'https://giaotrinhtiengnhat.com/
                sach-tieng-nhat/sach-luyen-thi-n3-mimikara-oboeru-tu-vung.html',
                'is_thumbnail' => 0,
                'type_id' => 1,
            ],
            [
                'img_link' =>
                'https://vnjpbook.com/wp-content/uploads/2020/09/sach-luyen-thi-n3-mimikara-oboeru-nghe-hieu-nhat-viet-ban-mau-2.jpg',
                'is_thumbnail' => 0,
                'type_id' => 1,
            ],
            [
                'img_link' => 'https://akira.edu.vn/wp-content/uploads/2019/11/de-thi-N3-JLPT.jpg',
                'is_thumbnail' => 1,
                'type_id' => 1,
            ],
            [
                'img_link' => 'https://bizweb.dktcdn.net/100/335/968/products/mimin3-1-1.jpg?v=1586658710993',
                'is_thumbnail' => 0,
                'type_id' => 1,
            ],
            [
                'img_link' => 'https://muakey.vn/laravel-phat-trien-ung-dung-web/',
                'is_thumbnail' => 1,
                'type_id' => 2,
            ],
            [
                'img_link' => 'https://thuanbui.me/kinh-nghiem-nhap-mon-react-js/',
                'is_thumbnail' => 1,
                'type_id' => 0,
            ],
            [
                'img_link' => 'https://res.cloudinary.com/kien-save-img/image/upload/v1661392514/de-thi-jlpt-n3_xloyxz.jpg',
                'is_thumbnail' => 1,
                'type_id' => 0,
            ],
            [
                'img_link' => 'https://res.cloudinary.com/kien-save-img/image/upload/v1661392576/791logo-toeic-15440892075481729847449_rekcaw.jpg',
                'is_thumbnail' => 1,
                'type_id' => 0,
            ],
            [
                'img_link' => 'https://res.cloudinary.com/kien-save-img/image/upload/v1661392647/images_ov6yua.png',
                'is_thumbnail' => 1,
                'type_id' => 0,
            ],
            [
                'img_link' => 'https://res.cloudinary.com/kien-save-img/image/upload/v1661697965/2._BVP-Logo_BK-RGB_bzve7q.jpg',
                'is_thumbnail' => 1,
                'type_id' => 0,
            ],
            [
                'img_link' => 'https://res.cloudinary.com/kien-save-img/image/upload/v1661697996/49204546_581029609007102_1545982587820834816_n_ase4e0.jpg',
                'is_thumbnail' => 1,
                'type_id' => 0,
            ],
            [
                'img_link' => 'https://res.cloudinary.com/kien-save-img/image/upload/v1661698274/Logodhbk_gtpxa8.jpg',
                'is_thumbnail' => 1,
                'type_id' => 0,
            ],
            [
                'img_link' => 'https://res.cloudinary.com/kien-save-img/image/upload/v1662470748/de-thi-jlpt-n1_m5luhl.jpg', //N1
                'is_thumbnail' => 1,
                'type_id' => 0,
            ],
            [
                'img_link' => 'https://res.cloudinary.com/kien-save-img/image/upload/v1662470750/de-thi-jlpt-n2_h28n32.jpg', //N2
                'is_thumbnail' => 1,
                'type_id' => 0,
            ],
            [
                'img_link' => 'https://res.cloudinary.com/kien-save-img/image/upload/v1662470753/JLPT-N4_oowphj.jpg', //N4
                'is_thumbnail' => 1,
                'type_id' => 0,
            ],
            [
                'img_link' => 'https://res.cloudinary.com/kien-save-img/image/upload/v1662470748/de-thi-jlpt-n5_ntots4.jpg', //N5
                'is_thumbnail' => 1,
                'type_id' => 0,
            ],
        ]);
    }
}
