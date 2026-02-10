<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Filijala (Branches)
        Schema::dropIfExists('branches');
        Schema::create('filijale', function (Blueprint $table) {
            $table->id();
            $table->string('ime');
            $table->string('adresa');
            $table->string('grad');
            $table->timestamps();
        });

        // 2. KategorijaVozila (Vehicle Categories)
        Schema::dropIfExists('vehicle_categories');
        Schema::create('kategorije_vozila', function (Blueprint $table) {
            $table->id();
            $table->enum('naziv', ['EKONOMI', 'KOMPAKT', 'SUV', 'KOMBI', 'LUKSUZ']);
            $table->decimal('cenaPoDanu', 10, 2);
            $table->timestamps();
        });

        // 3. Korisnik (Users)
        Schema::dropIfExists('users');
        Schema::create('korisnici', function (Blueprint $table) {
            $table->id();
            $table->foreignId('filijalaId')->nullable()->constrained('filijale')->onDelete('set null');
            $table->string('ime');
            $table->string('email')->unique();
            $table->string('sifra');
            $table->string('telefon')->nullable();
            $table->enum('uloga', ['KLIJENT', 'SLUZBENIK', 'ADMINISTRATOR']);
            $table->timestamp('vremeRegistracije')->useCurrent();
            $table->string('remember_token', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 4. Vozilo (Vehicles)
        Schema::dropIfExists('vehicles');
        Schema::create('vozila', function (Blueprint $table) {
            $table->id();
            $table->foreignId('filijalaId')->constrained('filijale')->onDelete('cascade');
            $table->foreignId('kategorijaId')->constrained('kategorije_vozila')->onDelete('cascade');
            $table->string('marka');
            $table->string('model');
            $table->string('registracioniBroj')->unique();
            $table->decimal('cenaPoDanu', 10, 2);
            $table->enum('status', ['DOSTUPNO', 'U_NAJMU', 'SERVIS', 'NEAKTIVNO']);
            $table->string('image_url')->nullable();
            $table->integer('godiste')->nullable();
            $table->string('gorivo')->nullable();
            $table->string('menjac')->nullable();
            $table->integer('sedista')->nullable();
            $table->timestamps();
        });

        // 5. Rezervacija (Reservations)
        Schema::dropIfExists('reservations');
        Schema::create('rezervacije', function (Blueprint $table) {
            $table->id();
            $table->foreignId('korisnikId')->constrained('korisnici')->onDelete('cascade');
            $table->foreignId('voziloId')->constrained('vozila')->onDelete('cascade');
            $table->foreignId('filijalaPreuzimanjaId')->constrained('filijale')->onDelete('cascade');
            $table->foreignId('filijalaVracanjaId')->constrained('filijale')->onDelete('cascade');
            $table->dateTime('vremePreuzimanja');
            $table->dateTime('vremeVracanja');
            $table->decimal('ukupnaCena', 10, 2);
            $table->integer('kmPreuzimanje')->nullable();
            $table->integer('kmVracanje')->nullable();
            $table->integer('gorivoPreuzimanje')->nullable(); // u procentima npr. 100%
            $table->integer('gorivoVracanje')->nullable();
            $table->enum('status', ['CEKA', 'POTVRDJENA', 'PREUZETO', 'VRACENO', 'OTKAZANA', 'ZAVRSENA']);
            $table->timestamp('vremeKreiranja')->useCurrent();
            $table->text('napomene')->nullable();
            $table->timestamps();
        });

        // 6. Placanje (Payments)
        Schema::dropIfExists('payments');
        Schema::create('placanja', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rezervacijaId')->constrained('rezervacije')->onDelete('cascade');
            $table->decimal('iznos', 10, 2);
            $table->enum('status', ['CEKA', 'PLACENO', 'NEUSPELO']);
            $table->string('metodaPlacanja')->nullable();
            $table->string('providerRef')->nullable();
            $table->timestamp('vremePlacanja')->nullable();
            $table->timestamps();
        });

        // 7. IzvestajOSteti (Damage Reports)
        Schema::create('izvestaji_o_steti', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rezervacijaId')->constrained('rezervacije')->onDelete('cascade');
            $table->text('opisStete');
            $table->decimal('dodatniTrosak', 10, 2)->default(0);
            $table->timestamp('vremeKreiranja')->useCurrent();
            $table->timestamps();
        });

        // 8. Recenzija (Reviews)
        Schema::create('recenzije', function (Blueprint $table) {
            $table->id();
            $table->foreignId('korisnikId')->constrained('korisnici')->onDelete('cascade');
            $table->foreignId('voziloId')->constrained('vozila')->onDelete('cascade');
            $table->foreignId('rezervacijaId')->nullable()->constrained('rezervacije')->onDelete('set null');
            $table->integer('ocena');
            $table->text('komentar')->nullable();
            $table->timestamps();
        });

        // 9. Zalba (Complaints)
        Schema::create('zalbe', function (Blueprint $table) {
            $table->id();
            $table->foreignId('korisnikId')->constrained('korisnici')->onDelete('cascade');
            $table->foreignId('rezervacijaId')->nullable()->constrained('rezervacije')->onDelete('set null');
            $table->string('naslov');
            $table->text('sadrzaj');
            $table->enum('status', ['PODNETA', 'U_OBRADI', 'RESENA', 'ODBIJENA'])->default('PODNETA');
            $table->text('resenje')->nullable();
            $table->timestamps();
        });

        // 10. Dokument (Documents)
        Schema::create('dokumenti', function (Blueprint $table) {
            $table->id();
            $table->foreignId('korisnikId')->constrained('korisnici')->onDelete('cascade');
            $table->string('naziv');
            $table->string('putanja');
            $table->string('tip'); // npr. Licna karta, Vozacka dozvola
            $table->boolean('verifikovan')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('izvestaji_o_steti');
        Schema::dropIfExists('recenzije');
        Schema::dropIfExists('zalbe');
        Schema::dropIfExists('dokumenti');
        Schema::dropIfExists('placanja');
        Schema::dropIfExists('rezervacije');
        Schema::dropIfExists('vozila');
        Schema::dropIfExists('korisnici');
        Schema::dropIfExists('kategorije_vozila');
        Schema::dropIfExists('filijale');
    }
};
