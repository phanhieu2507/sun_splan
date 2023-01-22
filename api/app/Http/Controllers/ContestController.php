<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Contest;
use App\Models\ContestScoreEach;
use App\Models\Image;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ContestController extends Controller
{
    public function getAllContests()
    {
        try {
            $contests = Contest::all();

            foreach ($contests as $contest) {
                $contest->contestScoreEachs;
            }

            return response()->json([
                'success' => true,
                'data' => $contests,
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'data' => $error->getMessage(),
            ]);
        }
    }

    public function searchContestsByName(Request $request)
    {
        try {
            $searchValue = $request->searchValue;

            $contests = Contest::where('contest_name', 'like', '%'.$searchValue.'%')->get();

            foreach ($contests as $contest) {
                $contest->contestScoreEachs;
            }

            return response()->json([
                'success' => true,
                'data' => $contests,
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function searchContestsFilterByNameAndCategory(Request $request)
    {
        try {
            if ($request->has('category')) {
                $category = $request->category;
                $searchedCategory = Category::where('name', $category)->first();
                if (!$searchedCategory) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Category not found',
                    ]);
                }

                $categoryId = $searchedCategory->id;

                $contests = Contest::with('contestScoreEachs', 'category')->where('contest_name', 'like', '%'.$request->name.'%')
                    ->where('category_id', $categoryId)->get();
            } else {
                $contests = Contest::with('contestScoreEachs', 'category')->where('contest_name', 'like', '%'.$request->name.'%')->get();
            }

            $contests = $contests->map(function ($contest) {
                $contestScoreEachs = $contest->contestScoreEachs->map(function ($contestScoreEach) {
                    return [
                        'id' => $contestScoreEach->id,
                        'name' => $contestScoreEach->name,
                        'contestId' => $contestScoreEach->contest_id,
                        'maxScore' => $contestScoreEach->max_score,
                        'createdAt' => $contestScoreEach->created_at,
                        'updatedAt' => $contestScoreEach->updated_at,
                    ];
                });

                return [
                    'id' => $contest->id,
                    'contestName' => $contest->contest_name,
                    'passScore' => $contest->pass_score,
                    'totalScore' => $contest->total_score,
                    'createdAt' => $contest->created_at,
                    'updatedAt' => $contest->updated_at,
                    'category' => $contest->category->name,
                    'contestScoreEachs' => $contestScoreEachs,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $contests,
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function getContestById($contestId)
    {
        $contest = Contest::with('contestScoreEachs', 'image')->find($contestId);

        $contestScoreEachs = collect($contest->contestScoreEachs)->map(function ($contestScoreEach) {
            return [
                'id' => $contestScoreEach->id,
                'contestId' => $contestScoreEach->contest_id,
                'maxScore' => $contestScoreEach->max_score,
                'name' => $contestScoreEach->name,
                'createdAt' => $contestScoreEach->created_at,
                'updatedAt' => $contestScoreEach->updated_at,
            ];
        });

        $contest = [
            'id' => $contest->id,
            'contestName' => $contest->contest_name,
            'passScore' => $contest->pass_score,
            'createdAt' => $contest->created_at,
            'updatedAt' => $contest->updated_at,
            'contestScoreEachs' => $contestScoreEachs,
            'image' => isset($contest->image) ? $contest->image->img_link : null,
            'totalScore' => $contest->total_score,
        ];

        return response()->json(
            [
                'success' => true,
                'data' => $contest,
                'message' => 'Get contest by id successfully',
            ],
            200
        );
    }

    public function deleteTestById($contestId)
    {
        try {
                Contest::where('id', $contestId)->delete();

                return response()->json([
                    'success' => true,
                    'message' => 'delete oke',
                ]);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function getAllTests()
    {
        $contests = Contest::all();

        foreach ($contests as $contest) {
            $contest->image;
        }

        return response()->json(
            [
                'success' => true,
                'data' => $contests,
            ],
            200
        );
    }

    public function updateContest(Request $request, $contestId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'contestName'         => 'required|string|max:64',
                'passScore'           => 'required|integer',
            ]);
            if ($validator->fails()) {
                return response()->json(
                    [
                        'data'    => $validator->errors(),
                        'message' => $validator->errors()->first(),
                        'success' => false,
                    ],
                    400
                );
            }

            $contest = Contest::with('contestScoreEachs', 'image')->where('id', $contestId)->first();
            $contest->contest_name      = $request->input('contestName');
            $contest->pass_score        = $request->input('passScore');
            $contest->total_score       = $request->input('totalScore');

            if ($request->has('image')) {
                if (is_string($request->image) && $contest->image->img_link !== $request->image) {
                    $contest->image->img_link = $request->image;
                    $contest->image->save();
                } elseif (!is_string($request->image)) {
                    $contest->image->delete();
                    $image = $request->file('image');
                    $extension = $image->getClientOriginalExtension();
                    $imageName = time().'.'.$extension;
                    $path = $image->move(public_path('images/'), $imageName);
                    $image = new Image();
                    if ($path) {
                        $image->img_link = 'images/'.$imageName;
                    }

                    $image->is_thumbnail = 1;
                    $image->type_id = 0;
                    $image->save();
                    $contest->image_id = $image->id;
                }
            }

            $contest->save();
            if ($request->items) {
                $items = json_decode($request->items, true);
                // delete all contest score eachs in this contest
                $contest->contestScoreEachs()->delete();
                // insert new contest score eachs
                foreach ($items as $item) {
                    $contestScoreEach = new ContestScoreEach();
                    $contestScoreEach->contest_id = $contest->id;
                    $contestScoreEach->name = $item['itemName'];
                    $contestScoreEach->max_score = $item['itemScore'];
                    $contestScoreEach->save();
                }
            } else {
                $contest->contestScoreEachs()->delete();
            }

            return response()->json([
                'success' => true,
                'data'    => $contest,
                'message' => 'Edit contest successfull',
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function deleteContest(Request $request, $contestId)
    {
        try {
            Contest::where('id', $contestId)->delete();

            return response()->json([
                'success' => true,
                'message' => 'delete oke',
            ]);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function createContest(Request $request)
    {
        $rules = [
            'contest_name' => 'required|string',
            'pass_score' => 'required|integer',
            'total_score' => 'required|integer',
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json(
                [
                    'data' => $validator->errors(),
                    'success' => false,
                    'message' => 'Validator Error',
                ],
                400
            );
        }

        try {
            //code...
            $contest = new Contest();
            $contest->contest_name = $request->contest_name;
            $contest->pass_score = $request->pass_score;
            $user = Auth::user();
            $contest->user_id = $user['id'];
            $contest->total_score = $request->total_score;
            if ($request->has('image')) {
                if (is_string($request->image) && $contest->image->img_link !== $request->image) {
                    $contest->image->img_link = $request->image;
                    $contest->image->save();
                } elseif (!is_string($request->image)) {
                    $image = $request->file('image');
                    $extension = $image->getClientOriginalExtension();
                    $imageName = time().'.'.$extension;
                    $path = Storage::disk('public')->putFileAs('images', $image, $imageName);
                    $image = new Image();
                    if ($path) {
                        $image->img_link = 'images/'.$imageName;
                    } else {
                        $image->img_link = 'images/contest-no-image.gif';
                    }

                    $image->is_thumbnail = 1;
                    $image->type_id = 0;
                    $image->save();
                    $contest->image_id = $image->id;
                }
            }

            $contest->save();

            if ($request->items) {
                $items = json_decode($request->items);
                foreach ($items as $item) {
                    $scoreEach = new ContestScoreEach();
                    $scoreEach->name = $item->title;
                    $scoreEach->max_score = $item->score;
                    $contest->contestScoreEachs()->save($scoreEach);
                }
            }

            return response()->json(
                [
                    'success' => true,
                    'message' => 'Create new test successfully',
                ],
                200
            );
        } catch (Exception $error) {
            return response()->json(
                [
                    'success' => false,
                    'message' => $error->getMessage(),
                ],
                500
            );
        }
    }
}
