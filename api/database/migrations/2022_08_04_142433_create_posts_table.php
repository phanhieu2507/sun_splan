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
        Schema::create('posts', function (Blueprint $table) {
            $table->increments('id');
            $table->string('content')->nullable();
            $table->string('document_name')->nullable();
            $table->double('real_amount')->unsigned()->nullable();
            $table->double('real_time')->unsigned()->nullable();
            $table->unsignedInteger('type')->default(0)->comment = '0:progress 1:plan_edit 2:target_result';
            $table->bigInteger('target_id')->unsigned()->nullable();
            $table->bigInteger('plan_id')->unsigned()->nullable();
            $table->bigInteger('plan_detail_id')->unsigned()->nullable();
            $table->bigInteger('user_id')->unsigned();
            $table->string('sub_content')->nullable();
            $table->string('contest_name')->nullable();
            $table->date('contest_date')->nullable();
            $table->bigInteger('max_score')->unsigned()->nullable();
            $table->bigInteger('expected_score')->unsigned()->nullable();
            $table->bigInteger('achieved_score')->unsigned()->nullable();
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
        Schema::dropIfExists('posts');
    }
};
