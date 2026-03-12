<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Vozilo;

class VehicleTest extends TestCase
{
    public function test_vehicle_model_can_be_instantiated()
    {
        $vozilo = new Vozilo([
            'marka' => 'BMW',
            'model' => 'X5',
            'cenaPoDanu' => 120
        ]);

        $this->assertEquals('BMW', $vozilo->marka);
        $this->assertEquals('X5', $vozilo->model);
        $this->assertEquals(120, $vozilo->cenaPoDanu);
    }
}
