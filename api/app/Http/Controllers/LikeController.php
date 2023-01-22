<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\Post;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function getAllLikeByPostId(Request $request)
    {
        $postId = $request->postId;
        $likes = Like::where('post_id', $postId)->get();

        return response()->json(
            [
                'success' => true,
                'data' => $likes,
            ],
            200
        );
    }

    public function toggleLike(Request $request)
    {
        $postId = $request->post_id;
        $userId = $request->user_id;
        $post = Post::find($postId);
        if ($post === null) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Post not found',
                ],
                404
            );
        }

        $toggled = $post->likes()->toggle([$userId]);

        $liked = [];
        if ($toggled['attached']) {
            $liked = ['liked' => true];
        } else {
            $liked = ['liked' => false];
        }

        return response()->json(
            [
                'success' => true,
                'data' => $liked,
                'message' => $liked['liked'] ? ('User '.$userId.' liked post '.$postId) : ('User '.$userId.' unliked post '.$postId),
            ],
            200
        );
    }
}
