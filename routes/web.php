<?php

use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\HierarchyController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return file_get_contents(public_path('index.html'));
});


Route::apiResource('employees', EmployeeController::class)->middleware([\App\Http\Middleware\CorsMiddleware::class]);
Route::get('hierarchy', [HierarchyController::class, 'getHierarchy']);

Route::get('/hierarchy/subordinates/{id}', [HierarchyController::class, 'getSubordinates']);
