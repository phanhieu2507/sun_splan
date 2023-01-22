<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Image;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class DocumentController extends Controller
{
    public function createDocument(Request $request)
    {
        try {
            $doc = Document::create([
                'doc_name' => $request->doc_name,
                'limit' => $request->limit,
                'url' => $request->url,
                'doc_content' => $request->doc_content,
                'unit_id' => $request->unit_id,
                'category_id' => $request->category_id,
                'user_id' => $request->user_id,
            ]);
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imageName = time().rand(1, 100).$image->getClientOriginalName();

                    if ($image->move(public_path('images/'), $imageName)) {
                        Image::create([
                            'img_link' => asset('images/'.$imageName),
                            'type_id' => $doc->id,
                        ]);
                    }
                }
            }

            if ($request->hasFile('thumbnail')) {
                foreach ($request->file('thumbnail') as $image) {
                    $imageName = time().rand(1, 100).$image->getClientOriginalName();

                    if ($image->move(public_path('images/'), $imageName)) {
                        Image::create([
                            'img_link' => asset('images/'.$imageName),
                            'is_thumbnail' => 1,
                            'type_id' => $doc->id,
                        ]);
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Document created',
                'data' => $doc,
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function editDocument(Request $request)
    {
        try {
            $doc = Document::find($request->id);
            $doc->doc_name = $request->doc_name;
            $doc->limit = $request->limit;
            $doc->url = $request->url;
            $doc->doc_content = $request->doc_content;
            $doc->unit_id = $request->unit_id;
            $doc->category_id = $request->category_id;
            $doc->save();

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imageName = time().rand(1, 100).$image->getClientOriginalName();

                    if ($image->move(public_path('images/'), $imageName)) {
                        Image::create([
                            'img_link' => asset('images/'.$imageName),
                            'type_id' => $doc->id,
                        ]);
                    }
                }
            }

            if ($request->hasFile('thumbnail')) {
                foreach ($request->file('thumbnail') as $image) {
                    $imageName = time().rand(1, 100).$image->getClientOriginalName();

                    if ($image->move(public_path('images/'), $imageName)) {
                        Image::create([
                            'img_link' => asset('images/'.$imageName),
                            'is_thumbnail' => 1,
                            'type_id' => $doc->id,
                        ]);
                    }
                }
            }

            if ($request->has('delete')) {
                foreach ($request->delete as $file) {
                    $data = json_decode($file);
                    if (File::exists(public_path('images/'.$data->name))) {
                        File::delete(public_path('images/'.$data->name));
                        Image::find($data->uid)->delete();
                    }
                }
            }

            $doc->category;
            $doc->unit;
            $doc->images;

            return response()->json([
                'success' => true,
                'message' => 'Document edited',
                'data' => $doc,
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function deleteDocument($docId)
    {
        try {
            $document = Document::find($docId);
            if ($document) {
                $document->delete();

                return response()->json([
                    'success' => true,
                    'message' => 'Document deleted',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'Document not found',
            ], 404);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function getAllDocs()
    {
        $docs = Document::orderBy('id', 'DESC')->paginate(12);

        foreach ($docs as $doc) {
            $doc->category;
            $doc->unit;
            $doc->images;
        }

        return response()->json([
            'success' => true,
            'data' => $docs,
        ]);
    }

    public function searchDocs(Request $request)
    {
        try {
            if ($request->has('category_id') && $request->has('unit_id')) {
                $docs = Document::with('category', 'unit', 'images')
                    ->where('doc_name', 'like', '%'.$request->name.'%')
                    ->where('category_id', $request->category_id)
                    ->where('unit_id', $request->unit_id)
                    ->orderBy('id', 'DESC')
                    ->paginate(12);
            } elseif ($request->has('category_id')) {
                $docs = Document::with('category', 'unit', 'images')
                    ->where('doc_name', 'like', '%'.$request->name.'%')
                    ->where('category_id', $request->category_id)
                    ->orderBy('id', 'DESC')
                    ->paginate(12);
            } elseif ($request->has('unit_id')) {
                $docs = Document::with('category', 'unit', 'images')
                    ->where('doc_name', 'like', '%'.$request->name.'%')
                    ->where('unit_id', $request->unit_id)
                    ->orderBy('id', 'DESC')
                    ->paginate(12);
            } else {
                $docs = Document::with('category', 'unit', 'images')
                    ->where('doc_name', 'like', '%'.$request->name.'%')
                    ->orderBy('id', 'DESC')
                    ->paginate(12);
            }

            $data = $docs->getCollection();

            $data = $data->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'doc_name' => $doc->doc_name,
                    'limit' => $doc->limit,
                    'url' => $doc->url,
                    'doc_content' => $doc->doc_content,
                    'unit' => $doc->unit->name,
                    'category' => $doc->category->name,
                    'images' => $doc->images,
                ];
            });

            $docs->setCollection($data);

            return response()->json([
                'success' => true,
                'data' => $docs,
            ]);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function getDocById($id)
    {
        $docId = $id;
        $document = Document::with('unit', 'category', 'images')->where('id', $docId)->first();
        $document->images;
        $document->unit;
        $document->category;
        if ($document) {
            return response()->json([
                'success' => true,
                'data' => $document,
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Document is not found',
        ], 404);
    }

    public function saveImage(Request $request)
    {
        $image = $request->image;

        //$name = time().rand(1, 100).$image->getClientOriginalName();
        //$image->move(public_path('images/'), $name);
        return response()->json([
            'data' => $image->getClientOriginalName(),
        ]);
    }
}
