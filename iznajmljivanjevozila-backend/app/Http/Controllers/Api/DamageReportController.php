<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DamageReport;
use App\Models\Rezervacija;
use App\Models\Aktivnost;
use Illuminate\Http\Request;

class DamageReportController extends Controller
{
    /**
     * Get damage reports for a reservation
     */
    public function index($reservationId)
    {
        $reports = DamageReport::where('rezervacijaId', $reservationId)->get();
        return response()->json($reports);
    }

    /**
     * Store a new damage report
     */
    public function store(Request $request)
    {
        $request->validate([
            'rezervacijaId' => 'required|exists:rezervacije,id',
            'opisStete' => 'required|string',
            'dodatniTrosak' => 'nullable|numeric|min:0',
        ]);

        $report = DamageReport::create([
            'rezervacijaId' => $request->rezervacijaId,
            'opisStete' => $request->opisStete,
            'dodatniTrosak' => $request->dodatniTrosak ?? 0,
        ]);

        Aktivnost::create([
            'korisnikId' => auth()->user()->id,
            'akcija' => 'DAMAGE_REPORT_CREATED',
            'detalji' => "Prijavljena šteta za rezervaciju #{$report->rezervacijaId}: {$report->opisStete}",
            'tip' => 'error'
        ]);

        return response()->json([
            'message' => 'Izveštaj o šteti uspešno kreiran',
            'report' => $report
        ], 201);
    }
}
