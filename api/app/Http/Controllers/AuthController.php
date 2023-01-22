<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request): \Illuminate\Http\JsonResponse
    {
        $credentials = $request->validate([
            'email' => 'required|string|regex:/(.+)@(.+)\.(.+)/i',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($credentials, $request->remember)) {
            $user = Auth::user();
            $request->session()->regenerate();
            $cookieRole = cookie('role', $user->role, 60 * 24 * 15);
            $token = $user->createToken('secret')->plainTextToken;
            $cookieToken = cookie('token', $token, 60 * 24 * 15);
            $user->remember_token = $token;
            $user->save();

            $user = [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'graduationDate' => $user->graduation_date,
                'role' => $user->role,
                'vietnameseFullname' => $user->vietnamese_fullname,
                'japaneseFullname' => $user->japanese_fullname,
                'gradeCode' => $user->grade_code,
                'avatar' => $user->avatar,
            ];

            return response()->json([
                'message' => 'Login successfully',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ],
            ], 200)->withCookie($cookieToken)
                ->withCookie($cookieRole);
        }

        return response()->json([
            'message' => 'Email or password is incorrect',
        ], 400);
    }

    public function logout(Request $request)
    {
        $cookieToken = cookie('token', null, -1);
        $cookieRole = cookie('role', null, -1);

        if (Auth::check()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response(['message' => 'Logout'], 200)
                ->withCookie($cookieToken)
                ->withCookie($cookieRole);
        }

        return response(['message' => 'Please login'], 400)
            ->withCookie($cookieToken)
            ->withCookie($cookieRole);
    }
}
