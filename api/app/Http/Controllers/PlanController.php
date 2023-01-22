<?php

namespace App\Http\Controllers;

use App\Exceptions\Exception;
use App\Models\PlanDetail;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function editPlan(Request $request)
    {
        try {
            $plan = $request->plan;
            foreach ($plan['plan_details'] as $planDetail) {
                if (array_key_exists('delete', $planDetail)) {
                    PlanDetail::find($planDetail['id'])->delete();
                } elseif (array_key_exists('new', $planDetail)) {
                    PlanDetail::create([
                        'expected_amount' => $planDetail['expected_amount'],
                        'real_amount' => $planDetail['real_amount'],
                        'doc_id' => $planDetail['doc_id'],
                        'plan_id' => $planDetail['plan_id'],
                    ]);
                } else {
                    //dd($planDetail['expected_amount']);
                    $tempt = PlanDetail::find($planDetail['id']);
                    $tempt->real_amount = $planDetail['real_amount'];
                    $tempt->save();
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Plan edited',
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }
}
