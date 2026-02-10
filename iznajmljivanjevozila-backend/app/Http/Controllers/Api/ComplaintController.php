<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Zalba;
use App\Models\Aktivnost;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    /**
     * Prikaz liste svih žalbi
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Zalba::with(['korisnik', 'rezervacija']);

        if ($user->uloga === 'KLIJENT') {
            $query->where('korisnikId', $user->id);
        }

        $complaints = $query->latest()->paginate(20);
        return response()->json($complaints);
    }

    /**
     * Podnošenje nove žalbe
     */
    public function store(Request $request)
    {
        $request->validate([
            'naslov' => 'required|string|max:255',
            'sadrzaj' => 'required|string|max:2000',
            'rezervacijaId' => 'nullable|exists:rezervacije,id',
        ]);

        $complaint = Zalba::create([
            'korisnikId' => $request->user()->id,
            'rezervacijaId' => $request->rezervacijaId,
            'naslov' => $request->naslov,
            'sadrzaj' => $request->sadrzaj,
            'status' => 'PODNETA',
        ]);

        Aktivnost::create([
            'korisnikId' => $request->user()->id,
            'akcija' => 'COMPLAINT_SUBMITTED',
            'detalji' => "Podneta nova žalba: {$complaint->naslov}",
            'tip' => 'info'
        ]);

        return response()->json([
            'message' => 'Žalba uspešno podneta',
            'complaint' => $complaint,
        ], 201);
    }

    /**
     * Rešavanje žalbe (samo Admin/Službenik)
     */
    public function update(Request $request, $id)
    {
        $complaint = Zalba::findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:U_OBRADI,RESENA,ODBIJENA',
            'resenje' => 'required|string|max:2000',
        ]);

        $complaint->update([
            'status' => $request->status,
            'resenje' => $request->resenje,
        ]);

        Aktivnost::create([
            'korisnikId' => auth()->user()->id,
            'akcija' => 'COMPLAINT_RESOLVED',
            'detalji' => "Govor na žalbu #{$complaint->id} je poslat (Status: {$complaint->status})",
            'tip' => 'success'
        ]);

        return response()->json([
            'message' => 'Odgovor na žalbu je uspešno sačuvan',
            'complaint' => $complaint->load(['korisnik', 'rezervacija']),
        ]);
    }
}
