<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Mail\SendPassword;
use App\Models\Company;
use App\Models\CompanyUser;
use App\Models\PlanDetail;
use App\Models\Post;
use App\Models\TargetDetail;
use App\Models\University;
use App\Models\UniversityUser;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function getAllPostByUserId(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $userId = $request->input('user_id');

        //0:progress 1:plan_edit 2:target_result
        //Chia lai cac loai Post
        //0 : 61,62,64 Post binh thuong cua user thong bao hoc tap hang ngay. Nguoi dung post
        //1 : 63,65 Bai kiem tra thanh cong hay that bai. Tu dong
        //2: 66 Tao ke hoach moi. Tu dong
        //3: 67 Tien do hoc tap 25 50 75 100. Tu dong
        $postsType0 = Post::with('planDetails.document.unit', 'likes', 'comments')->where('type', 0)
            ->withCount('likes', 'comments')->where('user_id', $userId)->get();
        $postsType3 = Post::with('likes', 'comments')->withCount('likes', 'comments')->where('user_id', $userId)->where('type', 3)->get();
        $postsType1 = Post::with('likes', 'comments', 'subPosts')->withCount('likes', 'comments')->where('user_id', $userId)->where('type', 1)->get();
        $postsType2 = Post::with('likes', 'comments', 'subPosts')->withCount('likes', 'comments')->where('user_id', $userId)->where('type', 2)->get();

        $user = User::find($userId)->first();
        $userName = $user->japanese_fullname;
        $avatar = $user->avatar;

        $arr4 = $postsType2->map(function ($post) use ($userName, $avatar) {
            $likes = $post->likes->map((function ($like) {
                return [
                    'user_id' => $like->id,
                    'username' => $like->japanese_fullname,
                ];
            }));

            $comments = $post->comments->map((function ($comment) {
                return [
                    'user_id' => $comment->id,
                    'username' => $comment->japanese_fullname,
                ];
            }));

            $subPosts = $post->subPosts->map((function ($subPost) {
                return [
                    'id' => $subPost->id,
                    'postId' => $subPost->post_id,
                    'content' => $subPost->content,
                    'subContent' => $subPost->sub_content,
                    'documentName' => $subPost->document_name,
                    'type' => $subPost->type,
                ];
            }));

            return [
                'japanese_fullname' => $userName,
                'id' => $post->id,
                'content' => $post->content,
                'subContent' => $post->sub_content,
                'type' => $post->type,
                'userId' => $post->user_id,
                'likesCount' => $post->likes_count,
                'commentsCount' => $post->comments_count,
                'createdAt' => $post->created_at,
                'likes' => $likes,
                'comments' => $comments,
                'avatar' => $avatar,
                'subPosts' => $subPosts,
            ];
        });

        $arr3 = $postsType1->map(function ($post) use ($userName, $avatar) {
            $likes = $post->likes->map((function ($like) {
                return [
                    'user_id' => $like->id,
                    'username' => $like->japanese_fullname,
                ];
            }));

            $comments = $post->comments->map((function ($comment) {
                return [
                    'user_id' => $comment->id,
                    'username' => $comment->japanese_fullname,
                ];
            }));

            $subPosts = $post->subPosts->map((function ($subPost) {
                return [
                    'id' => $subPost->id,
                    'postId' => $subPost->post_id,
                    'content' => $subPost->content,
                    //'subContent' => $subPost->sub_content,
                    'contestName' => $subPost->contest_name,
                    'contestDate' => $subPost->contest_date,
                    'maxScore' => $subPost->max_score,
                    'expectedScore' => $subPost->expected_score,
                    'achievedScore' => $subPost->achieved_score,
                    'type' => $subPost->type,
                    //'success' => $subPost->success,
                ];
            }));

            return [
                'japanese_fullname' => $userName,
                'id' => $post->id,
                'content' => $post->content,
                'subContent' => $post->sub_content,
                'type' => $post->type,
                'userId' => $post->user_id,
                'likesCount' => $post->likes_count,
                'commentsCount' => $post->comments_count,
                'createdAt' => $post->created_at,
                'likes' => $likes,
                'comments' => $comments,
                'avatar' => $avatar,
                'subPosts' => $subPosts,
                'createdAt' => $post->created_at,
                'success' => $post->success,
            ];
        });

        $arr1 = $postsType0->map(function ($post) use ($userName, $avatar) {
            $temp = strval($post->real_amount);
            $unit = $post->planDetails->document->unit->name;
            $timeOnly = false;
            if ($unit === '時間') {
                $content = "$temp 時間";
                $timeOnly = true;
            } else {
                $content  = "$temp $unit";
                if ($post->real_time !== null) {
                    $tmp = strval($post->real_time);
                    $content = "$content / $tmp 時間";
                }
            }

            $likes = $post->likes->map((function ($like) {
                return [
                    'user_id' => $like->id,
                    'username' => $like->japanese_fullname,
                ];
            }));

            $comments = $post->comments->map((function ($comment) {
                return [
                    'user_id' => $comment->id,
                    'username' => $comment->japanese_fullname,
                ];
            }));

            return [
                'japanese_fullname' => $userName,
                'id' => $post->id,
                'memo' => $post->content,
                'realAmount' => $post->real_amount,
                'realTime' => $post->real_time,
                'type' => $post->type,
                'userId' => $post->user_id,
                'likesCount' => $post->likes_count,
                'commentsCount' => $post->comments_count,
                'documentName' => $post->planDetails->document->doc_name,
                'createdAt' => $post->created_at,
                'content' => $content,
                'timeOnly' => $timeOnly,
                'likes' => $likes,
                'comments' => $comments,
                'avatar' => $avatar,
            ];
        });

        $arr2 = $postsType3->map(function ($post) use ($userName, $avatar) {
            $likes = $post->likes->map((function ($like) {
                return [
                    'user_id' => $like->id,
                    'username' => $like->japanese_fullname,
                ];
            }));

            $comments = $post->comments->map((function ($comment) {
                return [
                    'user_id' => $comment->id,
                    'username' => $comment->japanese_fullname,
                ];
            }));

            return [
                'japanese_fullname' => $userName,
                'id' => $post->id,
                'content' => $post->content,
                'type' => $post->type,
                'userId' => $post->user_id,
                'likesCount' => $post->likes_count,
                'commentsCount' => $post->comments_count,
                'createdAt' => $post->created_at,
                'sub_content' => $post->sub_content,
                'max_score' => $post->max_score,
                'expected_score' => $post->expected_score,
                'achieved_score' => $post->achieved_score,
                'contest_name' => $post->contest_name,
                'contest_date' => $post->contest_date,
                'document_name' => $post->document_name,
                'likes' => $likes,
                'comments' => $comments,
                'avatar' => $avatar,
            ];
        });
        $posts = array_merge($arr1->toArray(), $arr2->toArray(), $arr3->toArray(), $arr4->toArray());
        $posts = collect($posts)->sortByDesc('createdAt')->values()->all();

        return response()->json(
            [
                'data' => $posts,
                'success' => true,
                'message' => 'Successfully get all posts by user id',
            ],
            200
        );
    }

    public function getThisMonthTargetByUserId(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(
                [
                    'data' => $validator->errors(),
                    'success' => false,
                    'message' => 'Validation Error',
                ],
                400
            );
        }

        $userId = $request->input('user_id');
        $time = now();

        $freeContentTarget = TargetDetail::with('target', 'freeContent', 'category')->whereHas('target', function (Builder $query) use ($time, $userId) {
            $query->where('user_id', $userId)->whereMonth('date_of_target', $time->month)->whereYear('date_of_target', $time->year);
        })->where('type', 1)->get();
        $testContentTarget = TargetDetail::with('target', 'testContent.contest.contestScoreEachs', 'testContent.scoreEachs', 'category')
            ->whereHas('target', function (Builder $query) use ($time, $userId) {
                $query->where('user_id', $userId)->whereMonth('date_of_target', $time->month)->whereYear('date_of_target', $time->year);
            })->where('type', 0)->get();

        $freeContentTarget = $freeContentTarget->map(function ($item) {
            return [
                'id' => $item->id,
                'type' => $item->type,
                'categoryName' => $item->category->name,
                'categoryId' => $item->category->id,
                'content' => $item->freeContent->content,
                'dateOfTarget' => $item->target->date_of_target,
                'checkDone' => $item->freeContent->result === 'done',
            ];
        });

        $testContentTarget = $testContentTarget->map(function ($item) {
            $expectedScore = $item->testContent->scoreEachs->sum('expected_score');
            $actualScore = $item->testContent->scoreEachs->sum('result');
            $maxScore = $item->testContent->contest->contestScoreEachs->sum('max_score');
            $contestName = $item->testContent->contest->contest_name;

            return [
                'id' => $item->id,
                'type' => $item->type,
                'categoryName' => $item->category->name,
                'categoryId' => $item->category->id,
                'content' => $item->testContent->content,
                'dateOfTarget' => $item->created_at,
                'checkDone' => $actualScore >= $expectedScore,
                'expectedScore' => $expectedScore,
                'actualScore' => $actualScore,
                'maxScore' => $maxScore,
                'contestName' => $contestName,
            ];
        });

        $completedTestContentTarget = $testContentTarget->filter(function ($item) {
            return $item['checkDone'];
        });

        $inCompletedTestContentTarget = $testContentTarget->filter(function ($item) {
            return $item['checkDone'] === false;
        });

        $completedFreeContentTarget = $freeContentTarget->filter(function ($item) {
            return $item['checkDone'];
        });

        $inCompletedFreeContentTarget = $freeContentTarget->filter(function ($item) {
            return $item['checkDone'] === false;
        });

        $completed = $completedTestContentTarget->merge($completedFreeContentTarget);
        $inCompleted = $inCompletedTestContentTarget->merge($inCompletedFreeContentTarget);

        return response()->json(
            [
                'data' => [
                    'completed' => $completed,
                    'inCompleted' => $inCompleted,
                ],
                'message' => 'Successfully get this month target by user id',
                'success' => true,
            ],
            200
        );
    }

    public function findNaiteishaByNameFilterByCompanyAndGraduationYear(Request $request)
    {
        // param: name,company,graduation_year
        $validator = Validator::make($request->input(), [
            'name' => 'string|max:64',
            'company_id' => 'integer',
            'graduation_year' => 'integer|min:1900|max:2100',
        ]);
        if ($validator->fails()) {
            return response()->json(
                [
                    'data' => $validator->errors(),
                    'success' => false,
                    'message' => 'Validation Error',
                ],
                400
            );
        }

        if (!$request->has('name')) {
            $naiteishas = User::with('companies')->role(1)->graduationYear($request)->get();
        } else {
            $name = $request->input('name');
            $naiteishas = User::with('companies')->where('vietnamese_fullname', 'like', '%'.$name.'%')
                ->orWhere('japanese_fullname', 'like', '%'.$name.'%')
                ->role(1)->graduationYear($request)->get();
        }

        $data = $naiteishas->map(function ($naiteisha) {
            return [
                'id' => $naiteisha->id,
                'username' => $naiteisha->username,
                'vietnameseFullname' => $naiteisha->vietnamese_fullname,
                'japaneseFullname' => $naiteisha->japanese_fullname,
                'avatar' => $naiteisha->avatar,
                'gradeCode' => $naiteisha->grade_code,
                'receiveNaiteiDate' => $naiteisha->receive_naitei_date,
                'graduationDate' => $naiteisha->graduation_date,
                'companyName' => $naiteisha->companies->first()->company_name,
                'companyId' => $naiteisha->companies->first()->id,
            ];
        });

        if (Auth::check()) {
            $role = Auth::user()->role;
            if ($role === 4) {
                $companyName = User::with('companies')->find(Auth::id())->companies->first()->company_name;
                $data = $data->filter(function ($item) use ($companyName) {
                    return $item['companyName'] === $companyName;
                });
            }
        }

        if ($request->has('company_id')) {
            $data = $data->filter(function ($item) use ($request) {
                return $item['companyId'] === intval($request->input('company_id'));
            });
        }

        $graduated = $data->filter(function ($item) {
            return $item['graduationDate'] < Carbon::now();
        });
        $undergraduated = $data->filter(function ($item) {
            return $item['graduationDate'] >= Carbon::now();
        });

        $undergraduated = $undergraduated->sortByDesc('graduationDate');

        $graduated = $graduated->sortBy('graduationDate');

        $data = $undergraduated->merge($graduated);

        return response()->json(
            [
                'data' => $data,
                'success' => true,
                'message' => 'Successfully get all naiteisha by name filter by company and graduation year',
            ],
            200
        );
    }

    public function getNaiteishaInfoByUserId(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(
                [
                    'data' => $validator->errors(),
                    'message' => $validator->errors()->first(),
                    'success' => false,
                ],
                400
            );
        }

        $userId = $request->input('user_id');
        $naiteishas = User::with('universities', 'companies')->where('id', $userId)->role(1)->get();

        $data = $naiteishas->map(function ($naiteisha) {
            return [
                'id' => $naiteisha->id,
                'username' => $naiteisha->username,
                'vietnameseFullname' => $naiteisha->vietnamese_fullname,
                'japaneseFullname' => $naiteisha->japanese_fullname,
                'avatar' => $naiteisha->avatar,
                'gradeCode' => $naiteisha->grade_code,
                'university' => $naiteisha->universities->first()->name,
                'company' => $naiteisha->companies->first()->company_name,
                'receiveNaiteiDate' => $naiteisha->receive_naitei_date,
                'gradeCode' => $naiteisha->grade_code,
                'graduationDate' => $naiteisha->graduation_date,
                'role' => $naiteisha->role,
            ];
        });

        return response()->json(
            [
                'data' => $data->first(),
                'success' => true,
            ],
            200
        );
    }

    public function getAllTargetDetailForC1CreatePostModal(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(
                [
                    'data' => $validator->errors(),
                    'message' => $validator->errors()->first(),
                    'success' => false,
                ],
                400
            );
        }

        $userId = $request->input('user_id');
        $targetDetails = PlanDetail::with('document.unit')->whereHas('plan', function (Builder $query) use ($userId) {
            $query->where('user_id', $userId);
        })->get();

        $arr = $targetDetails->map(function ($item) {
            return [
                'id' => $item->id,
                'expected_amount' => $item->expected_amount,
                'real_amount' => $item->real_amount,
                'doc_id' => $item->doc_id,
                'doc_name' => $item->document->doc_name,
                'unit' => $item->document->unit->name,
                'unit_id' => $item->document->unit->id,
            ];
        });

        return response()->json(
            [
                'data' => $arr,
                'success' => true,
            ],
            200
        );
    }

    public function getAllUserByUserType(Request $request, $userType)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:64',
            'company_id' => 'string|max:64',
            'university_id' => 'integer',
            'grade_code' => 'string',
            'graduation_date' => 'date',
            'receive_naitei_date' => 'date',
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'data' => $validator->errors(),
                    'success' => false,
                    'message' => 'Validation Error',
                ],
                400
            );
        }

        //'0:admin 1:naitei 2:mentor 3:teacher 4:manager'
        if ($userType === 'naiteisha' || $userType === 'mentor' || $userType === 'teacher' || $userType === 'manager') {
            if ($userType === 'naiteisha') {
                $users = User::with('companies', 'universities')->name($request)->role(1)->orderBy('created_at', 'desc')->paginate(12);
                $temp = $users->getCollection();
                $temp = $temp->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'username' => $user->username,
                        'vietnameseFullname' => $user->vietnamese_fullname,
                        'japaneseFullname' => $user->japanese_fullname,
                        'avatar' => $user->avatar,
                        'gradeCode' => $user->grade_code,
                        'university' => $user->universities->first()->name,
                        'abbreviation' => $user->universities->first()->abbreviation,
                        'company' => $user->companies->first()->company_name,
                        'receiveNaiteiDate' => $user->receive_naitei_date,
                        'graduationDate' => $user->graduation_date,
                        'role' => $user->role,
                    ];
                });
                $users->setCollection($temp);
            } elseif ($userType === 'mentor') {
                $users = User::role(2)->name($request)->orderBy('created_at', 'desc')->paginate(12);
                $temp = $users->getCollection();
                $temp = $temp->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'username' => $user->username,
                        'vietnameseFullname' => $user->vietnamese_fullname,
                        'japaneseFullname' => $user->japanese_fullname,
                        'avatar' => $user->avatar,
                        'role' => $user->role,
                    ];
                });
                $users->setCollection($temp);
            } elseif ($userType === 'teacher') {
                $users = User::with('universities')->name($request)->role(3)->orderBy('created_at', 'desc')->paginate(12);
                $temp = $users->getCollection();
                $temp = $temp->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'username' => $user->username,
                        'vietnameseFullname' => $user->vietnamese_fullname,
                        'japaneseFullname' => $user->japanese_fullname,
                        'avatar' => $user->avatar,
                        'university' => $user->universities->first()->name,
                        'abbreviation' => $user->universities->first()->abbreviation,
                        'role' => $user->role,
                    ];
                });
                $users->setCollection($temp);
            } elseif ($userType === 'manager') {
                $users = User::with('companies')->name($request)->role(4)->orderBy('created_at', 'desc')->paginate(12);

                $temp = $users->getCollection();
                $temp = $temp->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'username' => $user->username,
                        'vietnameseFullname' => $user->vietnamese_fullname,
                        'japaneseFullname' => $user->japanese_fullname,
                        'avatar' => $user->avatar,
                        'company' => $user->companies->first()->company_name,
                        'role' => $user->role,
                    ];
                });
                $users->setCollection($temp);
            }

            $temp = $users->getCollection();

            if ($request->has('company_id')) {
                $companyName  = Company::find($request->input('company_id'))->company_name;
                $temp = $temp->filter(function ($user) use ($companyName) {
                    return $user['company'] === $companyName;
                });
            }

            if ($request->has('university_id')) {
                $universityName  = University::find($request->input('university_id'))->name;
                $temp = $temp->filter(function ($user) use ($universityName) {
                    return $user['university'] === $universityName;
                });
            }

            if ($request->has('grade_code')) {
                $temp = $temp->filter(function ($user) use ($request) {
                    return $user['gradeCode'] === $request->input('grade_code');
                });
            }

            if ($request->has('graduation_date')) {
                $temp = $temp->filter(function ($user) use ($request) {
                    return $user['graduationDate'] === $request->input('graduation_date');
                });
            }

            if ($request->has('receive_naitei_date')) {
                $temp = $temp->filter(function ($user) use ($request) {
                    return $user['receiveNaiteiDate'] === $request->input('receive_naitei_date');
                });
            }

            $collection = new Collection();
            foreach ($temp as $item) {
                $collection->push($item);
            }

            $users->setCollection($collection);

            return response()->json(
                [
                    'data' => $users,
                    'success' => true,
                    'message' => 'Successfully get all user by user type',
                ],
                200
            );
        }

        return response()->json(
            [
                'data' => [],
                'success' => false,
                'message' => 'User type is not valid',
            ],
            400
        );
    }

    public function deleteUserByUserId(Request $request, $userId)
    {
        $user = User::find($userId);
        if ($user) {
            $user->delete();

            return response()->json(
                [
                    'success' => true,
                    'message' => 'Successfully delete user',
                ],
                200
            );
        }

        return response()->json(
            [
                'success' => false,
                'message' => 'User not found',
            ],
            400
        );
    }

    public function createUser(StoreUserRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $data = $request->validated();
            if ($data) {
                if ($request->file('avatar') !== null) {
                    $imageName = $request->file('avatar')->getClientOriginalName().'_'.time();

                    $request->file('avatar')->move('images/', $imageName);
                    $imageName = 'images/'.$imageName;
                } else {
                    $imageName = null;
                }

                $data['avatar'] = $imageName;
                $password = Str::random(8);
                $data['password'] = bcrypt($password);
                $data['username'] = Str::remove(' ', $data['vietnamese_fullname']);
                $user = User::query()->create($data);

                switch ($data['role']) {
                    case 1:
                        UniversityUser::query()->create([
                            'user_id' => $user->id,
                            'university_id' => $data['university_id'],
                        ]);
                        CompanyUser::query()->create([
                            'user_id' => $user->id,
                            'company_id' => $data['company_id'],
                        ]);
                        Mail::to($data['email'])->send(new SendPassword($password, $user['email']));

                        return response()->json([
                            'success' => true,
                            'message' => 'Naitesha role',
                            'data' => $user,
                        ]);
                    case 2:
                        Mail::to($data['email'])->send(new SendPassword($password, $user['email']));

                        return response()->json([
                            'success' => true,
                            'message' => 'Mentor role',
                            'data' => $user,
                        ]);
                    case 3:
                        UniversityUser::query()->create([
                            'user_id' => $user->id,
                            'university_id' => $data['university_id'],
                        ]);
                        Mail::to($data['email'])->send(new SendPassword($password, $user['email']));

                        return response()->json([
                            'success' => true,
                            'message' => 'Teacher role',
                            'data' => $user,
                        ]);
                    case 4:
                        CompanyUser::query()->create([
                            'user_id' => $user->id,
                            'company_id' => $data['company_id'],
                        ]);
                        Mail::to($data['email'])->send(new SendPassword($password, $user['email']));

                        return response()->json([
                            'success' => true,
                            'message' => 'Manager role',
                            'data' => $user,
                        ]);
                    default:
                        return response()->json([
                            'success' => false,
                            'message' => 'Invalid role',
                        ], 400);
                }
            }
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed',
                'error' => $e,
            ], 400);
        }
    }
}
