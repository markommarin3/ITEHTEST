<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recenzija;
use App\Models\Aktivnost;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Prikaz liste svih recenzija
     */
    public function index()
    {
        $reviews = Recenzija::with(['korisnik', 'vozilo'])->latest()->paginate(20);
        return response()->json($reviews);
    }

    /**
     * Slanje nove recenzije
     */
    public function store(Request $request)
    {
        $request->validate([
            'voziloId' => 'required|exists:vozila,id',
            'ocena' => 'required|integer|min:1|max:5',
            'komentar' => 'required|string|max:1000',
        ]);

        $review = Recenzija::create([
            'korisnikId' => $request->user()->id,
            'voziloId' => $request->voziloId,
            'ocena' => $request->ocena,
            'komentar' => $request->komentar,
        ]);

        Aktivnost::create([
            'korisnikId' => $request->user()->id,
            'akcija' => 'REVIEW_SUBMITTED',
            'detalji' => "Ostavljena recenzija ({$review->ocena}/5) za vozilo #{$review->voziloId}",
            'tip' => 'info'
        ]);

        return response()->json([
            'message' => 'Recenzija uspešno poslata',
            'review' => $review->load('korisnik'),
        ], 201);
    }
}
