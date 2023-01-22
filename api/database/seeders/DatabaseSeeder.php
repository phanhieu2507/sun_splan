<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(UnitSeeder::class);
        $this->call(CategorySeeder::class);
        $this->call(PostSeeder::class);
        $this->call(PlanDetailSedder::class);
        $this->call(PlanSeeder::class);
        $this->call(ImageSeeder::class);
        $this->call(LikeSeeder::class);
        $this->call(CommentSeeder::class);
        $this->call(DocumentSeeder::class);
        $this->call(ScoreEachSeeder::class);
        $this->call(TargetSeeder::class);
        $this->call(TargetDetailSeeder::class);
        $this->call(TestContentSeeder::class);
        $this->call(ContestSeeder::class);
        $this->call(ContestScoreEachSeeder::class);
        $this->call(FreeContentSeeder::class);
        $this->call(CompanySeeder::class);
        $this->call(CompanyUserSeeder::class);
        $this->call(UniversitySeeder::class);
        $this->call(UniversityUserSeeder::class);
        $this->call(GradeCodeSeeder::class);
        $this->call(SubPostSeeder::class);
    }
}
