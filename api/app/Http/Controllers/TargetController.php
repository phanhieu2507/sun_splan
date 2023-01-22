<?php

namespace App\Http\Controllers;

use App\Exceptions\Exception;
use App\Models\Category;
use App\Models\Contest;
use App\Models\FreeContent;
use App\Models\Plan;
use App\Models\ScoreEach;
use App\Models\Target;
use App\Models\TargetDetail;
use App\Models\TestContent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TargetController extends Controller
{
    public function getTargetById($targetId)
    {
        try {
            $target = Target::find($targetId);
            if ($target) {
                $target->targetDetails;
                foreach ($target->targetDetails as $targetDetail) {
                    if ($targetDetail->type === 0) {
                        $targetDetail->testContent->scoreEachs;
                        $targetDetail->testContent->contest->contestScoreEachs;
                        $targetDetail->category;
                    } else {
                        $targetDetail->freeContent;
                        $targetDetail->category;
                    }
                }

                $plan = Plan::where('target_id', $target->id)->first();
                foreach ($plan->planDetails as $planDetail) {
                    $planDetail->document->unit;
                    $planDetail->document->category;
                }

                return response()->json([
                    'data' => ['target' => $target, 'plan' => $plan],
                    'message' => 'success',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'target not found',
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function getAllTargets($userId)
    {
        try {
            $user = User::find($userId);
            if ($user) {
                return response()->json([
                    'data' => $user->targets,
                    'message' => 'success',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'Target not found',
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function getThisMonthTarget($userId)
    {
        try {
            $target = Target::where('user_id', $userId)
                ->whereMonth('date_of_target', date('m'))
                ->whereYear('date_of_target', date('Y'))
                ->first();
            if ($target) {
                $targetDetails = $target->targetDetails;
                foreach ($targetDetails as $targetDetail) {
                    if ($targetDetail->type === 0) {
                        $targetDetail->testContent->scoreEachs;
                        $targetDetail->testContent->contest->contestScoreEachs;
                        $targetDetail->category;
                    } else {
                        $targetDetail->freeContent;
                        $targetDetail->category;
                    }
                }

                $plan = Plan::where('target_id', $target->id)->first();
                foreach ($plan->planDetails as $planDetail) {
                    $planDetail->document->unit;
                    $planDetail->document->category;
                }

                return response()->json([
                    'data' => ['target' => $target, 'plan' => $plan],
                    'message' => 'success',
                ], 200);
            }

            return response()->json([
                'data' => ['target' => $target, 'plan' => null],
                'message' => 'success',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function editTarget(Request $request)
    {
        try {
            $target = $request->target;
            //target này đã được lấy ở những bước trước, có kèm tất cả dữ liệu liên quan
            foreach ($target['target_details'] as $targetDetail) {
                //if(array_key_exists('delete', $targetDetail)) {
                //    dd(TargetDetail::find($targetDetail['id']));
                //}
                if (array_key_exists('new', $targetDetail)) { //new ở đây là do FE thêm lúc xử lý
                    if ($targetDetail['type'] === 0) {//0 là loại kì thi
                        $newTargetDetail = TargetDetail::create([
                            'target_id' => $target['id'],
                            'category_id' => $targetDetail['category_id'],
                            'type' => 0,
                        ]);

                        $newTestContent = TestContent::create([
                            'target_detail_id' => $newTargetDetail->id,
                            'contest_id' => $targetDetail['test_content']['contest_id'],
                            'date_of_contest' => $targetDetail['test_content']['date_of_contest'],
                        ]);

                        foreach ($targetDetail['test_content']['score_eachs'] as $scoreEach) {
                            ScoreEach::create([
                                'part_name' => $scoreEach['part_name'],
                                'expected_score' => $scoreEach['expected_score'],
                                'test_content_id' => $newTestContent->id,
                            ]);
                        }
                    } else { //với loại không phải kì thi
                        $newTargetDetail = TargetDetail::create([
                            'target_id' => $target['id'],
                            'category_id' => $targetDetail['category_id'],
                            'type' => 1,
                        ]);
                        FreeContent::create([
                            'content' => $targetDetail['free_content']['content'],
                            'target_detail_id' => $newTargetDetail->id,
                        ]);
                    }
                } elseif (array_key_exists('delete', $targetDetail)) {
                    $tempt = TargetDetail::find($targetDetail['id']);
                    $tempt->delete();
                } else {
                    if ($targetDetail['type'] === 0) {
                        $testContent = TestContent::find($targetDetail['test_content']['id']);
                        $testContent->date_of_contest = $targetDetail['test_content']['date_of_contest'];
                        $testContent->save();
                        foreach ($targetDetail['test_content']['score_eachs'] as $scoreEach) {
                            $tempt = ScoreEach::find($scoreEach['id']);
                            if ($tempt->expected_score !== $scoreEach['expected_score']) {
                                $tempt->expected_score = $scoreEach['expected_score'];
                                $tempt->save();
                            }
                        }
                    } else {
                        $freeContent = FreeContent::find($targetDetail['free_content']['id']);
                        $freeContent->content = $targetDetail['free_content']['content'];
                        $freeContent->save();
                    }
                }

                $data = Target::find($request->target['id']);
                foreach ($data->targetDetails as $targetDetail) {
                    if ($targetDetail->type === 0) {
                        $targetDetail->testContent->scoreEachs;
                    } else {
                        $targetDetail->freeContent;
                    }
                }
            }

            return response()->json([
                'data' => $data,
                'success' => true,
                'message' => 'Target edited',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function createTarget(Request $request)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not logged in',
                ]);
            }

            $userId = Auth::user()->id;

            $newTarget = Target::create([
                'user_id' => $userId,
                'date_of_target' => $request->date_of_target,
            ]);

            $targetDetails = $request->targets;
            foreach ($targetDetails as $targetDetail) {
                $categoryName = $targetDetail['category'];
                $category = Category::where('name', $categoryName)->first();

                $newTargetDetail = TargetDetail::create([
                    'target_id' => $newTarget->id,
                    'category_id' => $category['id'],
                    'type' => $targetDetail['type'],
                ]);

                if ($targetDetail['type'] === 0) {
                    $contestName = $targetDetail['contest_name'];
                    $contest = Contest::where('contest_name', $contestName)->first();
                    $newTestContent = TestContent::create([
                        'target_detail_id' => $newTargetDetail->id,
                        'contest_id' => $contest['id'],
                        'type' => $targetDetail['type'],
                        'date_of_contest' => $targetDetail['exam_date'],
                    ]);
                    $scoreEaches = $targetDetail['score_eaches'];
                    foreach ($scoreEaches as $scoreEach) {
                        ScoreEach::create([
                            'part_name' => $scoreEach['part_name'],
                            'expected_score' => $scoreEach['expected_score'],
                            'test_content_id' => $newTestContent->id,
                        ]);
                    }
                } else {
                    FreeContent::create([
                        'content' => $targetDetail['content'],
                        'target_detail_id' => $newTargetDetail->id,
                    ]);
                }
            }

            Plan::create([
                'user_id' => $userId,
                'target_id' => $newTarget->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Creat a target successfully',
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function getAllTargetByUserId(Request $request)
    {
        //CHi lay ve date_of_target phuc vu cho man C32
        try {
            $targets = Target::where('user_id', $request->userId)->get();

            $targets = $targets->map(function ($target) {
                return [
                    'id' => $target->id,
                    'dateOfTarget' => $target->date_of_target,
                    'isCompleted' => $target->is_completed,
                    'userId' => $target->user_id,
                    'createdAt' => $target->created_at,
                    'updatedAt' => $target->updated_at,
                ];
            });

            return response()->json([
                'data' => $targets,
                'success' => true,
                'message' => 'Get all target by user id successfully',
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }
}
