<?php

namespace App\Http\Controllers;

use App\Models\GradeCode;
use App\Models\Image;
use App\Models\University;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
//use Illuminate\Support\Facades\File;

class InformationUniversityController extends Controller
{
    public function getUniversityById(Request $request, $uniId)
    {
        try {
            $uni = University::with('gradeCodes', 'image')->where('id', $uniId)->first();
            $uni->gradeCodes = $uni->gradeCodes->map(function ($gradeCode) {
                return [
                    'id' => $gradeCode->id,
                    'code' => $gradeCode->code,
                    'year' => $gradeCode->year,
                ];
            });
            if ($uni->image) {
                $uni->img = $uni->image->img_link;
            }

            $university = [
                'id' => $uni->id,
                'name' => $uni->name,
                'abbreviation' => $uni->abbreviation,
                'gradeCodes' => $uni->gradeCodes,
                'image' => $uni->img,
            ];

            return response()->json([
                'success' => true,
                'data'   => $university,
                'message' => 'get information of university successfully',
            ]);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function updateUniversity(Request $request, $uniId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name'         => 'required|string|max:64',
                'abbreviation' => 'required|string|max:64',
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

            $university = University::with('gradeCodes', 'image')->where('id', $uniId)->first();

            $university->name      = $request->input('name');
            $university->abbreviation = $request->input('abbreviation');
            if ($request->has('image')) {
                if (is_string($request->image) && $university->image->img_link !== $request->image) {
                    $university->image->img_link = $request->image;
                    $university->image->save();
                } elseif (!is_string($request->image)) {
                    $university->image()->delete();
                    $image = $request->file('image');
                    $extension = $image->getClientOriginalExtension();
                    $imageName = time().'.'.$extension;
                    //$path = $image->move('images', $imageName);
                    $path = Storage::disk('public')->putFileAs('images', $image, $imageName);
                    $image = new Image();
                    if ($path) {
                        $image->img_link = 'images/'.$imageName;
                    }

                    $image->is_thumbnail = 1;
                    $image->type_id = 0;
                    $image->save();
                    $university->image_id = $image->id;
                }
            } else {
                $university->image()->delete();
                $university->image_id = null;
                $university->save();
            }

            $university->save();

            if ($request->items) {
                $items = json_decode($request->items, true);
                //$items = json_decode($request->items, true);
                $university->gradeCodes()->delete();
                foreach ($items as $item) {
                    $gradeCode = new GradeCode();
                    $gradeCode->university_id = $university->id;
                    $gradeCode->code = $item['code'];
                    $gradeCode->year = $item['year'];
                    $gradeCode->save();
                }

                // $university->gradeCodes()->save($gradeCode);
            }

            //$university->update();

            return response()->json([
                'success' => true,
                'data'    => $university,

                'message' => 'Edit contest successfull',
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function create(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name'         => 'required|string|max:64',
                'abbreviation' => 'required|string|max:64',
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

            $newUniversity = new University();
            $newUniversity->name      = $request->input('name');
            $newUniversity->abbreviation = $request->input('abbreviation');
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $extension = $image->getClientOriginalExtension();
                $imageName = time().'.'.$extension;
                $path = Storage::disk('public')->putFileAs('images', $image, $imageName);
                $image = new Image();
                if ($path) {
                    $image->img_link = 'images/'.$imageName;
                }

                $image->is_thumbnail = 1;
                $image->type_id = 0;
                $image->save();
                $newUniversity->image_id = $image->id;
            }

            $newUniversity->save();

            if ($request->items) {
                $items = json_decode($request->items);
                foreach ($items as $item) {
                    $gradeCode = new GradeCode();
                    $gradeCode->code = $item->gradeCode;
                    $gradeCode->year = $item->entranceYear;
                    $newUniversity->gradeCodes()->save($gradeCode);
                }
            }

            return response()->json([
                'success' => true,
                'data'    => $newUniversity,
                'message' => 'Create contest successfull',
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }
}
