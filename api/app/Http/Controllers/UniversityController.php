<?php

namespace App\Http\Controllers;

use App\Models\University;
use Illuminate\Http\Request;

class UniversityController extends Controller
{
    public function getAllUniversity()
    {
        $universities = University::with('gradeCodes', 'image')->get();
        $universities = $universities->map(function ($university) {
            $university->gradeCodes = $university->gradeCodes->map(function ($gradeCode) {
                return [
                    'id' => $gradeCode->id,
                    'code' => $gradeCode->code,
                ];
            });

            return [
                'id' => $university->id,
                'name' => $university->name,
                'abbreviation' => $university->abbreviation,
                'gradeCodes' => $university->gradeCodes,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Get all universities successfully',
            'data' => $universities,
        ]);
    }

    public function getUniversitiesFilterByName(Request $request)
    {
        $universities = University::with('image')->where('name', 'like', '%'.$request->name.'%')
            ->orWhere('abbreviation', 'like', '%'.$request->name.'%')->orderBy('id', 'desc')->paginate(6);
        $temp = $universities->getCollection();
        $temp = $temp->map(function ($university) {
            return [
                'id' => $university->id,
                'name' => $university->name,
                'abbreviation' => $university->abbreviation,
                'image' => isset($university->image) ? $university->image->img_link : null,
            ];
        });
        $universities->setCollection($temp);

        return response()->json([
            'success' => true,
            'message' => 'Get universities by name successfully',
            'data' => $universities,
        ]);
    }

    public function deleteUniversityById($universityId)
    {
        $university = University::find($universityId);
        if ($university) {
            $university->delete();

            return response()->json([
                'success' => true,
                'message' => 'Delete university successfully',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Delete university failed',
        ]);
    }
}
