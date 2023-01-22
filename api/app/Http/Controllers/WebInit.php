<?php

namespace App\Http\Controllers;

class WebInit extends Controller
{
    public function __invoke()
    {
        $user = null;
        if (auth()->user()) {
            $user = auth()->user();
        }

        return response()->json([
            'data' => $user,
        ]);
    }
}
