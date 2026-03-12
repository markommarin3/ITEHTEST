<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Vozilo;

class VehicleApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_vehicles_list_is_accessible()
    {
        $response = $this->getJson('/api/vehicles');

        $response->assertStatus(200);
    }

    public function test_available_vehicles_scope()
    {
        $response = $this->getJson('/api/vehicles?status=DOSTUPNO');
        
        $response->assertStatus(200);
    }
}
