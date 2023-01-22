<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'username' => [
                'bail',
            ],

            'password' => [
                'bail',
            ],

            'vietnamese_fullname' => [
                'bail',
            ],

            'japanese_fullname' => [
                'bail',
                'required',
                'string',
                'min:2',
                'max:64',
            ],

            'email' => [
                'bail',
                'required',
                'string',
                'unique:App\Models\User,email',
            ],

            'role' => [
                'bail',
                'required',
            ],

            'university_id' => [
                'bail',
            ],

            'grade_code' => [
                'bail',
            ],

            'company_id' => [
                'bail',
            ],

            'receive_naitei_date' => [
                'bail',
            ],

            'graduation_date' => [
                'bail',
            ],
        ];
    }
}
