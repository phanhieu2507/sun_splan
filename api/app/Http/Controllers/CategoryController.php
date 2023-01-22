<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Contest;
use Exception;

class CategoryController extends Controller
{
    public function getAllTargetCategories()
    {
        $categories = Category::all();

        if ($categories) {
            foreach ($categories as $category) {
                if ($category['name'] === '日本語' || $category['name'] === 'Japanese') {
                    $contests = Contest::all();
                    if ($contests) {
                        foreach ($contests as $contest) {
                            $contest->contestScoreEachs;
                        }
                    }

                    $category['contests'] = $contests;
                }
            }

            return response()->json([
                'success' => true,
                'data' => $categories,
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'categories is not found',
        ], 404);
    }

    public function getAllCategories()
    {
        try {
            $categories = Category::all();

            return response()->json([
                'success' => true,
                'data' => $categories,
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }
}
