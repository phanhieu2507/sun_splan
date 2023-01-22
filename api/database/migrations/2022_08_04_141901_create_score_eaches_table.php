<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('score_eaches', function (Blueprint $table) {
            $table->increments('id');
            $table->string('part_name');
            $table->double('expected_score')->unsigned();
            $table->double('result')->unsigned()->nullable();
            $table->bigInteger('test_content_id')->unsigned();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('score_eaches');
    }
};
