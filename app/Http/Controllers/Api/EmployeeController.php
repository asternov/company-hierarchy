<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employee;
class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::all();
        return response()->json($employees);
    }

    public function store(Request $request)
    {
        $employee = Employee::create($request->all());
        return response()->json($employee, 201);
    }

    public function show($id)
    {
        $employee = Employee::findOrFail($id);
        return response()->json($employee);
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);
        $employee->update($request->all());

        return response()->json($employee);
    }

    // Remove the specified employee
    public function destroy($id)
    {
        // Fetch the employee to get their manager_id
        $employee = Employee::findOrFail($id);
        $managerId = $employee->manager_id;

        // Reassign subordinates of the employee to their manager
        Employee::where('manager_id', $id)->update(['manager_id' => $managerId]);

        // Delete the employee
        $employee->delete();
        return response()->json(null, 204);
    }
}
