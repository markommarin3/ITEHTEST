<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;
    public function test_vozila_api_returns_success()
    {
        $response = $this->get('/api/vehicles');

        $response->assertStatus(200);
    }

    public function test_login_page_is_accessible()
    {
        $response = $this->get('/api/login');
        
        $this->assertTrue(in_array($response->status(), [200, 405]));
    }
}
