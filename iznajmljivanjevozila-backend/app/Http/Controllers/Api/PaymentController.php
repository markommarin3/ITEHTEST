<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Placanje;
use App\Models\Rezervacija;
use App\Models\Aktivnost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Procesuiranje plaćanja
     */
    public function process(Request $request)
    {
        $request->validate([
            'rezervacijaId' => 'required|exists:rezervacije,id',
            'iznos' => 'required|numeric',
            'metodPlacanja' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            $placanje = Placanje::create([
                'rezervacijaId' => $request->rezervacijaId,
                'iznos' => $request->iznos,
                'metodPlacanja' => $request->metodPlacanja,
                'status' => 'USPESNO',
                'vremePlacanja' => now(),
            ]);

            Aktivnost::create([
                'korisnikId' => $request->user()->id,
                'akcija' => 'PAYMENT_SUCCESS',
                'detalji' => "Uspešno plaćanje za rezervaciju #{$placanje->rezervacijaId} (Iznos: {$placanje->iznos} €)",
                'tip' => 'success'
            ]);

            // Ažuriraj status rezervacije
            $rezervacija = Rezervacija::find($request->rezervacijaId);
            $rezervacija->update(['status' => 'POTVRDJENA']);

            DB::commit();

            return response()->json([
                'message' => 'Plaćanje uspešno procesuirano',
                'data' => $placanje
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Greška pri plaćanju: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Prikaz detalja plaćanja
     */
    public function show($id)
    {
        $placanje = Placanje::with('rezervacija')->findOrFail($id);
        return response()->json($placanje);
    }
}
