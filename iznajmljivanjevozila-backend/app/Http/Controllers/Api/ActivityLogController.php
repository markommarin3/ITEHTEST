<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Aktivnost;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index()
    {
        $logs = Aktivnost::with('korisnik')
            ->orderBy('created_at', 'desc')
            ->paginate(20);
            
        return response()->json($logs);
    }
}
