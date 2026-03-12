<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    description: "Swagger API dokumentacija",
    title: "Iznajmljivanje Vozila API"
)]
#[OA\Server(
    url: "http://localhost:8000",
    description: "Lokalni API Server"
)]
abstract class Controller
{
    //
}
