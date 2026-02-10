<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vozilo;
use App\Models\User;
use App\Models\Rezervacija;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    /**
     * Get system statistics (Admin only)
     */
    public function index()
    {
        return response()->json([
            'total_vehicles' => Vozilo::count(),
            'total_users' => User::count(),
            'total_reservations' => Rezervacija::count(),
            'total_revenue' => (float) Rezervacija::where('status', '!=', 'OTKAZANA')->sum('ukupnaCena'),
            'vehicles_by_status' => Vozilo::select('status', DB::raw('count(*) as total'))->groupBy('status')->get(),
            'latest_reservations' => Rezervacija::with(['korisnik', 'vozilo'])->latest()->take(5)->get(),
        ]);
    }
}
