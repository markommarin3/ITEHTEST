<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rezervacija;
use App\Models\Vozilo;
use App\Models\Aktivnost;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $userRole = strtoupper($user->uloga);
        $query = Rezervacija::with(['vozilo', 'korisnik', 'filijalaPreuzimanja', 'filijalaVracanja', 'placanje', 'izvestajiOSteti']);


        if ($userRole === 'KLIJENT') {
            $query->where('korisnikId', $user->id);
        }



        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $reservations = $query->orderBy('vremeKreiranja', 'desc')->paginate(12);

        return response()->json($reservations);
    }

    public function show($id)
    {
        $reservation = Rezervacija::with(['vozilo', 'korisnik', 'filijalaPreuzimanja', 'filijalaVracanja', 'placanje'])->findOrFail($id);
        
        $user = auth()->user();
        if ($user->uloga === 'KLIJENT' && $reservation->korisnikId !== $user->id) {
            return response()->json(['message' => 'Niste ovlašćeni za pregled ove rezervacije.'], 403);
        }

        if ($user->uloga === 'SLUZBENIK') {
            if ($reservation->filijalaPreuzimanjaId !== $user->filijalaId && $reservation->filijalaVracanjaId !== $user->filijalaId) {
                return response()->json(['message' => 'Ova rezervacija ne pripada Vašoj filijali.'], 403);
            }
        }

        return response()->json($reservation);
    }


    public function store(Request $request)
    {
        $request->validate([
            'voziloId' => 'required|exists:vozila,id',
            'filijalaPreuzimanjaId' => 'required|exists:filijale,id',
            'filijalaVracanjaId' => 'required|exists:filijale,id',
            'vremePreuzimanja' => 'required|date|after:today',
            'vremeVracanja' => 'required|date|after:vremePreuzimanja',
            'napomene' => 'nullable|string',
            'korisnikId' => 'nullable|exists:korisnici,id',
        ]);

        $vehicle = Vozilo::findOrFail($request->voziloId);
        

        $pickup = new \DateTime($request->vremePreuzimanja);
        $return = new \DateTime($request->vremeVracanja);
        $diff = $pickup->diff($return);
        $days = max(1, $diff->days + ($diff->h > 0 ? 1 : 0));
        
        $ukupnaCena = $days * $vehicle->cenaPoDanu;

        $targetKorisnikId = $request->user()->id;
        if (in_array($request->user()->uloga, ['ADMINISTRATOR', 'SLUZBENIK']) && $request->has('korisnikId')) {
            $targetKorisnikId = $request->korisnikId;
        }

        $exists = Rezervacija::where('voziloId', $request->voziloId)
            ->whereIn('status', ['CEKA', 'POTVRDJENA', 'PREUZETO'])
            ->where(function ($q) use ($request) {
                $q->whereBetween('vremePreuzimanja', [$request->vremePreuzimanja, $request->vremeVracanja])
                  ->orWhereBetween('vremeVracanja', [$request->vremePreuzimanja, $request->vremeVracanja])
                  ->orWhere(function ($q) use ($request) {
                      $q->where('vremePreuzimanja', '<=', $request->vremePreuzimanja)
                        ->where('vremeVracanja', '>=', $request->vremeVracanja);
                  });
            })->exists();

        if ($exists) {
            return response()->json(['message' => 'Vozilo nije dostupno u izabranom terminu.'], 400);
        }

        $reservation = Rezervacija::create([
            'korisnikId' => $targetKorisnikId,
            'voziloId' => $request->voziloId,
            'filijalaPreuzimanjaId' => $request->filijalaPreuzimanjaId,
            'filijalaVracanjaId' => $request->filijalaVracanjaId,
            'vremePreuzimanja' => $request->vremePreuzimanja,
            'vremeVracanja' => $request->vremeVracanja,
            'ukupnaCena' => $ukupnaCena,
            'status' => 'CEKA',
            'napomene' => $request->napomene,
        ]);

        Aktivnost::create([
            'korisnikId' => $request->user()->id,
            'akcija' => 'RESERVATION_CREATED',
            'detalji' => "Kreirana nova rezervacija #{$reservation->id} za vozilo {$vehicle->marka} {$vehicle->model}",
            'tip' => 'info'
        ]);

        return response()->json([
            'message' => 'Rezervacija uspešno kreirana.',
            'reservation' => $reservation,
        ], 201);
    }

    public function getUnavailableDates($vehicleId)
    {
        $reservations = Rezervacija::where('voziloId', $vehicleId)
            ->whereIn('status', ['CEKA', 'POTVRDJENA', 'PREUZETO'])
            ->select('vremePreuzimanja', 'vremeVracanja', 'status')
            ->orderBy('vremePreuzimanja', 'asc')
            ->get();

        return response()->json($reservations);
    }

    public function update(Request $request, $id)
    {
        $reservation = Rezervacija::findOrFail($id);
        $user = $request->user();
        $userRole = strtoupper($user->uloga);

        $request->validate([
            'status' => 'sometimes|in:CEKA,POTVRDJENA,PREUZETO,VRACENO,OTKAZANA,ZAVRSENA',
            'napomene' => 'nullable|string',
            'kmPreuzimanje' => 'nullable|integer',
            'kmVracanje' => 'nullable|integer',
            'gorivoPreuzimanje' => 'nullable|integer|min:0|max:100',
            'gorivoVracanje' => 'nullable|integer|min:0|max:100',
            'voziloId' => 'nullable|exists:vozila,id',
            'vremePreuzimanja' => 'nullable|date',
            'vremeVracanja' => 'nullable|date|after:vremePreuzimanja',
        ]);


        if ($userRole === 'KLIJENT') {
            if ($reservation->korisnikId !== $user->id) {
                return response()->json(['message' => 'Niste ovlašćeni za ove izmene.'], 403);
            }
            if ($request->has('status') && $request->status !== 'OTKAZANA') {
                return response()->json(['message' => 'Klijenti mogu samo da otkažu rezervaciju.'], 403);
            }
        }
        


        if ($request->has('voziloId') || $request->has('vremePreuzimanja') || $request->has('vremeVracanja')) {

            $allowedStatuses = ($userRole === 'KLIJENT') ? ['CEKA'] : ['CEKA', 'POTVRDJENA'];
            
            if (!in_array($reservation->status, $allowedStatuses)) {
                 return response()->json(['message' => 'Možete menjati samo rezervacije koje su na čekanju ili potvrđene.'], 400);
            }

            $voziloId = $request->voziloId ?? $reservation->voziloId;
            $vremePreuzimanja = $request->vremePreuzimanja ?? $reservation->vremePreuzimanja;
            $vremeVracanja = $request->vremeVracanja ?? $reservation->vremeVracanja;


            $pickup = new \DateTime($vremePreuzimanja);
            $return = new \DateTime($vremeVracanja);
            
            if ($pickup >= $return) {
                 return response()->json(['message' => 'Vreme vraćanja mora biti posle vremena preuzimanja.'], 400);
            }


            $diff = $pickup->diff($return);
            $days = max(1, $diff->days + ($diff->h > 0 ? 1 : 0));
            
            $vehicle = Vozilo::findOrFail($voziloId);
            $novaCena = $days * $vehicle->cenaPoDanu;


            $existing = Rezervacija::where('voziloId', $voziloId)
                ->where('id', '!=', $id)
                ->whereIn('status', ['CEKA', 'POTVRDJENA', 'PREUZETO'])
                ->where(function ($q) use ($vremePreuzimanja, $vremeVracanja) {
                    $q->whereBetween('vremePreuzimanja', [$vremePreuzimanja, $vremeVracanja])
                      ->orWhereBetween('vremeVracanja', [$vremePreuzimanja, $vremeVracanja])
                      ->orWhere(function ($q) use ($vremePreuzimanja, $vremeVracanja) {
                          $q->where('vremePreuzimanja', '<=', $vremePreuzimanja)
                            ->where('vremeVracanja', '>=', $vremeVracanja);
                      });
                })->exists();

            if ($existing) {
                return response()->json(['message' => 'Vozilo nije dostupno u izabranom terminu.'], 400);
            }

            $reservation->fill([
                'voziloId' => $voziloId,
                'vremePreuzimanja' => $vremePreuzimanja,
                'vremeVracanja' => $vremeVracanja,
                'ukupnaCena' => $novaCena
            ]);
        }

        $requestData = $request->only([
            'status', 'napomene', 
            'kmPreuzimanje', 'kmVracanje', 
            'gorivoPreuzimanje', 'gorivoVracanje'
        ]);

        $reservation->update($requestData);


        if ($reservation->status === 'VRACENO' || $reservation->status === 'ZAVRSENA') {
            $reservation->vozilo->update(['status' => 'DOSTUPNO']);
            
            if ($reservation->status === 'ZAVRSENA') {
                Aktivnost::create([
                    'korisnikId' => $user->id,
                    'akcija' => 'RENTAL_FINISHED',
                    'detalji' => "Završen najam za vozilo: {$reservation->vozilo->marka} {$reservation->vozilo->model} (Korisnik: {$reservation->korisnik->ime})",
                    'tip' => 'success'
                ]);
            }
        } elseif ($reservation->status === 'PREUZETO') {
            $reservation->vozilo->update(['status' => 'U_NAJMU']);
        }

        if ($request->has('status')) {
            Aktivnost::create([
                'korisnikId' => $user->id,
                'akcija' => 'RESERVATION_STATUS_CHANGED',
                'detalji' => "Izmenjen status rezervacije #{$reservation->id} na {$reservation->status}",
                'tip' => 'info'
            ]);
        }

        return response()->json([
            'message' => 'Rezervacija ažurirana.',
            'reservation' => $reservation->load('vozilo'),
        ]);
    }

    public function destroy($id)
    {
        $reservation = Rezervacija::findOrFail($id);
        $reservation->update(['status' => 'OTKAZANA']);

        Aktivnost::create([
            'korisnikId' => auth()->user()->id,
            'akcija' => 'RESERVATION_CANCELLED',
            'detalji' => "Otkazana rezervacija #{$reservation->id}",
            'tip' => 'warning'
        ]);

        return response()->json([
            'message' => 'Rezervacija uspešno otkazana.',
        ]);
    }
}
