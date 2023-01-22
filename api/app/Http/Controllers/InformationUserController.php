<?php

namespace App\Http\Controllers;

use App\Models\CompanyUser;
use App\Models\UniversityUser;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class InformationUserController extends Controller
{
    public function informationUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'userId' => 'required|integer',
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

        try {
            $userId = $request->userId;
            $role = User::where('id', '=', $userId)->first()->role;

            //'0:admin 1:naitei 2:mentor 3:teacher 4:manager'
            if ($role === 1) {
                $naiteisha = User::with('universities', 'companies')->where('id', $userId)->first();

                return response()->json(
                    [
                        'data' => [
                            'username'          => $naiteisha->username ,
                            'vietnamese_fullname' => $naiteisha->vietnamese_fullname,
                            'japanese_fullname'   => $naiteisha->japanese_fullname,
                            'email'              => $naiteisha->email,
                            'avatar'             => $naiteisha->avatar,
                            'grade_code'          => $naiteisha->grade_code,
                            'role'               => $naiteisha->role,
                            'university_name'    => $naiteisha->universities->first()->abbreviation,
                            'university_id'      => $naiteisha->universities->first()->id,
                            'company_name'       => $naiteisha->companies->first()->company_name,
                            'company_id'         => $naiteisha->companies->first()->id,
                            'receive_naitei_date'  => $naiteisha->receive_naitei_date,
                            'graduation_date'     => $naiteisha->graduation_date,
                        ] ,
                        'success' => true,
                    ],
                    200
                );
            }

            if ($role === 2) {
                $mentor = User::where('id', $userId)->first();

                return response()->json(
                    [
                        'success' => true,
                        'data'    => [
                            'username'           => $mentor->username,
                            'vietnamese_fullname' => $mentor->vietnamese_fullname,
                            'japanese_fullname'   => $mentor->japanese_fullname,
                            'email'              => $mentor->email,
                            'avatar'             => $mentor->avatar,
                            'role'               => $mentor->role,
                        ],
                    ],
                    200
                );
            }

            if ($role === 3) {
                $teacher = User::with('universities')->where('id', $userId)->first();

                return response()->json(
                    [
                        'success' => true,
                        'data'    => [
                            'username'           => $teacher->username,
                            'vietnamese_fullname' => $teacher->vietnamese_fullname,
                            'japanese_fullname'   => $teacher->japanese_fullname,
                            'role'               => $teacher->role,
                            'email'              => $teacher->email,
                            'avatar'             => $teacher->avatar,
                            'university_name'    => $teacher->universities->first()->abbreviation,
                            'university_id'      => $teacher->universities->first()->id,
                        ],
                    ],
                    200
                );
            }

            $manager = User::with('companies')->where('id', '=', $userId)->first();

            return response()->json(
                [
                    'success' => true,
                    'data'    => [
                        'username'           => $manager->username,
                        'vietnamese_fullname' => $manager->vietnamese_fullname,
                        'japanese_fullname'   => $manager->japanese_fullname,
                        'role'               => $manager->role,
                        'email'              => $manager->email,
                        'avatar'             => $manager->avatar,
                        'company_name'       => $manager->companies->first()->company_name,
                        'company_id'         => $manager->companies->first()->id,
                    ],
                ],
                200
            );
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function updateInformationUser($userId, Request $request)
    {
        try {
            $role = $request->role;
            $university = UniversityUser::query()->where('user_id', $userId)->first();
            $company = CompanyUser::query()->where('user_id', $userId)->first();
            $destination = 'images/'.$request->image;
            if ($request->file('avatar') !== null) {
                if (File::exists($destination)) {
                    File::delete($destination);
                }

                $imageName = $request->file('avatar')->getClientOriginalName().'_'.time();
                $request->file('avatar')->move('images/', $imageName);
                $imageName = 'images/'.$imageName;
            } else {
                if ($request->avatar !== 'null') {
                    $imageName = $request->avatar;
                } else {
                    $imageName = null;
                }
            }

            if ($role === '1') {
                $naiteisha = User::query()->where('id', $userId)->first();
                $validator = Validator::make($request->all(), [
                    'email'              => 'required|email',
                    'company_id'         => 'required',
                    'university_id'      => 'required',
                    'grade_code'         => 'required|string',
                    'receive_naitei_date' => 'required|date',
                    'graduation_date'    => 'required|date',
                    'role'               => 'required',
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

                $naiteisha->vietnamese_fullname = $request->input('vietnamese_fullname');
                $naiteisha->japanese_fullname   = $request->input('japanese_fullname');
                $naiteisha->email               = $request->input('email');
                $naiteisha->grade_code          = $request->input('grade_code');
                $naiteisha->receive_naitei_date = $request->input('receive_naitei_date');
                $naiteisha->graduation_date     = $request->input('graduation_date');
                $naiteisha->role                = $request->input('role');
                $naiteisha->avatar = $imageName;
                $naiteisha->save();
                if ($university) {
                    $university->university_id = $request->input('university_id');
                    $university->save();
                } else {
                    UniversityUser::query()->create([
                        'user_id' => $naiteisha->id,
                        'university_id' => $request->input('university_id'),
                    ]);
                }

                if ($company) {
                    $company->company_id = $request->input('company_id');
                    $company->save();
                } else {
                    CompanyUser::query()->create([
                        'user_id' => $naiteisha->id,
                        'company_id' => $request->input('company_id'),
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'update information successfully',
                ], 200);
            }

            if ($role === '2') {
                $mentor = User::query()->where('id', $userId)->first();
                $validator = Validator::make($request->all(), [
                    'email'              => 'required|email',
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

                $mentor->vietnamese_fullname = $request->input('vietnamese_fullname');
                $mentor->japanese_fullname   = $request->input('japanese_fullname');
                $mentor->email               = $request->input('email');
                $mentor->avatar = $imageName;
                $mentor->save();

                return response()->json([
                    'success' => true,
                    'message' => 'update information successfully',
                ], 200);
            }

            if ($role === '3') {
                $teacher = User::with('universities')->where('id', $userId)->first();
                $validator = Validator::make($request->all(), [
                    'email'              => 'required|email',
                    'university_id'      => 'required',
                    'role'               => 'required',
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

                $teacher->vietnamese_fullname = $request->input('vietnamese_fullname');
                $teacher->japanese_fullname   = $request->input('japanese_fullname');
                $teacher->email               = $request->input('email');
                $teacher->role                = $request->input('role');
                $teacher->avatar = $imageName;
                $teacher->save();
                if ($university) {
                    $university->university_id = $request->input('university_id');
                    $university->save();
                } else {
                    UniversityUser::query()->create([
                        'user_id' => $teacher->id,
                        'university_id' => $request->input('university_id'),
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'update information successfully',
                ], 200);
            }

            if ($role === '4') {
                $manager = User::with('companies')->where('id', $userId)->first();
                $validator = Validator::make($request->all(), [
                    'email'              => 'required|email',
                    'company_id'         => 'required',
                    'role'               => 'required',
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

                $manager->vietnamese_fullname = $request->input('vietnamese_fullname');
                $manager->japanese_fullname   = $request->input('japanese_fullname');
                $manager->email               = $request->input('email');
                $manager->role                = $request->input('role');
                $manager->avatar = $imageName;
                $manager->save();
                if ($university) {
                    $university->university_id = $request->input('university_id');
                    $university->save();
                } else {
                    UniversityUser::query()->create([
                        'user_id' => $manager->id,
                        'university_id' => $request->input('university_id'),
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'update information successfully',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'update information failed',
            ], 400);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function deleteUser($userId, Request $request)
    {
        try {
            User::destroy($userId);

            return response()->json([
                'success' => true,
                'message' => 'delete user successfully',
            ]);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }
}
