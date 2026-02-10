<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dokument;
use App\Models\Aktivnost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * Preuzimanje svih dokumenata za ulogovanog korisnika
     */
    public function index(Request $request)
    {
        $documents = Dokument::where('korisnikId', $request->user()->id)->get();

        return response()->json($documents);
    }

    /**
     * Otpremanje dokumenta
     */
    public function upload(Request $request)
    {
        $request->validate([
            'tip' => 'required|in:vozacka_dozvola,licna_karta,pasos',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120', // 5MB max
        ]);

        // Kreiranje direktorijuma ako ne postoji
        if (!Storage::disk('public')->exists('documents')) {
            Storage::disk('public')->makeDirectory('documents');
        }

        $file = $request->file('file');
        $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
        $path = $file->storeAs('documents', $filename, 'public');

        try {
            $document = Dokument::create([
                'korisnikId' => $request->user()->id,
                'tip' => $request->tip,
                'naziv' => $file->getClientOriginalName(),
                'putanja' => 'storage/' . $path,
                'verifikovan' => false,
                'status' => 'PENDING',
            ]);

            Aktivnost::create([
                'korisnikId' => $request->user()->id,
                'akcija' => 'DOCUMENT_UPLOADED',
                'detalji' => "Otpremljen novi dokument: {$document->naziv} ({$document->tip})",
                'tip' => 'info'
            ]);

            return response()->json([
                'message' => 'Dokument uspešno otpremljen',
                'document' => $document,
            ], 201);
        } catch (\Exception $e) {
            Storage::disk('public')->delete($path);
            return response()->json([
                'message' => 'Greška pri čuvanju dokumenta: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Brisanje dokumenta
     */
    public function destroy($id)
    {
        $document = Dokument::findOrFail($id);

        if ($document->korisnikId !== auth()->id()) {
            return response()->json(['message' => 'Nemate ovlašćenje za ovo brisanje.'], 403);
        }

        // Brisanje fajla iz storage-a
        $relative_path = str_replace('storage/', '', $document->putanja);
        if (Storage::disk('public')->exists($relative_path)) {
            Storage::disk('public')->delete($relative_path);
        }

        $document->delete();

        return response()->json([
            'message' => 'Dokument uspešno obrisan',
        ]);
    }

    /**
     * Get all documents for staff/admin review
     */
    public function getAllDocuments(Request $request)
    {
        $query = Dokument::with('korisnik')->orderBy('created_at', 'desc');

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $documents = $query->get();

        return response()->json($documents);
    }

    /**
     * Approve document
     */
    public function approve($id)
    {
        $document = Dokument::findOrFail($id);
        
        $document->update([
            'status' => 'APPROVED',
            'verifikovan' => true,
        ]);

        Aktivnost::create([
            'korisnikId' => auth()->id(),
            'akcija' => 'DOCUMENT_APPROVED',
            'detalji' => "Odobren dokument #{$document->id} za korisnika ID: {$document->korisnikId}",
            'tip' => 'success'
        ]);

        return response()->json([
            'message' => 'Dokument je odobren',
            'document' => $document,
        ]);
    }

    /**
     * Reject document
     */
    public function reject($id)
    {
        $document = Dokument::findOrFail($id);
        
        $document->update([
            'status' => 'REJECTED',
            'verifikovan' => false,
        ]);

        Aktivnost::create([
            'korisnikId' => auth()->id(),
            'akcija' => 'DOCUMENT_REJECTED',
            'detalji' => "Odbijen dokument #{$document->id} za korisnika ID: {$document->korisnikId}",
            'tip' => 'warning'
        ]);

        return response()->json([
            'message' => 'Dokument je odbijen',
            'document' => $document,
        ]);
    }
}
