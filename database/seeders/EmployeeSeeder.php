<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class EmployeeSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Step 1: Create the top-level boss
        $boss = Employee::create([
            'first_name' => $faker->firstName,
            'last_name' => $faker->lastName,
            'position' => 'CEO', // Top-level position
            'email' => $faker->unique()->safeEmail,
            'phone' => $faker->phoneNumber,
            'notes' => $faker->sentence,
            'created_at' => now(),
            'updated_at' => now(),
            'manager_id' => null, // No manager for the top boss
        ]);

        // Array to keep track of first-level subordinates
        $firstLevelSubordinates = [];

        // Step 2: Create 20 direct subordinates of the boss
        for ($i = 0; $i < 20; $i++) {
            $firstLevelSubordinates[] = Employee::create([
                'first_name' => $faker->firstName,
                'last_name' => $faker->lastName,
                'position' => $faker->jobTitle,
                'email' => $faker->unique()->safeEmail,
                'phone' => $faker->phoneNumber,
                'notes' => $faker->sentence,
                'created_at' => now(),
                'updated_at' => now(),
                'manager_id' => $boss->id, // Assigning to the boss
            ]);
        }

        // Array to keep track of second-level subordinates
        $secondLevelSubordinates = [];

        // Step 3: Create 20 subordinates for each of the boss's direct subordinates
        foreach ($firstLevelSubordinates as $firstLevelSubordinate) {
            for ($j = 0; $j < 20; $j++) {
                $secondLevelSubordinates[] = Employee::create([
                    'first_name' => $faker->firstName,
                    'last_name' => $faker->lastName,
                    'position' => $faker->jobTitle,
                    'email' => $faker->unique()->safeEmail,
                    'phone' => $faker->phoneNumber,
                    'notes' => $faker->sentence,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'manager_id' => $firstLevelSubordinate->id, // Assigning to the first-level subordinate
                ]);
            }
        }

        // Step 4: Create 20 subordinates for each second-level subordinate
        foreach ($secondLevelSubordinates as $secondLevelSubordinate) {
            for ($k = 0; $k < 20; $k++) {
                Employee::create([
                    'first_name' => $faker->firstName,
                    'last_name' => $faker->lastName,
                    'position' => $faker->jobTitle,
                    'email' => $faker->unique()->safeEmail,
                    'phone' => $faker->phoneNumber,
                    'notes' => $faker->sentence,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'manager_id' => $secondLevelSubordinate->id, // Assigning to the second-level subordinate
                ]);
            }
        }
    }
}
