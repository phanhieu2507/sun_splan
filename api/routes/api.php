<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ContestController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\InformationUniversityController;
use App\Http\Controllers\InformationUserController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\TargetController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UniversityController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WebInit;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/web-init', WebInit::class);


//Target info
Route::get('/target/user/{userId}', [TargetController::class, 'getAllTargets']);
Route::get('/target/thisMonth/{userId}', [TargetController::class, 'getThisMonthTarget']);
Route::get('/target/{targetId}', [TargetController::class, 'getTargetById']);
Route::put('/target/editTarget', [TargetController::class, 'editTarget']);
//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});

//Document API
Route::post('/document/create', [DocumentController::class, 'createDocument']);
Route::post('/document/edit', [DocumentController::class, 'editDocument']);
Route::delete('/document/delete/{docId}', [DocumentController::class, 'deleteDocument']);
Route::get('/document/get-all', [DocumentController::class, 'getAllDocs']);
Route::get('/document/get-by-search', [DocumentController::class, 'searchDocs']);
Route::get('/document/get-by-id/{id}', [DocumentController::class, 'getDocById']);

//GetAll
Route::get('/companies', [CompanyController::class, 'getAllCompanies']);
Route::get('/universities', [UniversityController::class, 'getAllUniversity']);

//C1
Route::get('/user/posts', [UserController::class, 'getAllPostByUserId']);
Route::get('/user/posts/{postId}', [PostController::class, 'getPostById']);
Route::get('/user/target', [UserController::class, 'getThisMonthTargetByUserId']);
Route::get('/user/naiteishas', [UserController::class, 'findNaiteishaByNameFilterByCompanyAndGraduationYear']);

Route::get('/user/plan-details/', [UserController::class, 'getAllTargetDetailForC1CreatePostModal']);
Route::get('/user/naiteisha', [UserController::class, 'getNaiteishaInfoByUserId']);
Route::post('/posts/create-post/', [PostController::class, 'createType1Post']);

//Post Api
Route::get('/likes', [LikeController::class, 'getAllLikeByPostId']);
Route::post('/toggle-like', [LikeController::class, 'toggleLike']);
Route::get('/posts/{post_id}/comments', [CommentController::class, 'getAllCommentByPostId']);
Route::post('/posts/{post_id}/comments', [CommentController::class, 'createComment']);
Route::put('/comments/{commentId}', [CommentController::class, 'editComment']);
Route::delete('/comments/{commentId}', [CommentController::class, 'deleteComment']);
Route::group(['middleware' => ['auth:sanctum']], function () {
    //C11
});

//A1
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/auth/logout', [AuthController::class, 'logout']);

//E11
Route::get('user/user-type/{userType}', [UserController::class, 'getAllUserByUserType']);
Route::delete('/user/user-manager/{userID}', [UserController::class, 'deleteUserByUserId']);

//Contest
Route::get('/contest/get-all', [ContestController::class, 'getAllContests']);
Route::get('/contest/get-by-search-name', [ContestController::class, 'searchContestsByName']);

//C3-Edit Result
Route::post('/target/update-result', [ResultController::class, 'updateTarget']);
Route::post('/target/update-status', [ResultController::class, 'updateStatus']);

//C3-Create Target
//Route::get('/category/get-all-contests', [CategoryController::class, 'getAllTargetCategories']);
Route::get('targets/date-of-target/{userId}', [TargetController::class, 'getAllTargetByUserId']);
Route::get('/contest/filter', [ContestController::class, 'searchContestsFilterByNameAndCategory']);
Route::post('/target/create', [TargetController::class, 'createTarget']);

//C3-editplan
Route::post('/plan/edit', [PlanController::class, 'editPlan']);


//E1-2
Route::post('/user/create-user', [UserController::class, 'createUser']);
Route::get('/user/get-inf', [CompanyController::class, 'getAllCompaniesUniversities']);

//Category
Route::get('/category/get-all', [CategoryController::class, 'getAllCategories']);

//Unit
Route::get('/unit/get-all', [UnitController::class, 'getAllUnits']);

//E13
Route::get('/user/detail', [InformationUserController::class, 'informationUser']);
Route::post('/user/detail/{userId}', [InformationUserController::class, 'updateInformationUser']);
Route::delete('/user/delete/{userId}', [InformationUserController::class, 'deleteUser']);

//E51
Route::get('/test', [ContestController::class, 'getAllTests']);
Route::delete('/test/{testId}', [ContestController::class, 'deleteTestById']);
Route::get('/tests/filter', [ContestController::class, 'searchContestsByName']);
//E5-2

Route::post('/test/create', [ContestController::class, 'createContest']);

//E5-3
Route::get('/contest/{contestId}', [ContestController::class, 'getContestById']); // get contest by id
Route::post('/contest/edit/{id}', [ContestController::class, 'updateContest']); //edit contest

//E31
Route::get('/universities/filter', [UniversityController::class, 'getUniversitiesFilterByName']);
Route::delete('/universities/{universityId}', [UniversityController::class, 'deleteUniversityById']);

//E33 - update university
Route::get('/universities/{universityId}', [InformationUniversityController::class, 'getUniversityById']);  // get university by Id
Route::post('/universities/edit/{universityId}', [InformationUniversityController::class, 'updateUniversity']); // update university by Id
Route::post('/universities/create', [InformationUniversityController::class, 'create']);
