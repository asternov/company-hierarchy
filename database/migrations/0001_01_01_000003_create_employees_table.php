<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('position')->nullable();
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->integer('manager_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('hierarchy', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manager_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hierarchy');
        Schema::dropIfExists('employees');
    }
};
