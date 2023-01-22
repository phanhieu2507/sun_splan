<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Exception;

class UnitController extends Controller
{
    public function getAllUnits()
    {
        try {
            $units = Unit::all();

            return response()->json([
                'success' => true,
                'data' => $units,
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }
}
