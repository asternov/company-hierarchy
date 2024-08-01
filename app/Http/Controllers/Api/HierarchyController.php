<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Hierarchy;

class HierarchyController extends Controller
{

    /**
     * Display a listing of the hierarchy.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHierarchy()
    {
        // Fetch top-level employees who don't have a manager (top-level managers)
        $topManagers = Employee::whereNull('manager_id')
            ->withCount('subordinates')
            ->get();

        return response()->json($topManagers);
    }

    /**
     * Get subordinates of a specific employee, with count of their subordinates.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSubordinates($id)
    {
        // Fetch direct subordinates with their subordinate count
        $subordinates = Employee::where('manager_id', $id)
            ->withCount('subordinates')
            ->get();

        return response()->json($subordinates);
    }
}
