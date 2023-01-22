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
        Schema::create('test_contents', function (Blueprint $table) {
            $table->increments('id');
            $table->bigInteger('target_detail_id')->unsigned();
            $table->bigInteger('contest_id')->unsigned();
            $table->date('date_of_contest')->nullable();
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
        Schema::dropIfExists('test_contents');
    }
};
