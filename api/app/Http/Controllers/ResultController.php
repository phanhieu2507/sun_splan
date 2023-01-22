<?php

namespace App\Http\Controllers;

use App\Models\FreeContent;
use App\Models\ScoreEach;
use App\Models\Target;
use Exception;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    /**
     * @OA\Post(
     *     path="/target/update",
     *     tags={"target"},
     *     summary="Update a target.",
     *     description="Return message successfully",
     *     operationId="updateTarget",
     * @OA\RequestBody(
     *          description= "Target object that needs to be updated.",
     *          required=true,
     * @OA\JsonContent(
     *              type="object",
     * @OA\Property(property="id", type="integer"),
     * @OA\Property(property="date_of_target", type="date"),
     * @OA\Property(property="is_completed", type="integer"),
     * @OA\Property(property="user_id", type="integer"),
     * @OA\Property(
     *                  property="target_details",
     *                  type="array",
     * @OA\Items(
     *                      type="object",
     * @OA\Property(property="id", type="integer"),
     * @OA\Property(property="target_id", type="integer"),
     * @OA\Property(property="type", type="integer"),
     * @OA\Property(
     *                          property="test_content",
     *                          type="object",
     * @OA\Property(property="id", type="integer"),
     * @OA\Property(property="target_detail_id", type="integer"),
     * @OA\Property(
     *                              property="score_eachs",
     *                              type="array",
     * @OA\Items(
     *                                  type="object",
     * @OA\Property(property="id", type="integer"),
     * @OA\Property(property="result", type="double"),
     *                              )
     *                          )
     *                      ),
     * @OA\Property(
     *                          property="free_content",
     *                          type="object",
     * @OA\Property(property="id", type="integer"),
     * @OA\Property(property="result", type="string"),
     *                      )
     *                  )
     *              )
     *          )
     *     ),
     * @OA\Response(
     *         response=200,
     *         description="Update Target successfully",
     *     ),
     * @OA\Response(
     *         response=400,
     *         description="Invalid id supplied",
     * @OA\JsonContent(
     *              type="object",
     * @OA\Property(
     *                  property="message",
     *                  type="string",
     *                  example="The specified data is invalid."
     *              ),
     * @OA\Property(
     *                  property="errors",
     *                  type="object",
     *                  example={
     *                      "name": "The name field is required.",
     *                  },
     *              ),
     *         ),
     *     ),
     * )
     */
    public function updateTarget(Request $request)
    {
        try {
            $targetId = $request->id;
            $target = Target::find($targetId);
            if (!$target) {
                return response()->json([
                    'success' => false,
                    'message' => 'target is not found',
                ], 404);
            }

            $updatedAt = null;

            $targetDetails = $request->target_details;
            foreach ($targetDetails as $targetDetail) {
                if ($targetDetail['type'] === 0) {
                    foreach ($targetDetail['test_content']['score_eachs'] as $scoreEach) {
                        $scoreEachId = $scoreEach['id'];
                        $scoreEachResult = $scoreEach['result'];
                        $updatedAt = self::updateScoreEach($scoreEachId, $scoreEachResult);
                    }
                } else {
                    $freeText = $targetDetail['free_content'];
                    $freeTextId = $freeText['id'];
                    $resultTextResult = $freeText['result'];
                    $updatedAt = self::updateFreeContent($freeTextId, $resultTextResult);
                }
            }

            $target->updated_at = $updatedAt;
            $target->save();

            return response()->json([
                'success' => true,
                'message' => 'Update target successfully',
            ]);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function updateFreeContent($id, $result)
    {
        $freeContent = FreeContent::find($id);
        if ($freeContent) {
            $freeContent->result = $result;
            $freeContent->save();
        }

        return $freeContent->updated_at;
    }

    /**
     * Update result of ScoreEach of TestContent
     */
    public function updateScoreEach($id, $result)
    {
        $scoreEach = ScoreEach::find($id);
        if ($scoreEach) {
            $scoreEach->result = $result;
            $scoreEach->save();
        }

        return $scoreEach->updated_at;
    }

    public function updateStatus(Request $request)
    {
        try {
            $targetId = $request->id;
            $target = Target::find($targetId);
            if (!$target) {
                return response()->json([
                    'success' => false,
                    'message' => 'target is not found',
                ], 404);
            }

            $target->is_completed = $request->is_completed;
            $target->save();

            return response()->json([
                'success' => true,
                'message' => 'Update status of target successfully.',
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }
}
