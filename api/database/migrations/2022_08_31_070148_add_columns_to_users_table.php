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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'vietnamese_fullname')) {
                $table->string('vietnamese_fullname');
            }

            if (!Schema::hasColumn('users', 'japanese_fullname')) {
                $table->string('japanese_fullname');
            }

            if (!Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar')->nullable();
            }

            if (!Schema::hasColumn('users', 'role')) {
                $table->unsignedInteger('role')->default(1)->comment = '0:admin 1:naitei 2:mentor 3:teacher 4:manager';
            }

            if (!Schema::hasColumn('users', 'receive_naitei_date')) {
                $table->date('receive_naitei_date')->nullable();
            }

            if (!Schema::hasColumn('users', 'grade_code')) {
                $table->string('grade_code')->nullable();
            }

            if (!Schema::hasColumn('users', 'graduation_date')) {
                $table->date('graduation_date')->nullable();
            }

            if (!Schema::hasColumn('users', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'vietnamese_fullname')) {
                $table->dropColumn('vietnamese_fullname');
            }

            if (Schema::hasColumn('users', 'japanese_fullname')) {
                $table->dropColumn('japanese_fullname');
            }

            if (Schema::hasColumn('users', 'avatar')) {
                $table->dropColumn('avatar');
            }

            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }

            if (Schema::hasColumn('users', 'receive_naitei_date')) {
                $table->dropColumn('receive_naitei_date');
            }

            if (Schema::hasColumn('users', 'grade_code')) {
                $table->dropColumn('grade_code');
            }

            if (Schema::hasColumn('users', 'graduation_date')) {
                $table->dropColumn('graduation_date');
            }

            if (Schema::hasColumn('users', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });
    }
};
