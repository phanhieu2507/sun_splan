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
        Schema::create('sub_posts', function (Blueprint $table) {
            $table->id();
            $table->integer('post_id');
            $table->string('content')->nullable();
            $table->string('sub_content')->nullable();
            $table->string('contest_name')->nullable();
            $table->date('contest_date')->nullable();
            $table->double('max_score')->nullable();
            $table->double('expected_score')->nullable();
            $table->double('achieved_score')->nullable();
            $table->string('document_name')->nullable();
            $table->boolean('success')->nullable();
            $table->string('type')->nullable(); // 'freeContent' or 'contest' or 'study'
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
        Schema::dropIfExists('sub_posts');
    }
};
