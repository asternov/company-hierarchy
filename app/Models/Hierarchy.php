<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hierarchy extends Model
{
    use HasFactory;
    protected $table ='hierarchy';

    protected $fillable = ['manager_id', 'employee_id'];

    public function manager()
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
}
