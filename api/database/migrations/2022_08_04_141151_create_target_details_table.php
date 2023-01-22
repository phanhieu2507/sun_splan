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
        Schema::create('target_details', function (Blueprint $table) {
            $table->increments('id');
            $table->bigInteger('target_id')->unsigned();
            $table->bigInteger('category_id')->unsigned();
            $table->unsignedInteger('type')->default(0)->comment = '0:test 1:freetext';
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
        Schema::dropIfExists('target_details');
    }
};
