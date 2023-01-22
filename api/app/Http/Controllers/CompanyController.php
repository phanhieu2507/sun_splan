<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\University;

class CompanyController extends Controller
{
    public function getAllCompanies(): \Illuminate\Http\JsonResponse
    {
        $companies = Company::all();

        return response()->json([
            'data' => $companies,
            'success' => true,
        ], 200);
    }

    public function getAllCompaniesUniversities(): \Illuminate\Http\JsonResponse
    {
        $companies = Company::query()
            ->select(
                'id',
                'company_name',
            )
            ->get();

        $universities = University::query()
            ->select(
                'id',
                'name',
                'abbreviation',
            )
            ->get();
        foreach ($universities as $university) {
            $code = $university->gradeCodes()->select('code')->get();
            $university['code'] = $code;
        }

        return response()->json([
            'success' => true,
            'message' => 'Get data successfully',
            'companies' => $companies,
            'universities' => $universities,
        ]);
    }
}
