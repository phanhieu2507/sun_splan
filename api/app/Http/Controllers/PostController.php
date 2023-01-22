<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    public function createType1Post(Request $request)
    {
        //Chia lai cac loai Post (61,62,... doc trong spec C1 muc 6)
        //0 : 61,62,64 Post binh thuong cua user thong bao hoc tap hang ngay. Nguoi dung post
        //1 : 63,65 Bai kiem tra thanh cong hay that bai. Tu dong
        //2: 66 Tao ke hoach moi. Tu dong
        //3: 67 Tien do hoc tap 25 50 75 100. Tu dong
        //create Post type 0
        $validator = Validator::make($request->input(), [
            'user_id' => 'required|integer',
            'memo' => 'nullable|string|max:255',
            'real_amount' => 'required|integer',
            'real_time' => 'integer',
            'plan_detail_id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(
                [
                    'data' => $validator->errors(),
                    'success' => false,
                    'message' => 'Validation Error',
                ],
                400
            );
        }

        $newPost0 = new Post();
        $newPost0->content = strval($request->input('memo'));
        $newPost0->real_amount = intval($request->input('real_amount'));
        $newPost0->real_time = intval($request->input('real_time'));
        $newPost0->user_id = intval($request->input('user_id'));
        $newPost0->plan_detail_id = intval($request->input('plan_detail_id'));
        $newPost0->type = 0;
        if ($newPost0->save()) {
            $id = $newPost0->id;
            $postsType0 = Post::with('planDetails.document.unit', 'likes', 'comments')->where('type', 0)->where('id', $id)
                ->withCount('likes', 'comments')->get();
            $arr1 = $postsType0->map(function ($post) {
                $temp = strval($post->real_amount);
                $unit = $post->planDetails->document->unit->name;
                $timeOnly = false;
                if ($unit === '時間') {
                    $content = "$temp 時間";
                    $timeOnly = true;
                } else {
                    $content  = "$temp $unit";
                    if ($post->real_time !== null) {
                        $tmp = strval($post->real_time);
                        $content = "$content / $tmp 時間";
                    }
                }

                $likes = $post->likes->map((function ($like) {
                    return [
                        'user_id' => $like->id,
                        'username' => $like->japanese_fullname,
                    ];
                }));
                $comments = $post->comments->map((function ($comment) {
                    return [
                        'user_id' => $comment->id,
                        'username' => $comment->japanese_fullname,
                    ];
                }));

                return [
                    'id' => $post->id,
                    'memo' => $post->content,
                    'realAmount' => $post->real_amount,
                    'realTime' => $post->real_time,
                    'type' => $post->type,
                    'userId' => $post->user_id,
                    'likesCount' => $post->likes_count,
                    'commentsCount' => $post->comments_count,
                    'documentName' => $post->planDetails->document->doc_name,
                    'createdAt' => $post->created_at,
                    'content' => $content,
                    'timeOnly' => $timeOnly,
                    'likes' => $likes,
                    'comments' => $comments,
                ];
            });

            $post = $arr1->first();
            $user = User::find($post['userId'])->first();
            $post['japanese_fullname'] = $user->japanese_fullname;
            $post['avatar'] = $user->avatar;

            return response()->json([
                'data' => $post,
                'success' => true,
                'message' => 'Save new post type 1 succes!',
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Save new post type 1 failed!',
        ], 400);
    }

    public function getPostById(Request $request, $postId)
    {
        //0:progress 1:plan_edit 2:target_result
        //Chia lai cac loai Post
        //0 : 61,62,64 Post binh thuong cua user thong bao hoc tap hang ngay. Nguoi dung post
        //1 : 63,65 Bai kiem tra thanh cong hay that bai. Tu dong
        //2: 66 Tao ke hoach moi. Tu dong
        //3: 67 Tien do hoc tap 25 50 75 100. Tu dong
        $postsType0 = Post::with('planDetails.document.unit', 'likes', 'comments')->where('type', 0)
            ->withCount('likes', 'comments')->where('id', $postId)->get();
        $postsType3 = Post::with('likes', 'comments')->withCount('likes', 'comments')->where('id', $postId)->where('type', 3)->get();
        $postsType1 = Post::with('likes', 'comments', 'subPosts')->withCount('likes', 'comments')->where('id', $postId)->where('type', 1)->get();
        $postsType2 = Post::with('likes', 'comments', 'subPosts')->withCount('likes', 'comments')->where('id', $postId)->where('type', 2)->get();

        $arr4 = $postsType2->map(function ($post) {
            $likes = $post->likes->map((function ($like) {
                return [
                    'user_id' => $like->id,
                    'username' => $like->japanese_fullname,
                ];
            }));

            $comments = $post->comments->map((function ($comment) {
                return [
                    'user_id' => $comment->id,
                    'username' => $comment->japanese_fullname,
                ];
            }));

            $subPosts = $post->subPosts->map((function ($subPost) {
                return [
                    'id' => $subPost->id,
                    'postId' => $subPost->post_id,
                    'content' => $subPost->content,
                    'subContent' => $subPost->sub_content,
                    'documentName' => $subPost->document_name,
                    'type' => $subPost->type,
                ];
            }));

            return [
                'id' => $post->id,
                'content' => $post->content,
                'subContent' => $post->sub_content,
                'type' => $post->type,
                'userId' => $post->user_id,
                'likesCount' => $post->likes_count,
                'commentsCount' => $post->comments_count,
                'createdAt' => $post->created_at,
                'likes' => $likes,
                'comments' => $comments,
                'subPosts' => $subPosts,
            ];
        });

        $arr3 = $postsType1->map(function ($post) {
            $likes = $post->likes->map((function ($like) {
                return [
                    'user_id' => $like->id,
                    'username' => $like->japanese_fullname,
                ];
            }));

            $comments = $post->comments->map((function ($comment) {
                return [
                    'user_id' => $comment->id,
                    'username' => $comment->japanese_fullname,
                ];
            }));

            $subPosts = $post->subPosts->map((function ($subPost) {
                return [
                    'id' => $subPost->id,
                    'postId' => $subPost->post_id,
                    'content' => $subPost->content,
                    //'subContent' => $subPost->sub_content,
                    'contestName' => $subPost->contest_name,
                    'contestDate' => $subPost->contest_date,
                    'maxScore' => $subPost->max_score,
                    'expectedScore' => $subPost->expected_score,
                    'achievedScore' => $subPost->achieved_score,
                    'type' => $subPost->type,
                    'success' => $subPost->success,
                ];
            }));

            return [
                'id' => $post->id,
                'content' => $post->content,
                'subContent' => $post->sub_content,
                'type' => $post->type,
                'userId' => $post->user_id,
                'likesCount' => $post->likes_count,
                'commentsCount' => $post->comments_count,
                'createdAt' => $post->created_at,
                'likes' => $likes,
                'comments' => $comments,
                'subPosts' => $subPosts,
                'createdAt' => $post->created_at,
                'success' => $post->success,
            ];
        });

        $arr1 = $postsType0->map(function ($post) {
            $temp = strval($post->real_amount);
            $unit = $post->planDetails->document->unit->name;
            $timeOnly = false;
            if ($unit === '時間') {
                $content = "$temp 時間";
                $timeOnly = true;
            } else {
                $content  = "$temp $unit";
                if ($post->real_time !== null) {
                    $tmp = strval($post->real_time);
                    $content = "$content / $tmp 時間";
                }
            }

            $likes = $post->likes->map((function ($like) {
                return [
                    'user_id' => $like->id,
                    'username' => $like->japanese_fullname,
                ];
            }));

            $comments = $post->comments->map((function ($comment) {
                return [
                    'user_id' => $comment->id,
                    'username' => $comment->japanese_fullname,
                ];
            }));

            return [
                'id' => $post->id,
                'memo' => $post->content,
                'realAmount' => $post->real_amount,
                'realTime' => $post->real_time,
                'type' => $post->type,
                'userId' => $post->user_id,
                'likesCount' => $post->likes_count,
                'commentsCount' => $post->comments_count,
                'documentName' => $post->planDetails->document->doc_name,
                'createdAt' => $post->created_at,
                'content' => $content,
                'timeOnly' => $timeOnly,
                'likes' => $likes,
                'comments' => $comments,
            ];
        });

        $arr2 = $postsType3->map(function ($post) {
            $likes = $post->likes->map((function ($like) {
                return [
                    'user_id' => $like->id,
                    'username' => $like->japanese_fullname,
                ];
            }));

            $comments = $post->comments->map((function ($comment) {
                return [
                    'user_id' => $comment->id,
                    'username' => $comment->japanese_fullname,
                ];
            }));

            return [
                'id' => $post->id,
                'content' => $post->content,
                'type' => $post->type,
                'userId' => $post->user_id,
                'likesCount' => $post->likes_count,
                'commentsCount' => $post->comments_count,
                'createdAt' => $post->created_at,
                'sub_content' => $post->sub_content,
                'max_score' => $post->max_score,
                'expected_score' => $post->expected_score,
                'achieved_score' => $post->achieved_score,
                'contest_name' => $post->contest_name,
                'contest_date' => $post->contest_date,
                'document_name' => $post->document_name,
                'likes' => $likes,
                'comments' => $comments,
            ];
        });
        if ($arr1->count() > 0) {
            $post = $arr1->first();
        } elseif ($arr2->count() > 0) {
            $post = $arr2->first();
        } elseif ($arr3->count() > 0) {
            $post = $arr3->first();
        } elseif ($arr4->count() > 0) {
            $post = $arr4->first();
        } else {
            $post = null;
        }

        if ($post !== null) {
             $user = User::find($post['userId'])->first();
            $post['japanese_fullname'] = $user->japanese_fullname;
            $post['avatar'] = $user->avatar;

            return response()->json(
                [
                    'data' => $post,
                    'success' => true,
                    'message' => 'Successfully get all posts by user id',
                ],
                200
            );
        }

        return response()->json(
            [
                'data' => null,
                'success' => false,
                'message' => 'No post found',
            ],
            200
        );
    }
}
