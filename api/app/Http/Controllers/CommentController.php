<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function getAllCommentByPostId(Request $request, $postId)
    {
        $limit = $request->limit;
        $comments = '';
        if ($limit) {
            $comments = Comment::with('user')->where('post_id', $postId)->offset(0)->limit($limit)->orderBy('created_at', 'desc')->get();
        } else {
            $comments = Comment::with('user')->where('post_id', $postId)->orderBy('created_at', 'desc')->get();
        }

        $data = $comments->map(function ($comment) {
            return [
                'id' => $comment->id,
                'postId' => $comment->post_id,
                'userId' => $comment->user_id,
                'content' => $comment->content,
                'createdAt' => $comment->created_at,
                'japaneseFullname' => $comment->user->japanese_fullname,
                'avatar' => $comment->user->avatar,
            ];
        });

        return response()->json(
            [
                'success' => true,
                'data' =>
                    $data,
            ],
            200
        );
    }

    // tao 1 comment
    public function createComment(Request $request, $postId)
    {
        try {
                $newComment = new Comment();
                $newComment->post_id = $postId;
                $newComment->user_id = $request->input('userId');
                $newComment->content = $request->input('content');
                $newComment->save();

                return response()->json([
                    'success' => true,
                    'message' => 'create comment successfull',
                ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function editComment(Request $request, $commentId)
    {
        try {
            $comment = Comment::where('id', $commentId)->first();

            if ($comment) {
                $comment->content = $request->input('content');
                $comment->save();

                return response()->json([
                    'success' => true,
                    'message' => 'update successfully',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'no comment',
            ]);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function deleteComment($commentId)
    {
        try {
                Comment::where('id', $commentId)->delete();

                return response()->json([
                    'success' => true,
                    'message' => 'delete oke',
                ]);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }
}
